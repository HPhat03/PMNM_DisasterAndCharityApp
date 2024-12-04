from os.path import basename

from django.urls import path, include
from . import views, admin
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('user', views.UserViewSet, basename="user")
router.register('donation_campaign', views.DonationCampaignViewSet, basename="donation_campaign")
router.register('supply_type', views.SupplyTypeViewSet, basename = "supply_type")
router.register('location', views.LocationViewSet, basename = "location")
router.register('donation_post', views.DonationPostViewSet, basename = "donation_post")
urlpatterns = [
    path('', include(router.urls)),
    path("oauth/start/", views.start_oauth, name="start_oauth"),
    path("oauth/callback/", views.oauth_callback, name="oauth_callback"),
]