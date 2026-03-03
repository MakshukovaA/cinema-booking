from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import api_root

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),

    # Обычный API (все рабочие эндпоинты — в одном месте)
    path('api/', include('apps.api.urls')),

    # Админский API (отдельный модуль)
    path('api/admin/', include('apps.api.admin_urls')),

    # JWT токены
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]