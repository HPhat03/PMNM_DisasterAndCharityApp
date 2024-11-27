from django.urls import path, include
from . import views, admin
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('user', views.UserViewSet, basename="user")
urlpatterns = [
    path('', include(router.urls)),
]