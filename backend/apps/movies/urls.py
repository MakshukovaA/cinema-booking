from django.urls import path, include
from rest_framework import routers
from .views import MovieViewSet

router = routers.DefaultRouter()
router.register(r'', MovieViewSet, basename='movie') 

urlpatterns = [
    path('', include(router.urls)),
]