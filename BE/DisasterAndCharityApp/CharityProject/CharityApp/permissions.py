from rest_framework.permissions import BasePermission
from .models import UserRole

class IsCharityOrg(BasePermission):
    def has_permission(self, request, view):
        return request.user.isAuthenticated and request.user.role == UserRole.CHARITY_ORG

class IsCivilian(BasePermission):
    def has_permission(self, request, view):
        return request.user.isAuthenticated and request.user.role == UserRole.CIVILIAN