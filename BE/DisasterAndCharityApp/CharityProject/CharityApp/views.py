from lib2to3.fixes.fix_input import context
from sys import is_stack_trampoline_active

from django.conf import settings
from django.db.models import Sum
from django.http import HttpResponse
from django.db.models import  Q
from rest_framework import status, permissions
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser,FileUploadParser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import *
from .serializers import *
from .permissions import *


# Create your views here.
class UserViewSet(ViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        user = self.serializer_class.create(self, request.data)
        return Response(self.serializer_class(user, context={'request': request}).data, status=status.HTTP_200_OK)

    @action(methods = ['GET'], detail = False)
    def me(self, request):
        queryset = request.user
        data = {
            'user_info': self.serializer_class(queryset, context={"request": request}).data,
        }
        obj = {}
        if queryset.role == UserRole.CIVILIAN:
            queryset = queryset.civilian_info
            obj = CivilianFromUserSerializer(queryset, context={'request': request})
        elif queryset.role == UserRole.CHARITY_ORG:
            queryset = queryset.charity_org_info
            obj = CharityOrgFromUserSerializer(queryset, context={'request': request})
        data['further_info'] = obj.data
        return Response(data, status=status.HTTP_200_OK)

class DonationCampaign(ViewSet, generics.ListAPIView):
    queryset = DonationCampaign.objects.all()
    serializer_class = CampagnSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsCharityOrg()]
        return [IsAuthenticated()]

    def get_queryset(self):
        q = self.queryset;
        kw = self.request.query_params.get('kw')
        if kw is not None:
            q = q.filter(Q(title__icontains=kw)|Q(content__icontains=kw))
        return q

    @transaction.atomic()
    def create(self, request, *args, **kwargs):
        res = "Not OK"
        with transaction.atomic():
            campaign = DonationCampaign(**request.data)
            campaign.org = request.user.chartity_org_info
            campaign.save()
            admin = Admin.objects.order_by('?').first()
            first_approval = Approval(admin= admin, donation=campaign)
            first_approval.save()
            res = self.serializer_class(campaign, context={'request': request}).data
        return Response(res, status=status.HTTP_200_OK)