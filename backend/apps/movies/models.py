from django.db import models

class Movie(models.Model):
    GENRE_CHOICES = [
        ('DR', 'Drama'),
        ('AC', 'Action'),
        ('COM', 'Comedy'),
        ('HO', 'Horror'),
        ('SF', 'Sci-Fi'),
    ]

    title = models.CharField(max_length=200)
    duration = models.PositiveIntegerField(help_text='Длительность в минутах')
    genre = models.CharField(max_length=3, choices=GENRE_CHOICES, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title
