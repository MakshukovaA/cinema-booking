from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.bookings.models import Booking
from .serializers_admin import AdminBookingSerializer

class AdminBookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = AdminBookingSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'X':
            return Response({'detail': 'Booking is already cancelled.'}, status=400)
        booking.status = 'X'
        booking.save(update_fields=['status'])
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'C':
            return Response({'detail': 'Booking is already confirmed.'}, status=400)
        booking.status = 'C'
        booking.save(update_fields=['status'])
        serializer = self.get_serializer(booking)
        return Response(serializer.data)