from rest_framework import serializers

class BookingStatsSerializer(serializers.Serializer):
    total_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_booking_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    bookings_by_status = serializers.DictField()
    bookings_by_day = serializers.ListField()


class HallStatsSerializer(serializers.Serializer):
    hall_id = serializers.IntegerField()
    hall_name = serializers.CharField()
    total_sessions = serializers.IntegerField()
    total_bookings = serializers.IntegerField()
    utilization_rate = serializers.FloatField()
