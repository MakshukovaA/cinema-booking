from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import PriceSerializer
from .models import Price

class AdminPriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [IsAdminUser]