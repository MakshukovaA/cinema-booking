from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import SeatSerializer
from .models import Seat

class AdminSeatViewSet(viewsets.ModelViewSet):
    """
    Admin API для Seat. Доступ только у администраторов.
    """
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
    permission_classes = [IsAdminUser]