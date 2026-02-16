from django.db import models
from django.core.exceptions import ValidationError

class Hall(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=200, blank=True)
    rows = models.PositiveIntegerField(default=5)
    cols = models.PositiveIntegerField(default=10)
    capacity = models.PositiveIntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return f'{self.name} ({self.rows}x{self.cols})'

    @property
    def total_seats(self):
        return self.rows * self.cols

    def save(self, *args, **kwargs):
        if not self.capacity:
            self.capacity = self.total_seats
        super().save(*args, **kwargs)

    def clean(self):
        if self.rows <= 0 or self.cols <= 0:
            raise ValidationError("Rows и Cols должны быть больше нуля.")


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