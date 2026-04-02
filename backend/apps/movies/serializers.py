from rest_framework import serializers
from .models import Movie
from django.conf import settings

class FilmSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True) 
    filmId = serializers.IntegerField(source='id', read_only=True)
    year = serializers.SerializerMethodField()
    posterUrl = serializers.CharField(source='poster_url', read_only=True, allow_blank=True)
    poster = serializers.CharField(source='poster_url', read_only=True, allow_blank=True)
    backgroundImage = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    director = serializers.SerializerMethodField()
    cast = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            'id',
            'filmId',
            'title',
            'duration',
            'genre',
            'year',
            'rating',
            'description',
            'posterUrl',
            'poster',
            'backgroundImage',
            'gallery',
            'director',
            'cast',
            'country',
        ]
    def get_year(self, obj):
        return obj.release_date.year if obj.release_date else None

    def get_posterUrl(self, obj):
        if obj.poster:
            return settings.MEDIA_URL + str(obj.poster)
        return None

    def get_poster(self, obj):
        return obj.poster_url or ""

    def get_backgroundImage(self, obj):
        return obj.background_image or ""

    def get_gallery(self, obj):
        return obj.gallery or []

    def get_director(self, obj):
        return obj.director

    def get_cast(self, obj):
        return obj.cast

    def get_country(self, obj):
        return obj.country

MovieSerializer = FilmSerializer 