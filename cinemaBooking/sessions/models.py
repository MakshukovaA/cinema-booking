from django.db import models

class Session(models.Model):
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, related_name='sessions')
    hall = models.ForeignKey('halls.Hall', on_delete=models.CASCADE, related_name='sessions')
    start_time = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f'{self.movie.title} in {self.hall.name} at {self.start_time}'