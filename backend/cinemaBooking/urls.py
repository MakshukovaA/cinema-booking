from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import api_root

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),

    path('api/', include('apps.api.urls')),
    path('api/admin/', include('apps.api.admin_urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]