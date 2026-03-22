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

    poster_url = models.URLField(max_length=500, blank=True, null=True, default="")
    background_image = models.URLField(max_length=500, blank=True, null=True, default="")
    gallery = models.JSONField(default=list, blank=True)
    director = models.CharField(max_length=255, blank=True, null=True)
    cast = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.title