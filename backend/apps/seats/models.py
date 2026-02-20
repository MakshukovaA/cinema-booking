from django.db import models
from django.core.exceptions import ValidationError
from apps.halls.models import Hall

class Seat(models.Model):
    VIP = 'VIP'
    NORMAL = 'NORMAL'
    TYPE_CHOICES = [
        (VIP, 'VIP'),
        (NORMAL, 'Обычное')
    ]

    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='seats')
    row = models.PositiveIntegerField()
    number = models.PositiveIntegerField()
    seat_type = models.CharField(max_length=8, choices=TYPE_CHOICES, default=NORMAL)
    is_available = models.BooleanField(default=True)
    is_vip = models.BooleanField(default=False)

    class Meta:
        unique_together = ('hall', 'row', 'number')
        ordering = ('hall__name', 'row', 'number')

    def __str__(self):
        vip_tag = ' VIP' if self.is_vip else ''
        return f'Hall {self.hall.name} - Row {self.row} Seat {self.number} ({self.get_seat_type_display()}){vip_tag}'

    def clean(self):
        if self.hall:
            if self.row < 1 or self.row > self.hall.rows:
                raise ValidationError("Номер ряда вне диапазона зала.")
            if self.number < 1 or self.number > self.hall.cols:
                raise ValidationError("Номер места вне диапазона зала.")

    def is_bookable_for_session(self, session):
        try:
            from apps.bookings.models import BookingSeat
        except ImportError:
            return True
        return not BookingSeat.objects.filter(
            seat=self,
            booking__session=session,
            booking__status__in=['P', 'C']
        ).exists()