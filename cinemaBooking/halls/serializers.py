from rest_framework import serializers
from cinemaBooking.halls.models import Hall

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'name', 'location', 'rows', 'cols', 'capacity']