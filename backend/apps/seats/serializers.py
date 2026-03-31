from rest_framework import serializers
from .models import Seat, Hall


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
    """
    Сериализатор места для фронтенда в формате camelCase.
    Совместим с frontend/src/types/booking.ts Seat interface.
    """
    seatNumber = serializers.IntegerField(source='number')
    status = serializers.SerializerMethodField()
    priceCategory = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ('id', 'row', 'seatNumber', 'status', 'priceCategory')

    def get_status(self, obj):
        """
        Определяет статус места.
        Логика:
        - Если передан context['booking_session'], проверяем занятость
        - Иначе возвращаем 'available'
        """
        # Проверяем, передан ли session_id в context
        session_id = self.context.get('booking_session_id')
        
        if session_id:
            from apps.bookings.models import BookingSeat
            # Проверяем, занято ли место на данном сеансе
            is_booked = BookingSeat.objects.filter(
                seat=obj,
                booking__session_id=session_id,
                booking__status__in=['P', 'C']  # Pending или Confirmed
            ).exists()
            
            if is_booked:
                return 'booked'
        
        # Проверяем, выбрано ли место в текущей сессии бронирования
        # (можно передать через context)
        selected_seats = self.context.get('selected_seats', [])
        if obj.id in selected_seats:
            return 'selected'
        
        return 'available'

    def get_priceCategory(self, obj):
        """
        Определяет категорию цены места.
        1 - обычное место (NORMAL)
        2 - VIP место
        """
        t = getattr(obj, 'seat_type', None)
        if t in ('VIP', 'VIP_SEAT'):
            return 2
        return 1


class HallLayoutSerializer(serializers.Serializer):
    """
    Сериализатор схемы зала.
    Совместим с frontend/src/types/booking.ts HallLayout interface.
    """
    rows = serializers.ListField(child=serializers.CharField())
    seatsPerRow = serializers.DictField(child=serializers.IntegerField())
    occupiedSeats = serializers.ListField(child=serializers.CharField())
    bookedSeats = serializers.ListField(child=serializers.CharField())
    priceMap = serializers.DictField(child=serializers.DictField(child=serializers.IntegerField()))

    def to_representation(self, instance):
        """
        instance - это объект Hall или словарь с данными.
        
        Ожидаемый формат ответа:
        {
            "rows": ["1", "2", "3", ...],
            "seatsPerRow": {"1": 10, "2": 10, ...},
            "occupiedSeats": ["1-5", "2-3", ...],  # формат "row-seat"
            "bookedSeats": ["1-6", ...],
            "priceMap": {"1": {1: 300, 2: 400}, ...}  # row -> {seatNumber: price}
        }
        """
        from apps.bookings.models import BookingSeat
        
        hall = instance
        session_id = self.context.get('session_id')
        
        # Получаем все места в зале
        seats = Seat.objects.filter(hall=hall).select_related('hall')
        
        # Строим схему рядов
        rows_set = set()
        seats_per_row = {}
        
        for seat in seats:
            row_key = str(seat.row)
            rows_set.add(row_key)
            seats_per_row[row_key] = seats_per_row.get(row_key, 0) + 1
        
        rows = sorted(list(rows_set), key=lambda x: int(x))
        
        # Получаем занятые места для сеанса
        occupied_seats = []
        booked_seats = []
        
        if session_id:
            booked_booking_seats = BookingSeat.objects.filter(
                booking__session_id=session_id,
                booking__status__in=['P', 'C']
            ).select_related('seat')
            
            for bs in booked_booking_seats:
                seat_key = f"{bs.seat.row}-{bs.seat.number}"
                if bs.booking.status == 'P':
                    booked_seats.append(seat_key)  # Pending - забронировано, но не подтверждено
                else:
                    occupied_seats.append(seat_key)  # Confirmed - занято
        
        # Строим карту цен
        price_map = {}
        for seat in seats:
            row_key = str(seat.row)
            if row_key not in price_map:
                price_map[row_key] = {}
            
            # Определяем категорию и цену
            price_category = 2 if seat.seat_type in ('VIP', 'VIP_SEAT') else 1
            
            # Базовую цену берем из сессии (если передана в context)
            base_price = self.context.get('base_price', 300)
            
            if price_category == 2:
                price = int(base_price * 1.5)  # VIP на 50% дороже
            else:
                price = base_price
            
            price_map[row_key][seat.number] = price
        
        return {
            'rows': rows,
            'seatsPerRow': seats_per_row,
            'occupiedSeats': occupied_seats,
            'bookedSeats': booked_seats,
            'priceMap': price_map
        }