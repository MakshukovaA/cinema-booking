from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import HallSerializer
from .models import Hall

class AdminHallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [IsAdminUser]