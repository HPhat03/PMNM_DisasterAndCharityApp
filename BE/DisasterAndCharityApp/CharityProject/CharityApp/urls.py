from os.path import basename

from django.urls import path, include
from . import views, admin
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('user', views.UserViewSet, basename="user")
router.register('donation_campaign', views.DonationCampaignViewSet, basename="donation_campaign")
router.register('supply_type', views.SupplyTypeViewSet, basename = "supply_type")
router.register('location', views.LocationViewSet, basename = "location")
urlpatterns = [
    path('', include(router.urls)),
]