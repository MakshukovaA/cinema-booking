from rest_framework import serializers
from apps.sessions.models import Session
from apps.movies.serializers import MovieSerializer
from apps.halls.serializers import HallSerializer

class SessionSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    hall = HallSerializer(read_only=True)

    class Meta:
        model = Session
        fields = ('id', 'movie', 'hall', 'start_time', 'price', 'price_category1', 'price_category2')

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['startTime'] = data.get('start_time')
        data['film'] = data.get('movie') 
        data['priceCategory1'] = float(data.get('price_category1') or 0.0)
        data['priceCategory2'] = float(data.get('price_category2') or 0.0)

        data['start_time'] = data['startTime']
        data['price'] = float(data.get('price') or 0.0)

        return data