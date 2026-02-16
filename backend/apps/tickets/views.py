from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, IsAuthenticated
from rest_framework.response import Response
from apps.halls.models import Hall
from apps.halls.models import Seat
from apps.movies.models import Movie
from apps.sessions.models import Session
from apps.pricing.models import Pricing
from apps.bookings.models import Booking
from apps.tickets.models import Ticket
from .serializers import (
    HallSerializer, SeatSerializer, MovieSerializer, SessionSerializer,
    PricingSerializer, BookingSerializer, TicketSerializer, UserSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

class PricingViewSet(viewsets.ModelViewSet):
    queryset = Pricing.objects.all()
    serializer_class = PricingSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='qr')
    def qr(self, request, pk=None):
        ticket = self.get_object()
        if not ticket.qr_code:
            ticket.generate_qr_code(use_signed=True)
        return Response({'qr_code_url': ticket.qr_code.url})