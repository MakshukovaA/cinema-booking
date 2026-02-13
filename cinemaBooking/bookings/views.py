from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cinemaBooking.bookings.models import Booking, BookingSeat
from .serializers import BookingSerializer
from cinemaBooking.halls.models import Seat
from cinemaBooking.sessions.models import Session
from cinemaBooking.core.permissions import AdminOrGuestReadOnly, IsAdminGroup

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AdminOrGuestReadOnly]

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AdminOrGuestReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AdminOrGuestReadOnly()]
        else:
            return [IsAdminGroup()]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        session_id = data.get('session')
        seat_ids = data.get('seat_ids', [])

        if not session_id or not seat_ids:
            return Response({'detail': 'session and seat_ids are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        session = get_object_or_404(Session, pk=session_id)

        conflicting = BookingSeat.objects.filter(
            seat_id__in=seat_ids,
            booking__session=session,
            booking__status__in=['P', 'C']
        )
        if conflicting.exists():
            return Response({'detail': 'One or more seats are already booked for this session.'},
                            status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.create(user=request.user, session=session, total_price=Decimal('0.00'))

        total = Decimal('0.00')
        seats = Seat.objects.filter(id__in=seat_ids).select_for_update()

        for seat in seats:
            price = self._estimate_price_for_seat(seat, session)
            BookingSeat.objects.create(booking=booking, seat=seat, price=price)
            total += price

        booking.total_price = total
        booking.save(update_fields=['total_price'])

        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _estimate_price_for_seat(self, seat: Seat, session: Session):
        from cinemaBooking.pricing.models import Pricing
        try:
            pricing = Pricing.objects.filter(
                hall=seat.hall,
                seat_type=seat.seat_type,
                session=session
            ).first()
            if pricing:
                return pricing.price
        except Exception:
            pass

        if getattr(seat, 'seat_type', None) == 'VIP' or getattr(seat, 'is_vip', False):
            return Decimal('20.00')
        return Decimal('10.00')
