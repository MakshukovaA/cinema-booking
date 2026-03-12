from rest_framework import serializers
from decimal import Decimal
from django.db import transaction

from apps.bookings.models import Booking, BookingSeat
from apps.users.serializers import UserSerializer
from apps.sessions.serializers import SessionSerializer
from apps.seats.serializers import SeatSerializer


class BookingSeatSerializer(serializers.ModelSerializer):
    seat_info = SeatSerializer(source='seat', read_only=True)
    
    class Meta:
        model = BookingSeat
        fields = ['id', 'booking', 'seat', 'seat_info', 'price']
        read_only_fields = ['id', 'booking']



class BookingSerializer(serializers.ModelSerializer):
    user_info = UserSerializer(source='user', read_only=True)
    session_info = SessionSerializer(source='session', read_only=True)
    seats_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_info', 'session', 'session_info',
            'total_price', 'status', 'status_display', 'created_at',
            'seats', 'seats_info'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'seats_info']
    
    def get_seats_info(self, obj):
        seats_info = []
        for booking_seat in obj.booking_seats.select_related('seat').all():
            seats_info.append({
                'seat_id': booking_seat.seat.id,
                'row': booking_seat.seat.row,
                'number': booking_seat.seat.number,
                'seat_type': booking_seat.seat.seat_type,
                'price': booking_seat.price
            })
        return seats_info


class BookingCreateSerializer(serializers.ModelSerializer):
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=True
    )
    
    class Meta:
        model = Booking
        fields = ['id', 'session', 'seat_ids', 'total_price', 'status']
        read_only_fields = ['id', 'total_price', 'status']
    
    def validate(self, data):
        session = data.get('session')
        if not session:
            raise serializers.ValidationError({'session': 'Session is required.'})
        
        seat_ids = data.get('seat_ids', [])
        if not seat_ids:
            raise serializers.ValidationError({'seat_ids': 'At least one seat is required.'})
        
        return data
    
    def create(self, validated_data):
        raise NotImplementedError("Booking should be created in the view, not in serializer.")


class BookingDetailSerializer(BookingSerializer):
    booking_seats = BookingSeatSerializer(many=True, read_only=True, source='booking_seats')
    
    class Meta(BookingSerializer.Meta):
        fields = BookingSerializer.Meta.fields + ['booking_seats']