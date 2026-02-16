from django.urls import path
from .views import (
    MovieListCreateView,
    MovieDetailView,
    SessionListCreateView,
    SessionDetailView,
)

urlpatterns = [
    path('', MovieListCreateView.as_view(), name='movie-list'),
    path('movies/int:pk/', MovieDetailView.as_view(), name='movie-detail'),
    path('', SessionListCreateView.as_view(), name='session-list'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session-detail'),
]