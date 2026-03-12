from django.urls import path
from apps.sessions.views import SessionListCreateView, SessionDetailView, AvailableSeatsView

urlpatterns = [
    path('', SessionListCreateView.as_view(), name='session-list'),
    path('<int:pk>/', SessionDetailView.as_view(), name='session-detail'),
    path('<int:session_id>/available-seats/', AvailableSeatsView.as_view(), name='available-seats'),
]