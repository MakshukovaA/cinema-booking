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