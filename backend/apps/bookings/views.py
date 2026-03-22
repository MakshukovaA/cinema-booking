from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.views import APIView

from apps.bookings.models import Booking, BookingSeat
from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    BookingDetailSerializer,
    BookingSeatSerializer,
    BookingInfoSerializer,
    BookingFormSerializer,
)
from apps.seats.models import Seat
from apps.sessions.models import Session
from apps.core.permissions import AdminOrGuestReadOnly, IsAdminGroup, IsOwnerOrAdmin


class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    permission_classes = [IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BookingCreateSerializer
        return BookingDetailSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        self.check_object_permissions(request, instance)
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        new_seat_ids = request.data.get('seat_ids', [])
        if new_seat_ids:
            BookingSeat.objects.filter(booking=instance).delete()
            
            total_price = Decimal('0.00')
            for seat_id in new_seat_ids:
                seat = get_object_or_404(Seat, pk=seat_id)
                price = self._calculate_seat_price(seat, instance.session)
                
                if self._is_seat_available(seat, instance.session):
                    BookingSeat.objects.create(
                        booking=instance,
                        seat=seat,
                        price=price
                    )
                    total_price += price
                else:
                    raise serializers.ValidationError(
                        f'Место {seat} уже забронировано на этот сеанс.'
                    )
            
            instance.total_price = total_price
        
        self.perform_update(serializer)
        
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BookingCreateSerializer
        return BookingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        elif self.action == 'create':
            return [IsAuthenticated()]
        else:
            return [IsAdminGroup()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.filter(user=user).order_by('-created_at')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Создание бронирования"""
        data = request.data.copy()
        session_id = data.get('session')
        seat_ids = data.get('seat_ids', [])

        if not session_id or not seat_ids:
            return Response(
                {'detail': 'session and seat_ids are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        session = get_object_or_404(Session, pk=session_id)
        unavailable_seats = self._check_seat_availability(seat_ids, session)
        if unavailable_seats:
            return Response(
                {
                    'detail': 'Some seats are not available.',
                    'unavailable_seats': unavailable_seats
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        booking = Booking.objects.create(
            user=request.user,
            session=session,
            status='P'
        )
        total_price = Decimal('0.00')
        for seat_id in seat_ids:
            seat = Seat.objects.get(id=seat_id)
            price = self._calculate_seat_price(seat, session)
            
            try:
                booking.add_seat(seat, price)
                total_price += price
            except ValueError as e:
                transaction.set_rollback(True)
                return Response(
                    {'detail': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        booking.total_price = total_price
        booking.save(update_fields=['total_price'])

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='info')
    def info(self, request, pk=None):
        """DTO‑уровень BookingInfo для фронтенда"""
        booking = self.get_object()
        serializer = BookingInfoSerializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrAdmin])
    def cancel(self, request, pk=None):
        """Отмена бронирования"""
        booking = self.get_object()
        
        if booking.status == 'X':
            return Response(
                {'detail': 'Booking is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'X'
        booking.save(update_fields=['status'])
        
        BookingSeat.objects.filter(booking=booking).delete()
        
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminGroup])
    def confirm(self, request, pk=None):
        """Подтверждение бронирования администратором"""
        booking = self.get_object()
        
        if booking.status == 'C':
            return Response(
                {'detail': 'Booking is already confirmed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'C'
        booking.save(update_fields=['status'])
        
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    def _check_seat_availability(self, seat_ids, session):
        """Проверяет доступность мест на сеансе"""
        unavailable_seats = []
        
        for seat_id in seat_ids:
            seat = get_object_or_404(Seat, pk=seat_id)
            
            if BookingSeat.objects.filter(
                seat=seat,
                booking__session=session,
                booking__status__in=['P', 'C']
            ).exists():
                unavailable_seats.append({
                    'seat_id': seat_id,
                    'seat': f'Row {seat.row}, Seat {seat.number}'
                })
        
        return unavailable_seats

    def _calculate_seat_price(self, seat, session):
        if hasattr(seat, 'seat_type'):
            if seat.seat_type == 'VIP' or getattr(seat, 'is_vip', False):
                return session.price * Decimal('1.5')
            elif seat.seat_type == 'NORMAL':
                return session.price
        return session.price

    def _is_seat_available(self, seat, session):
        return not BookingSeat.objects.filter(
            seat=seat,
            booking__session=session,
            booking__status__in=['P', 'C']
        ).exists()


class UserBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class BookingSeatViewSet(viewsets.ModelViewSet):
    queryset = BookingSeat.objects.all()
    serializer_class = BookingSeatSerializer
    permission_classes = [IsAdminGroup]

    def get_queryset(self):
        booking_id = self.request.query_params.get('booking_id')
        if booking_id:
            return BookingSeat.objects.filter(booking_id=booking_id)
        return BookingSeat.objects.all()