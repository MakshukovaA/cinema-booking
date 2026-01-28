from django.db import models

class Ticket(models.Model):
    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='tickets')
    seat = models.ForeignKey('seats.Seat', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    code = models.CharField(max_length=20, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Ticket {self.code} for {self.booking}'