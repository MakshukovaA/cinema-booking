from rest_framework import serializers
from cinemaBooking.bookings.models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['user', 'session', 'total_price', 'status', 'created_at', 'seats']
