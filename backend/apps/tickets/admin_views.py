from rest_framework.permissions import IsAdminUser
from .views import TicketViewSet  # наследуемся от существующего набора действий
from .models import Ticket  # для явного указания queryset, если нужно
from rest_framework import viewsets

class AdminTicketViewSet(TicketViewSet):
  permission_classes = [IsAdminUser]