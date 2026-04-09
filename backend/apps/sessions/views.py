from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.sessions.models import Session
from apps.seats.models import Seat
from apps.pricing.models import Pricing
from apps.tickets.models import Ticket
from .serializers import SessionFrontendSerializer, HallLayoutSerializer


def build_session_layout(session: Session) -> dict:
    hall = session.hall
    rows = [str(i + 1) for i in range(getattr(hall, 'rows', 0))]
    seatsPerRow = {row: getattr(hall, 'cols', 0) for row in rows}

    bookedSeats = []
    tickets = Ticket.objects.filter(session=session).select_related('seat')
    for ticket in tickets:
        seat = getattr(ticket, 'seat', None)
        if seat:
            bookedSeats.append(f"{seat.row}-{seat.number}")

    occupiedSeats = []

    priceMap = {}
    pricing_by_type = {p.name: float(p.price) for p in Pricing.objects.all()}

    for row in rows:
        priceMap[row] = {}
        max_seats = getattr(hall, 'cols', 0)
        for seat_num in range(1, max_seats + 1):
            seat = Seat.objects.filter(hall=hall, row=int(row), number=seat_num).first()
            seat_type = getattr(seat, 'seat_type', None) if seat else None
            priceMap[row][seat_num] = pricing_by_type.get(seat_type, 0)

    return {
        'rows': rows,
        'seatsPerRow': seatsPerRow,
        'occupiedSeats': occupiedSeats,
        'bookedSeats': bookedSeats,
        'priceMap': priceMap,
    }


class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionFrontendSerializer

    def get_queryset(self):
        qs = Session.objects.all().select_related('movie', 'hall').order_by('start_time', 'id')
        film_id = self.request.query_params.get('film')
        if film_id:
            qs = qs.filter(movie_id=film_id)
        return qs

    @action(detail=True, methods=['get'], url_path='layout')
    def layout(self, request, pk=None):
        session = self.get_object()
        layout_data = build_session_layout(session)
        serializer = HallLayoutSerializer(instance=layout_data)
        return Response(serializer.data)


class SessionListCreateView(generics.ListCreateAPIView):
    serializer_class = SessionFrontendSerializer

    def get_queryset(self):
        queryset = Session.objects.all().select_related('movie', 'hall').order_by('start_time', 'id')
        film_id = self.request.query_params.get('film')
        if film_id:
            queryset = queryset.filter(movie_id=film_id)
        return queryset


class SessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionFrontendSerializer
    lookup_field = 'pk'

class AvailableSeatsView(APIView):
    def get(self, request, pk):
        session = Session.objects.filter(pk=pk).select_related('hall').first()
        if not session:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        hall = session.hall
        if not hall:
            return Response([], status=status.HTTP_200_OK)

        pricing_by_type = {p.name: float(p.price) for p in Pricing.objects.all()}

        seats_qs = Seat.objects.filter(hall=hall).order_by('row', 'number')

        booked_seat_ids = set(
            Ticket.objects.filter(session=session, seat__isnull=False)
            .values_list('seat_id', flat=True)
        )

        result = []
        for seat in seats_qs:
            status_str = "booked" if seat.id in booked_seat_ids else "available"
            seat_type = getattr(seat, 'seat_type', None)
            seat_price = pricing_by_type.get(seat_type, 0.0)
            base_price = float(getattr(session, 'price', 0) or 0)

            if base_price and seat_price == base_price:
                price_cat = 1
            elif base_price and seat_price > base_price:
                price_cat = 2
            else:
                price_cat = 1 if seat_type == 'standard' else 2

            result.append({
                "id": seat.id,
                "row": seat.row,
                "seatNumber": seat.number,
                "status": status_str,
                "priceCategory": price_cat,
            })

        return Response(result, status=status.HTTP_200_OK)