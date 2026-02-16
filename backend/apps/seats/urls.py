from django.urls import path
from .views import SeatListCreateView, SeatDetailView

urlpatterns = [
    path('', SeatListCreateView.as_view(), name='seat-list'),
    path('<int:pk>/', SeatDetailView.as_view(), name='seat-detail'),
]