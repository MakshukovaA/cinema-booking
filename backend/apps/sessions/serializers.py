from rest_framework import serializers
from apps.sessions.models import Session
class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'film_id', 'start_time', 'hall', 'price']