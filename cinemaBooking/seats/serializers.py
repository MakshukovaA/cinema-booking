from rest_framework import serializers
from cinemaBooking.seats.models import Seat

class SeatSerializer(serializers.ModelSerializer):
    hall_name = serializers.CharField(source='hall.name', read_only=True)
    seat_type_display = serializers.CharField(source='get_seat_type_display', read_only=True)

    class Meta:
        model = Seat
        fields = ('id', 'hall', 'hall_name', 'row', 'number', 'seat_type', 'seat_type_display', 'is_available', 'is_vip')