from .models import Movie
from .serializers import FilmSerializer
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from .models import Movie
from .serializers import (
    FilmSerializer,
)
from .serializers import MovieSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer 

class FilmViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = FilmSerializer