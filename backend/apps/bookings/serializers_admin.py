from rest_framework import serializers
from .models import Booking, BookingSeat
from .serializers import BookingSerializer

class AdminBookingSerializer(BookingSerializer):
    class Meta(BookingSerializer.Meta):
        pass