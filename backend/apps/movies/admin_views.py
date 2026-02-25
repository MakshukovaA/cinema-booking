from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import MovieSerializer
from .models import Movie

class AdminMovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminUser]