from rest_framework import serializers
from .models import Movie
from apps.sessions.models import Session
from apps.halls.models import Hall

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all(), source='movie', write_only=True)
    hall_id = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), source='hall', write_only=True)
    hall = serializers.PrimaryKeyRelatedField(read_only=True, source='hall')

    class Meta:
        model = Session
        fields = ['id', 'movie', 'movie_id', 'hall', 'hall_id', 'start_time', 'price']