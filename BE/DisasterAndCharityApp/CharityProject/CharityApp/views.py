from django.conf import settings
from django.db.models import Sum
from django.http import HttpResponse
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
class UserViewSet(ViewSet, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if(self.action == 'create'):
            return [AllowAny()]
        return [IsAuthenticated()]
    
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
    