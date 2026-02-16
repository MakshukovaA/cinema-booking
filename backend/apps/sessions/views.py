from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.sessions.models import Session
from apps.halls.models import Seat
from apps.seats.serializers import SeatSerializer
from apps.bookings.models import BookingSeat
from apps.sessions.serializers import SessionSerializer


def get(request, session_id):
    session = get_object_or_404(Session, pk=session_id)

    seats_in_hall = Seat.objects.filter(hall=session.hall)

    booked_seat_ids = BookingSeat.objects.filter(
        booking__session=session,
        booking__status__in=['P', 'C']
    ).values_list('seat_id', flat=True)

    available_seats = seats_in_hall.exclude(id__in=booked_seat_ids)

    serializer = SeatSerializer(available_seats, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class AvailableSeatsView(APIView):
    permission_classes = [IsAuthenticated]


class SessionListCreateView(generics.ListCreateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class SessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer