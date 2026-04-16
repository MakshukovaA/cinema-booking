from rest_framework import generics
from .models import Hall
from .serializers import HallSerializer

class HallListCreateView(generics.ListCreateAPIView):
    queryset = Hall.objects.all().order_by('id')
    serializer_class = HallSerializer

class HallDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hall.objects.all().order_by('id')
    serializer_class = HallSerializer