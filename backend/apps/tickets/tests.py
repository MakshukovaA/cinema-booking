import os
import tempfile
import datetime
from datetime import timezone
from decimal import Decimal

from django.test import TestCase
from django.conf import settings

from django.contrib.auth import get_user_model
from apps.halls.models import Hall
from apps.seats.models import Seat
from apps.movies.models import Movie
from apps.sessions.models import Session
from apps.bookings.models import Booking
from apps.tickets.models import Ticket

User = get_user_model()

class TicketQrGenerationTest(TestCase):
    def _create_related_objects(self):
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123'
        )
        hall = Hall.objects.create(name='Main Hall', location='1st Floor', rows=10, cols=20, capacity=200)
        movie = Movie.objects.create(
            title='Test Movie',
            duration=120,
            genre='DR',
            release_date='2020-01-01',
            rating=5,
            description='Test movie'
        )
        start_time = datetime.datetime(2026, 3, 12, 19, 0, 0, tzinfo=timezone.utc)
        session = Session.objects.create(
            movie=movie,
            hall=hall,
            start_time=start_time,
            price=Decimal('12.50')
        )

        seat = Seat.objects.create(hall=hall, row=1, number=1, seat_type=Seat.NORMAL)
        booking = Booking.objects.create(user=user, session=session)

        return {
            'user': user,
            'hall': hall,
            'movie': movie,
            'session': session,
            'seat': seat,
            'booking': booking,
        }

    def _minimal_ticket_kwargs(self, related, price='12.50'):
        kwargs = {
            'booking': related['booking'],
            'seat': related['seat'],
            'price': price,
        }
        if related.get('session'):
            kwargs['session_id'] = related['session'].id
        return kwargs

    def test_qr_generated_on_create(self):
        with tempfile.TemporaryDirectory() as tmp_media:
            with self.settings(MEDIA_ROOT=tmp_media):
                related = self._create_related_objects()
                ticket_data = self._minimal_ticket_kwargs(related)

                t = Ticket.objects.create(**ticket_data)
                t.refresh_from_db()

                self.assertIsNotNone(t.qr_code)
                self.assertTrue(bool(t.qr_code.name))

                file_path = t.qr_code.path
                self.assertIsNotNone(file_path)
                self.assertTrue(os.path.exists(file_path))