from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('user', views.UserViewSet, basename="user")
router.register('donation_campaign', views.DonationCampaignViewSet, basename="donation_campaign")
router.register('supply_type', views.SupplyTypeViewSet, basename = "supply_type")
router.register('location', views.LocationViewSet, basename = "location")
router.register('donation_post', views.DonationPostViewSet, basename = "donation_post")
router.register('article', views.ArticleViewSet, basename="article")
urlpatterns = [
    path('', include(router.urls)),
    path('article/crawl/', views.crawl_view, name='article-crawl'),
    path("oauth/start/", views.start_oauth, name="start_oauth"),
    path("oauth/callback/", views.oauth_callback, name="oauth_callback"),
    path('pay', views.index, name='index'),
    path('payment', views.payment, name='payment'),
    path('payment_ipn', views.payment_ipn, name='payment_ipn'),
    path('payment_return', views.payment_return, name='payment_return'),
    path('query', views.query, name='query'),
    path('refund', views.refund, name='refund'),
    path('test_translate', views.my_view, name='test'),
]
