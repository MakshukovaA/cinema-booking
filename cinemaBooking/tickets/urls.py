from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HallViewSet, SeatViewSet, MovieViewSet, SessionViewSet,
    PricingViewSet, BookingViewSet, TicketViewSet
)
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import DjangoModelPermissions

User = get_user_model()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [DjangoModelPermissions]

router = DefaultRouter()
router.register(r'halls', HallViewSet)
router.register(r'seats', SeatViewSet)
router.register(r'movies', MovieViewSet)
router.register(r'sessions', SessionViewSet)
router.register(r'pricing', PricingViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/users/', UserListCreateView.as_view(), name='user-list'),
    path('api/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
