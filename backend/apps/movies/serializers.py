from rest_framework import serializers
from .models import Movie
from apps.sessions.models import Session
from apps.halls.models import Hall


class MovieSerializer(serializers.ModelSerializer):
    year = serializers.SerializerMethodField()
    posterUrl = serializers.SerializerMethodField()
    backgroundImage = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    director = serializers.SerializerMethodField()
    cast = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'duration',
            'genre',
            'rating',
            'year',
            'description',
            'posterUrl',
            'backgroundImage',
            'gallery',
            'director',
            'cast',
            'country',
        ]

    def get_year(self, obj):
        if obj.release_date:
            return obj.release_date.year
        return None

    def get_posterUrl(self, obj):
        return getattr(obj, 'poster_url', '')

    def get_backgroundImage(self, obj):
        return getattr(obj, 'background_image', '')

    def get_gallery(self, obj):
        return getattr(obj, 'gallery', []) or []

    def get_director(self, obj):
        return getattr(obj, 'director', None)

    def get_cast(self, obj):
        return getattr(obj, 'cast', None)

    def get_country(self, obj):
        return getattr(obj, 'country', None)


class SessionSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all(), source='movie', write_only=True)
    hall_id = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), source='hall', write_only=True)
    hall = serializers.PrimaryKeyRelatedField(read_only=True, source='hall')

    class Meta:
        model = Session
        fields = ['id', 'movie', 'movie_id', 'hall', 'hall_id', 'start_time', 'price']