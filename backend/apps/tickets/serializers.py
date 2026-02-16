from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.halls.models import Hall
from apps.halls.models import Seat
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

    class Meta:
        model = Seat
        fields = ('id', 'hall', 'row', 'number', 'type')

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title', 'duration', 'genre', 'release_date', 'rating', 'description')

class SessionSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    hall = HallSerializer(read_only=True)

    class Meta:
        model = Session
        fields = ('id', 'movie', 'hall', 'start_time', 'end_time')

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
    session = SessionSerializer(source='booking.session', read_only=True)
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ('id', 'booking', 'seat', 'session', 'price', 'code', 'issued_at', 'qr_code_url')
        read_only_fields = ('issued_at', 'qr_code_url')

    @staticmethod
    def get_qr_code_url(obj):
        return obj.qr_code.url if getattr(obj, 'qr_code', None) else None