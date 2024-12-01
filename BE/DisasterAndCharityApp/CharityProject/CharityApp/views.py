

from django.db.models import  Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser,FileUploadParser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import *
from .serializers import *
from .permissions import *

# Create your views here.
LIMIT_REPORT = 5
LIMIT_REPORT_DAY = 10
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

class DonationCampaignViewSet(ViewSet, generics.ListAPIView):
    queryset = DonationCampaign.objects.filter(active=True)
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
        print(request.data)
        if "locations" not in request.data:
            return Response("chưa có nơi cứu trợ", status=status.HTTP_200_OK)
        else:
            locations = request.data.pop("locations")

        supply_type = SupplyType.objects.filter(pk=request.data.pop('supply_type')).first()
        if(supply_type == None):
            return Response("Không tìm thấy loại hình quyên góp", status=status.HTTP_200_OK)
        try:
            with transaction.atomic():
                campaign = DonationCampaign(**request.data)
                campaign.org = request.user.charity_org_info
                campaign.is_permitted = False
                campaign.supply_type = supply_type
                if campaign.expected_charity_end_date < campaign.expected_charity_start_date:
                    raise ValueError("Lỗi thời gian tổ chức quyên góp")
                if campaign.expected_charity_start_date < date.today().__str__():
                    raise ValueError("Không thể xác nhận ngày quyên góp trước thời gian hiện tại")
                campaign.save()

                tmp = 0
                for lct in locations:
                    location = Location.objects.filter(pk=lct['id']).first()
                    if location is not None:
                        cplc = CampaignLocation(campaign = campaign, location = location, expected_fund = lct['expected_fund'])
                        cplc.save()
                        tmp += cplc.expected_fund

                if tmp == 0:
                    raise ValueError("ko tìm thấy bất kì nơi cứu trợ nào")

                if "enclosed" in request.data.keys():
                    for enc in request.data["enclosed"]:
                        tmp = Article.objects.filter(pk=enc).first()
                        if tmp is None:
                            break
                        campaign.enclosed_article.add(tmp)
                    campaign.save()

                admin = Admin.objects.order_by('?').first()
                first_approval = Approval(admin= admin, donation=campaign)
                first_approval.save()
                res = self.serializer_class(campaign, context={'request': request}).data
        except Exception as e:
            return Response(e.__str__(), status=status.HTTP_200_OK)
        return Response(res, status=status.HTTP_200_OK)
    
    @transaction.atomic()
    @action(methods = ['POST'], detail = True)
    def report(self, request, pk=None):
        res = "Not OK"
        campagn = DonationCampaign.objects.filter(pk=pk, is_permitted = True).first()
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        if DonationReport.objects.filter(donation=campagn).count() >= LIMIT_REPORT:
            return Response("Bạn đã hết số lần nộp báo cáo", status=status.HTTP_200_OK)
        if date.today() - campagn.expected_charity_end_date > LIMIT_REPORT_DAY:
            return Response("Bạn đã quá hạn để báo cáo", status=status.HTTP_200_OK)
        with transaction.atomic():
            rp = DonationReport(donation=campagn)
            rp.save()
            tmp = 0
            for d in request.data['details']:
                dt = DetailDonationReport(**d)
                tmp+= dt.paid
                dt.save()
            rp.total_used = tmp
            rp.total_left = campagn.current_fund - tmp
            rp.save()
            if rp.total_used == 0: 
                return Response("Số tiền bạn quyên góp là 0, Cảnh Báo", status=status.HTTP_200_OK)
            if rp.total_left > 500000:
                return Response("Số tiền bạn quyên góp còn dư quá nhiều, Cảnh Báo", status=status.HTTP_200_OK)            
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods = ['POST'], detail = True)
    def cancel(self, request, pk=None):
        res = "Not OK"
        campagn = DonationCampaign.objects.filter(pk=pk).first()
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        if not campagn.is_permitted:
            return Response("Hoạt động này đang diễn ra, không thể huỷ", status=status.HTTP_200_OK)
        with transaction.atomic():
            campagn.active = False
            campagn.save()
            res = "Huỷ thành công"
        return Response(res, status=status.HTTP_200_OK)

class SupplyTypeViewSet(ViewSet, generics.ListAPIView):
    queryset =  SupplyType.objects.filter(active=True)
    serializer_class = SupplyTypeSerializer
    # permission_classes = [IsAuthenticated]

class LocationViewSet(ViewSet, generics.ListAPIView):
    queryset = Location.objects.filter(active=True).order_by("location")
    serializer_class = LocationSerializer
    # permission_classes = [IsAuthenticated]

    @action(methods = ["GET"], detail= False)
    def in_need(self, request):
        qs = Location.objects.filter(active=True).exclude(status=LocationState.NORMAL)
        return Response(LocationSerializer(qs, context={"request": request}).data, status = status.HTTP_200_OK)