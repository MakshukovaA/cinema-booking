from django.db import models

class Seat(models.Model):
    SEAT_TYPE_CHOICES = [ ('REG', 'Regular'), ('VIP', 'VIP'), ]
    hall = models.ForeignKey('halls.Hall', on_delete=models.CASCADE, related_name='seats_in_hall')
    row = models.PositiveIntegerField()
    number = models.PositiveIntegerField()
    seat_type = models.CharField(max_length=3, choices=SEAT_TYPE_CHOICES, default='REG')
    is_available = models.BooleanField(default=True)
    is_vip = models.BooleanField(default=False)

    class Meta:
        unique_together = ('hall', 'row', 'number')
        ordering = ('hall__name', 'row', 'number')

    def __str__(self):
        vip_tag = ' VIP' if self.is_vip else ''
        return f'Hall {self.hall.name} - Row {self.row} Seat {self.number} ({self.get_seat_type_display()}){vip_tag}'

    def is_bookable_for_session(self, session):
        try:
            from cinemaBooking.bookings.models import BookingSeat
        except ImportError:
            return True
        return not BookingSeat.objects.filter(
            seat=self,
            booking__session=session,
            booking__status__in=['P', 'C']
        ).exists()