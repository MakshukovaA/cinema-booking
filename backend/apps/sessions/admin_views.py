from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import SessionSerializer
from .models import Session

class AdminSessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAdminUser]