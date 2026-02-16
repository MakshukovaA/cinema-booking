from django.db import models
from django.conf import settings
from decimal import Decimal
from apps.sessions.models import Session

STATUS_CHOICES = [
    ('P', 'Pending'),
    ('C', 'Confirmed'),
    ('X', 'Cancelled'),
]


class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings_as_creator')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='bookings')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    created_at = models.DateTimeField(auto_now_add=True)
    seats = models.ManyToManyField('halls.Seat', through='BookingSeat', related_name='bookings')

    def __str__(self):
        return f'Booking {self.id} by {self.user} for {self.session}'

    def recalculate_total(self):
        total = sum((bs.price for bs in self.booking_seats.all()), Decimal('0.00'))
        self.total_price = total
        self.save(update_fields=['total_price'])

    def add_seat(self, seat, price):
        if hasattr(self.session, 'hall') and seat.hall != self.session.hall:
            raise ValueError('Seat belongs to a different hall than the session.')
        if BookingSeat.objects.filter(booking=self, seat=seat).exists():
            raise ValueError('Seat уже добавлено в это бронирование.')

        BookingSeat.objects.create(booking=self, seat=seat, price=price)
        self.recalculate_total()


class BookingSeat(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='booking_seats')
    seat = models.ForeignKey('halls.Seat', on_delete=models.CASCADE, related_name='booking_seats')
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('booking', 'seat')

    def __str__(self):
        return f'BookingSeat: Booking {self.booking.id} - Seat {self.seat}'