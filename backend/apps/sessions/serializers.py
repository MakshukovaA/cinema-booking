from rest_framework import serializers
from .models import Session

class SessionFrontendSerializer(serializers.ModelSerializer):
    filmId = serializers.CharField(source='movie.id', read_only=True)
    startTime = serializers.DateTimeField(source='start_time', read_only=True)
    hall = serializers.CharField(source='hall.name', read_only=True)

    availableSeats = serializers.SerializerMethodField()
    priceCategory1 = serializers.SerializerMethodField()
    priceCategory2 = serializers.SerializerMethodField()
    totalSeats = serializers.SerializerMethodField()
    bookedSeats = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = [
            'id',
            'filmId',
            'startTime',
            'hall',
            'availableSeats',
            'priceCategory1',
            'priceCategory2',
            'totalSeats',
            'bookedSeats',
        ]

    def get_totalSeats(self, obj):
        hall = getattr(obj, 'hall', None)
        if not hall:
            return 0
        capacity = getattr(hall, 'capacity', None)
        if capacity is not None:
            return capacity
        rows = getattr(hall, 'rows', 0) or 0
        cols = getattr(hall, 'cols', 0) or 0
        return rows * cols

    def get_bookedSeats(self, obj):
        booked = []
        tickets = getattr(obj, 'tickets', None)
        if tickets:
            for ticket in tickets.all():
                seat = getattr(ticket, 'seat', None)
                if seat:
                    booked.append(f"{seat.row}-{seat.number}")
        return booked

    def get_availableSeats(self, obj):
        total = self.get_totalSeats(obj)
        booked_count = len(self.get_bookedSeats(obj))
        available = total - booked_count
        return available if available >= 0 else 0

    def get_priceCategory1(self, obj):
        return 0

    def get_priceCategory2(self, obj):
        return 0

class HallLayoutSerializer(serializers.Serializer):
    rows = serializers.ListField(child=serializers.CharField())
    seatsPerRow = serializers.DictField(child=serializers.IntegerField())
    occupiedSeats = serializers.ListField(child=serializers.CharField())
    bookedSeats = serializers.ListField(child=serializers.CharField())
    priceMap = serializers.DictField()
