from rest_framework import serializers
from apps.sessions.models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'movie', 'hall', 'start_time', 'price', 'price_category1', 'price_category2']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['price'] = float(data['price']) if data['price'] else 0.0
        data['price_category1'] = float(data['price_category1']) if data.get('price_category1') else 300.00
        data['price_category2'] = float(data['price_category2']) if data.get('price_category2') else 400.00
        return data
