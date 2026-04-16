from rest_framework import generics
from .models import Pricing
from .serializers import PricingSerializer

class PricingListCreateView(generics.ListCreateAPIView):
    queryset = Pricing.objects.all().order_by('id')
    serializer_class = PricingSerializer

class PricingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pricing.objects.all().order_by('id')
    serializer_class = PricingSerializer