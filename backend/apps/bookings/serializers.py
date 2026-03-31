from rest_framework import serializers
from apps.seats.serializers import SeatFrontendSerializer
from .models import Booking, BookingSeat
from apps.sessions.models import Session


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('id', 'user', 'session', 'total_price', 'status', 'created_at')
        read_only_fields = ('id', 'user', 'session', 'total_price', 'status', 'created_at')


class BookingCreateSerializer(serializers.Serializer):
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        allow_empty=False
    )


class BookingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('id', 'user', 'session', 'total_price', 'status', 'created_at')


class BookingSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSeat
        fields = ('id', 'booking', 'seat', 'price')


class BookingFormSerializer(serializers.Serializer):
    userName = serializers.CharField(max_length=255)
    userPhone = serializers.CharField(max_length=50)
    email = serializers.EmailField(required=False, allow_blank=True)


class BookingInfoSerializer(serializers.ModelSerializer):
    sessionId = serializers.SerializerMethodField()
    filmTitle = serializers.CharField(source='session.movie.title', read_only=True)
    sessionTime = serializers.DateTimeField(source='session.start_time', read_only=True)
    hallName = serializers.CharField(source='session.hall.name', read_only=True)
    selectedSeats = serializers.SerializerMethodField()
    totalPrice = serializers.SerializerMethodField()
    userName = serializers.SerializerMethodField()
    userPhone = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'sessionId',
            'filmTitle',
            'sessionTime',
            'hallName',
            'selectedSeats',
            'totalPrice',
            'userName',
            'userPhone',
        ]

    def get_sessionId(self, obj):
        session = getattr(obj, 'session', None)
        if session:
            return session.id 
        return None

    def get_selectedSeats(self, obj):
        seats_qs = BookingSeat.objects.filter(booking=obj).select_related('seat')
        seats = [bs.seat for bs in seats_qs if bs.seat is not None]
        
        return SeatFrontendSerializer(
            seats, 
            many=True,
            context={'booking_session_id': obj.session_id}
        ).data

    def get_totalPrice(self, obj):
        value = getattr(obj, 'total_price', None)
        if value is None:
            return 0.0
        return float(value)

    def get_userName(self, obj):
        user = getattr(obj, 'user', None)
        if not user:
            return ""
        full_name = getattr(user, 'get_full_name', lambda: "")()
        return full_name or getattr(user, 'username', "")

    def get_userPhone(self, obj):
        user = getattr(obj, 'user', None)
        if not user:
            return ""
        return getattr(user, 'phone', "") or ""