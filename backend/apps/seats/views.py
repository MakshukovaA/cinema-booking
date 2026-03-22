from rest_framework import generics
from .models import Seat
from .serializers import SeatFrontendSerializer

class SeatListCreateView(generics.ListCreateAPIView):
    queryset = Seat.objects.all()
    serializer_class = SeatFrontendSerializer

class SeatDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seat.objects.all()
    serializer_class = SeatFrontendSerializer