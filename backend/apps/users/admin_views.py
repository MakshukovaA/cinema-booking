from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import UserSerializer

User = get_user_model()

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin API для управления пользователями.
    Доступ только у администраторов.
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]