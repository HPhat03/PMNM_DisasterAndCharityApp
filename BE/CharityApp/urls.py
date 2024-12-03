from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('user', views.UserViewSet, basename="user")
router.register('donation_campaign', views.DonationCampaignViewSet, basename="donation_campaign")
router.register('supply_type', views.SupplyTypeViewSet, basename = "supply_type")
router.register('location', views.LocationViewSet, basename = "location")
router.register('article', views.ArticleViewSet, basename="article")
urlpatterns = [
    path('', include(router.urls)),
]
