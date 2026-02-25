from django.urls import path, include
from rest_framework import routers
from .admin_views import AdminMovieViewSet

router = routers.DefaultRouter()
router.register('admin/movies', AdminMovieViewSet, basename='admin-movies')

urlpatterns = [
    path('', include(router.urls)),
]