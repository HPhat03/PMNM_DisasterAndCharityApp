from lib2to3.fixes.fix_input import context

from cloudinary.uploader import upload
from django.db.models import  Q
from rest_framework import status
import json

from django.db.models import  Q
from rest_framework import status, parsers
from lib2to3.fixes.fix_input import context
from cloudinary.uploader import upload
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FileUploadParser, JSONParser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.files.storage import FileSystemStorage
from .models import *
from .serializers import *
from .permissions import *
import json

# Create your views here.
LIMIT_REPORT = 5
LIMIT_REPORT_DAY = 10
LIMIT_APPROVAL = 3
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
    parser_classes = [parsers.MultiPartParser, ]

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        self.action = self.action_map.get(request.method.lower())
        print(request.content_type)
        if request.method in ['POST'] and self.action == 'add_picture':
            request.parsers = [MultiPartParser(), FileUploadParser()]
        else:
            request.parsers = [JSONParser()]
        return request

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        self.action = self.action_map.get(request.method.lower())
        print(request.content_type)
        if request.method in ['POST'] and self.action in ['add_picture','report']:
            request.parsers = [MultiPartParser(), FileUploadParser()]
        else:
            request.parsers = [JSONParser()]
        return request

    def get_permissions(self):
        if self.action in ['approve','add_picture']:
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        q = self.queryset;
        kw = self.request.query_params.get('kw')
        if kw is not None:
            q = q.filter(Q(title__icontains=kw)|Q(content__icontains=kw))
        return q

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        self.action = self.action_map.get(request.method.lower())
        print(request.content_type)
        if request.method in ['POST'] and self.action == 'report':
            request.parsers = [MultiPartParser(), FileUploadParser()]
        else:
            request.parsers = [JSONParser()]
        return request

    @transaction.atomic()
    def create(self, request, *args, **kwargs):
        res = "Not OK"
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
                            continue
                        campaign.enclosed_article.add(tmp)
                    campaign.save()

                admin = Admin.objects.order_by('?').first()
                print(admin)
                first_approval = Approval(admin= admin, donation=campaign)
                first_approval.save()
                res = self.serializer_class(campaign, context={'request': request}).data
        except Exception as e:
            return Response(e.__str__(), status=status.HTTP_200_OK)
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def add_picture(self, request, pk=None):
        res = []
        campagn = DonationCampaign.objects.filter(pk=pk).first()
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        with transaction.atomic():
            images = request.FILES.getlist('images')
            for image in images:
                cloudinary = upload(image)
                cp = ContentPicture(donation=campagn, path=cloudinary['secure_url'])
                cp.save()
                res.append(cloudinary['secure_url'])
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def report(self, request, pk=None):
        res = "Not OK"
        print(pk)
        campagn = DonationCampaign.objects.filter(pk=pk).first()
        print(campagn)
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        if DonationReport.objects.filter(campaign=campagn).count() >= LIMIT_REPORT:
            return Response("Bạn đã hết số lần nộp báo cáo", status=status.HTTP_200_OK)
        if (date.today() - campagn.expected_charity_end_date).days > LIMIT_REPORT_DAY:
            return Response("Bạn đã quá hạn để báo cáo", status=status.HTTP_200_OK)
        with transaction.atomic():
            rp = DonationReport(campaign=campagn)
            rp.total_used = 0
            rp.save()
            tmp = 0
            details = json.loads(request.data['details'])
            for d in details:
                dt = DetailDonationReport(**d)
                dt.report = rp
                tmp += dt.paid
                dt.save()
            for file in request.FILES.getlist('file'):
                # fs = FileSystemStorage()
                # file_name = fs.save(file.name, file)
                # file_url = fs.url(file_name)
                cloudinary = upload(file)
                dp = DonationReportPicture(report=rp, path=cloudinary['secure_url'])
                dp.save()
            rp.total_used = tmp
            fund = sum(location.current_fund for location in campagn.locations.all())
            rp.total_left = fund - tmp
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

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def approve(self, request,pk=None):
        admin = Admin.objects.filter(user_info_id=request.data['cur_admin']).first()

        if admin is None:
            return Response("Không tìm thấy admin hiện tại", status=status.HTTP_403_FORBIDDEN)
        campaign = DonationCampaign.objects.filter(pk=pk).first()
        if campaign is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        approval = Approval.objects.filter(donation=campaign,is_approved=None).first()
        approval.is_approved = True
        is_final = request.data['is_final']

        if approval.time_id < LIMIT_APPROVAL and not is_final:
            ad = Admin.objects.filter(user_info_id= request.data['next_admin']).first()
            time_id = approval.time_id + 1
            tmp = Approval(admin= ad, donation=campaign, time_id = time_id, created_date = date.today())
            tmp.save()
            print(tmp)
        elif approval.time_id == LIMIT_APPROVAL or is_final:
            approval.is_final = True
            campaign.is_permitted = True
            campaign.save()
        approval.save()
        res = "OK"
        return Response(res, status=status.HTTP_200_OK)

class DonationReportViewSet(ViewSet, generics.ListAPIView):
    queryset = DonationReport.objects.filter(active=True)
    serializer_class = ReportSerializer

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def approve(self, request, pk=None):
        admin = Admin.objects.filter(user_info_id=request.data['cur_admin']).first()
        if admin is None:
            return Response("Không tìm thấy admin hiện tại", status=status.HTTP_403_FORBIDDEN)
        report = DonationReport.objects.filter(pk=pk).first()
        if report is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        approval = Confimation(admin_id=request.user.id, report = report)
        approval.save()
        return Response(self.serializer_class(approval, context = {"request": request}), status=status.HTTP_200_OK)

class DonationPostViewSet(ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = DonationPost.objects.filter(active=True)
    serializer_class = PostSerializer

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        self.action = self.action_map.get(request.method.lower())
        print(request.content_type)
        if request.method in ['POST'] and self.action == 'add_picture':
            request.parsers = [MultiPartParser(), FileUploadParser()]
        else:
            request.parsers = [JSONParser()]
        return request

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def add_picture(self, request, pk=None):
        res = []
        post = DonationPost.objects.filter(pk=pk).first()
        if post is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        with transaction.atomic():
            images = request.FILES.getlist('images')
            for image in images:
                cloudinary = upload(image)
                pic = DonationPostPicture(post=post, picture = cloudinary['secure_url'])
                pic.save()
                res.append(cloudinary['secure_url'])
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def approve(self, request, pk=None):
        admin = Admin.objects.filter(user_info_id=request.data['cur_admin']).first()
        if admin is None:
            return Response("Không tìm thấy admin hiện tại", status=status.HTTP_403_FORBIDDEN)
        post = DonationPost.objects.filter(pk=pk).first()
        if post is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        approval = DonationPostApproval(admin_id=request.user.id, post=post, priority = request.data['priority'])
        approval.save()
        return Response(self.serializer_class(approval, context={"request": request}), status=status.HTTP_200_OK)

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
