from rest_framework import serializers
from .models import Seat
from .models import Hall 

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ('id', 'name', 'location', 'rows', 'cols', 'capacity')

class SeatSerializer(serializers.ModelSerializer):
    hall = HallSerializer(read_only=True)
    type = serializers.CharField(source='seat_type', read_only=True)

    class Meta:
        model = Seat
        fields = ('id', 'hall', 'row', 'number', 'type')

class SeatFrontendSerializer(serializers.ModelSerializer):
    seatNumber = serializers.IntegerField(source='number')
    status = serializers.SerializerMethodField()
    priceCategory = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ('id', 'row', 'seatNumber', 'status', 'priceCategory')

    def get_status(self, obj):
        return 'available'

    def get_priceCategory(self, obj):
        t = getattr(obj, 'seat_type', None)
        if t in ('VIP', 'VIP_SEAT'):
            return 2
        return 1
