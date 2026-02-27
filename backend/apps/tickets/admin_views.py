from rest_framework.permissions import IsAdminUser
from .views import TicketViewSet
from .models import Ticket
from rest_framework import viewsets

class AdminTicketViewSet(TicketViewSet):
  permission_classes = [IsAdminUser]