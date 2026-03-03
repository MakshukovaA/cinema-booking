from django.urls import path
from rest_framework import generics
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]