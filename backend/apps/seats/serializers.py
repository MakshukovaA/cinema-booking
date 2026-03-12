from rest_framework import serializers
from apps.seats.models import Seat

class SeatSerializer(serializers.ModelSerializer):
    hall_name = serializers.CharField(source='hall.name', read_only=True)

    seatNumber = serializers.IntegerField(source='number', read_only=True)
    priceCategory = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ('id', 'row', 'seatNumber', 'status', 'priceCategory', 'hall', 'hall_name')

    def get_priceCategory(self, obj):
        seat_type = getattr(obj, 'seat_type', None)
        if seat_type == 'VIP':
            return 2
        return 1

    def get_status(self, obj):
        return 'available'