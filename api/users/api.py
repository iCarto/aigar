from django.contrib.auth.models import Group

from rest_framework import viewsets
from rest_framework.permissions import BasePermission

from .models import User
from .serializers import GroupSerializer, UserSerializer


class IsInAdminGroupUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.in_admin_group()
        )


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsInAdminGroupUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsInAdminGroupUser]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
