from django.db import models

class Seat(models.Model):
    hall = models.ForeignKey('halls.Hall', on_delete=models.CASCADE, related_name='seats')
    row = models.PositiveIntegerField()
    number = models.PositiveIntegerField()
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('hall', 'row', 'number')

    def __str__(self):
        return f'Hall {self.hall.name} - Row {self.row} Seat {self.number}'