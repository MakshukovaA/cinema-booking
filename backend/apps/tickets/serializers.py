from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.halls.models import Hall
from apps.seats.models import Seat
from apps.movies.models import Movie
from apps.sessions.models import Session
from apps.pricing.models import Pricing
from apps.bookings.models import Booking
from apps.tickets.models import Ticket

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

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

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title', 'duration', 'genre', 'release_date', 'rating', 'description')

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

class SessionSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    hall = HallSerializer(read_only=True)

    class Meta:
        model = Session
        fields = ('id', 'movie', 'hall', 'start_time')

class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricing
        fields = ('id', 'seat_type', 'price')

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    session = SessionSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'user', 'session', 'created_at', 'status')

class TicketSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    seat = SeatSerializer(read_only=True)
    session = SessionSerializer(read_only=True)
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ('id', 'booking', 'seat', 'session', 'price', 'code', 'issued_at', 'qr_code_url')
        read_only_fields = ('issued_at', 'qr_code_url')

    def get_qr_code_url(self, obj):
        return obj.qr_code.url if obj.qr_code else None