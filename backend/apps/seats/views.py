from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from .models import Seat, Hall
from .serializers import SeatSerializer, SeatFrontendSerializer, HallLayoutSerializer, HallSerializer
from apps.sessions.models import Session


class SeatListCreateView(generics.ListCreateAPIView):
    queryset = Seat.objects.all()
    serializer_class = SeatFrontendSerializer

class SeatDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seat.objects.all()
    serializer_class = SeatFrontendSerializer

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
    permission_classes = [AllowAny]


class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [AllowAny]


class HallLayoutView(generics.RetrieveAPIView):
    """
    Получить схему зала с занятыми местами для конкретного сеанса.
    
    URL: /api/halls/<hall_id>/layout/?session_id=<session_id>
    
    Response:
    {
        "rows": ["1", "2", "3"],
        "seatsPerRow": {"1": 10, "2": 10, "3": 8},
        "occupiedSeats": ["1-5", "2-3"],
        "bookedSeats": ["1-6"],
        "priceMap": {"1": {1: 300, 2: 300}, ...}
    }
    """
    serializer_class = HallLayoutSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        hall_id = self.kwargs.get('pk')
        return Hall.objects.get(pk=hall_id)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        
        # Получаем session_id из query параметров
        session_id = self.request.query_params.get('session_id')
        if session_id:
            context['session_id'] = session_id
            
            # Получаем базовую цену из сессии
            try:
                session = Session.objects.get(pk=session_id)
                context['base_price'] = float(session.price) if hasattr(session, 'price') else 300
            except Session.DoesNotExist:
                context['base_price'] = 300
        
        return context
