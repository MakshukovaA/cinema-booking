from rest_framework import viewsets
from .models import Movie
from .serializers import FilmSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = FilmSerializer