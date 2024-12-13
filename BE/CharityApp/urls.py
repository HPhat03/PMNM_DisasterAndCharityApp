# Copyright 2024 The Antibug
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
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
router.register('setting', views.SettingViewSet, basename="setting")
router.register('chat_api', views.ChatViewSet, basename="chat_api")
router.register('help_request', views.HelpRequestViewSet, basename="help_request")
urlpatterns = [
    path('', include(router.urls)),
    path('init', views.InitView.as_view(), name="init"),
    path('article/crawl/', views.crawl_view, name='article-crawl'),
    path('article/init/', views.init_article_view, name='article-init-crawl'),
    path('pay', views.index, name='index'),
    path('chat', views.chat, name='index1'),
    path('payment', views.payment, name='payment'),
    path('payment_ipn', views.payment_ipn, name='payment_ipn'),
    path('payment_return', views.payment_return, name='payment_return'),
    path('query', views.query, name='query'),
    path('refund', views.refund, name='refund'),
    path('init_camera', views.random_camera, name='init_cams')
]
