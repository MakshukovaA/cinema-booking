from django.urls import path
from .views import HallListCreateView, HallDetailView

urlpatterns = [
    path('', HallListCreateView.as_view(), name='hall-list'),
    path('<int:pk>/', HallDetailView.as_view(), name='hall-detail'),
]