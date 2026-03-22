from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {
            'id': data.get('id'),
            'userName': data.get('username'),
            'email': data.get('email'),
            'firstName': data.get('first_name'),
            'lastName': data.get('last_name'),
        }