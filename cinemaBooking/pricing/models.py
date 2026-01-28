from django.db import models

class Pricing(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    description = models.TextField(blank=True)

    def __str__(self):
        return f'{self.name} - {self.price} {self.currency}'