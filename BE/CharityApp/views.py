import hashlib
import hmac
import json
import random
from datetime import datetime, date

import requests
from cloudinary.uploader import upload
from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.db.models import Q
from django.db.models.functions import Lower
from django.shortcuts import render, redirect
from django.views import View
from rest_framework import status
from rest_framework import parsers
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FileUploadParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import (
    Admin, Approval, Article, CampaignLocation, CompanySetting, Confimation,
    ContentPicture, DetailDonationReport, Donation, DonationCampaign, DonationPost,
    DonationPostApproval, DonationPostHistory, DonationPostPicture, DonationReport,
    DonationReportPicture, Location, LocationState, PaymentForm, SupplyType, User,
    UserRole, Chat, HelpRequest
)
from .news_crawler.crawler import Crawler
from .permissions import IsCharityOrg
from .serializers import (
    ArticleSerializer, CampagnSerializer, CharityOrgFromUserSerializer,
    CivilianFromUserSerializer, CompanySettingSerializer, LocationSerializer,
    PostSerializer, ReportSerializer, SupplyTypeSerializer, UserSerializer, ChatSerializer, DonationSerializer,
    CampaignReportSerializer, HelpRequestSerializer
)
from .throttle import OncePerThirtyMinutesThrottle
from .vnpay import vnpay
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

# Create your views here.
LIMIT_REPORT = 5
LIMIT_REPORT_DAY = 10
LIMIT_APPROVAL = 3

class InitView(View):
    def get(self, request):
        context = {}
        return render(request, "offline.html", context)
def chat(request):
    userS = request.GET.get("user_send")
    userR = request.GET.get("user_receive")
    type = request.GET.get('from')

    if type == 'USER':
        chat = Chat.objects.filter(civilian_id=userS, org_id=userR).first()
        print(chat)
        if chat is None:
            Chat.objects.create(civilian_id=userS, org_id=userR)
        else:
            chat.firebase_id = f'{random.randint(1000, 9000)}'
            chat.save()
    elif type == 'ORG':
        chat = Chat.objects.filter(civilian_id=userR, org_id=userS).first()
        if chat is not None:
            chat.firebase_id = f'{random.randint(1000, 9000)}'
            chat.save()
    context = {
        "user_send" : userS,
        "user_receive": userR
    }
    return render(request, "chat.html", context)

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

class DonationCampaignViewSet(ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = DonationCampaign.objects.filter(active=True, is_permitted = True).order_by("-created_date")
    serializer_class = CampagnSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        self.action = self.action_map.get(request.method.lower())

        if request.method in ['POST'] and self.action in ['add_picture','report']:
            request.parsers = [MultiPartParser(), FileUploadParser()]
        else:
            print(request.content_type)
            request.parsers = [JSONParser()]
        return request

    def get_permissions(self):
        if self.action in ['approve','add_picture', 'report_approve']:
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        q = self.queryset
        kw = self.request.query_params.get('kw')
        order_flag = self.request.query_params.get('ordered')
        if kw is not None:
            q = q.filter(Q(title__icontains=kw)|Q(content__icontains=kw))
        if order_flag is not None and order_flag == '1':
            print("hello")
            q = q.filter(org__badge__gt=0).order_by("-org__badge")
        return q

    @transaction.atomic()
    def create(self, request, *args, **kwargs):
        res = "Not OK"
        if "locations" not in request.data.keys():
            return Response("chưa có nơi cứu trợ", status=status.HTTP_200_OK)
        else:
            locations = request.data.pop("locations")

        enclosed = None
        if "enclosed" in request.data.keys():
            enclosed = request.data.pop("enclosed")

        supply_type = SupplyType.objects.filter(pk=request.data.pop('supply_type')).first()
        if supply_type is None:
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

                if enclosed:
                    for enc in enclosed:
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
        res = "Thành công"
        campagn = DonationCampaign.objects.filter(pk=pk).first()
        print(campagn)
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        if DonationReport.objects.filter(campaign=campagn).exclude(confirm=None).first() is not None:
            return Response("Hoạt động này đã được phê duyệt báo cáo", status=status.HTTP_200_OK)
        if DonationReport.objects.filter(campaign=campagn).count() >= LIMIT_REPORT:
            return Response("Bạn đã hết số lần nộp báo cáo", status=status.HTTP_200_OK)
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
            print(rp.id)
            if rp.total_used == 0:
                return Response("Số tiền bạn quyên góp là 0, Cảnh Báo", status=status.HTTP_200_OK)
            if rp.total_left > 500000:
                return Response("Số tiền bạn quyên góp còn dư quá nhiều, Cảnh Báo", status=status.HTTP_200_OK)
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def report_approve(self, request, pk=None):
        admin = Admin.objects.filter(user_info_id=request.data['cur_admin']).first()
        print(admin)
        if admin is None:
            return Response("Không tìm thấy admin hiện tại", status=status.HTTP_403_FORBIDDEN)
        report = DonationReport.objects.filter(pk=pk).first()
        if report is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        print("hello" + request.data['is_approved'])
        if request.data['is_approved'] == "-1":
            report.active = False
            report.save()
            return Response("OK", status=status.HTTP_200_OK)
        elif request.data['is_approved'] == "1":
            approval = Confimation(admin=admin,report =report)
            approval.save()
        return Response("OK", status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def warning(self, request, pk):
        campagn = DonationCampaign.objects.filter(pk=pk).first()
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        from django.core.mail import send_mail
        if request.data['type'] == "LATE":
            t = send_mail(
                subject="NHẮC NHỞ: NỘP BÁO CÁO CHIẾN DỊCH QUÁ HẠN",
                message=f'''Xin chào quý anh chị, đại diện tổ chức chiến dịch {campagn.title},
                Gần đây chúng tôi đã nhận được báo cáo của anh chị và đã phê duyệt thành công, tuy nhiên báo cáo đã vượt quá hạn 3 ngày nộp báo cáo theo quy định. Nhằm đảm báo một môi trường quyên góp cộng đồng công khai, minh bạch. Chúng tôi hy vọng trong các chiến dịch tới quý anh chị có thể nộp trong khoản thời gian quy định.
                Chúng tôi xin chân thành cảm ơn quý anh chị đã xem mail này.
                            
                Trân trọng 
                        ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[campagn.org.user_info.email]
            )
        elif request.data['type'] == "UNREPORT":
            t = send_mail(
                subject="NHẮC NHỞ: NỘP BÁO CÁO CHIẾN DỊCH",
                message=f'''Xin chào quý anh chị, đại diện tổ chức chiến dịch {campagn.title},
                Được biết sau khoản thời gian thực hiện hoạt động, đến nay chúng tôi vẫn chưa nhận được bất kì báo cáo hoạt động chiến dịch từ quý anh chị. Nhằm đảm báo một môi trường quyên góp cộng đồng công khai, minh bạch. Chúng tôi hy vọng anh chị có thể nộp báo cáo hoạt động của chiến dịch càng sớm càng tốt.
                Chúng tôi xin chân thành cảm ơn quý anh chị đã xem mail này.

                Trân trọng 
                                    ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[campagn.org.user_info.email]
            )
        return Response("OK", status=status.HTTP_200_OK)
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

    @transaction.atomic()
    @action(methods=['GET'], detail=True)
    def history(self, request, pk=None):
        res = "Not OK"
        campagn = Donation.objects.filter(campaign__campaign_id=pk).all()
        if campagn is None or len(campagn) == 0:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        print(campagn)
        res = DonationSerializer(campagn, many=True, context={"request": request}).data
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['GET'], detail=True)
    def report(self, request, pk=None):
        res = "Not OK"
        campagn = DonationReport.objects.filter(campaign_id=pk).exclude(confimation=None).order_by('-created_date').first()
        if campagn is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        print(campagn)
        res = CampaignReportSerializer(campagn, context={"request": request}).data
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
    queryset = DonationPost.objects.filter(active=True).exclude(donationpostapproval=None).order_by("-created_date")
    serializer_class = PostSerializer

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        self.action = self.action_map.get(request.method.lower())
        print(request.content_type)
        if request.method in ['POST'] and self.action in ['add_picture', 'create', 'analyze_picture']:
            request.parsers = [MultiPartParser(), FileUploadParser()]
        else:
            request.parsers = [JSONParser()]
        return request

    def create(self, request, *args, **kwargs):
        res = "NOT OK"
        with transaction.atomic():
            post = DonationPost(civilian_id = request.user.id, content = request.data['content'])
            post.save()
            images = request.FILES.getlist('images')
            print(images)
            for image in images:
                cloudinary = upload(image)
                pic = DonationPostPicture(post=post, picture=cloudinary['secure_url'])
                pic.save()
            res = self.serializer_class(post).data
        return Response(res, status=status.HTTP_200_OK)

    @transaction.atomic()
    @action(methods=['POST'], detail=True)
    def approve(self, request, pk=None):
        admin = Admin.objects.filter(user_info_id=request.data['cur_admin']).first()
        print(admin)
        if admin is None:
            return Response("Không tìm thấy admin hiện tại", status=status.HTTP_403_FORBIDDEN)
        post = DonationPost.objects.filter(pk=pk).first()
        if post is None:
            return Response("Không tồn tại", status=status.HTTP_200_OK)
        approval = DonationPostApproval(admin = admin, post=post, priority = request.data['priority'])
        approval.save()
        return Response("OK", status=status.HTTP_200_OK)

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

class SettingViewSet(ViewSet, generics.ListAPIView):
    queryset = CompanySetting.objects.filter(active=True, is_chosen=True).first()
    serializer_class = CompanySettingSerializer

    def list(self, request, *args, **kwargs):
        res = "UNAVAILABLE SETTING"
        queryset = CompanySetting.objects.filter(active=True, is_chosen=True).first()
        if queryset is not None:
            res = self.serializer_class(queryset, context = {'request': request}).data
        return Response(res,status=status.HTTP_200_OK)

class ArticleViewSet(ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    def get_permissions(self):
        return [AllowAny()]

class ChatViewSet(ViewSet, generics.ListAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def get_permissions(self):
        return [IsCharityOrg()]

    def list(self, request, *args, **kwargs):
        res = 'NULL'
        qs = Chat.objects.filter(org_id=request.user.id).order_by('-updated_date').all()
        if len(qs) != 0:
            res = self.serializer_class(qs, many=True, context = {"request": request}).data
        return Response(res, status=status.HTTP_200_OK)

class LocationViewSet(ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    def get_permissions(self):
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        res = "Not OK"
        name = request.query_params.get('location')
        print(name)
        qs = Location.objects.filter(location=name).first()
        print(qs)
        if qs is not None:
            res = self.serializer_class(qs, context={"request": request}).data
        return Response(res, status=status.HTTP_200_OK)

class HelpRequestViewSet(ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = HelpRequest.objects.all()
    serializer_class = HelpRequestSerializer

@api_view(['GET'])
def crawl_view(request):
    topic = request.query_params.get('topic', None)

    if not topic:
        raise ValidationError({"error": "Missing required parameter: 'topic'"})

    throttle = OncePerThirtyMinutesThrottle()
    if not throttle.allow_request(request, crawl_view):
        wait_time = throttle.wait()
        return Response(
            {"error": "Request throttled. Try again later.", "retry_after": wait_time},
            status=429,
        )

    crawler = Crawler(num_workers=2)
    crawler.start_crawling(search_query=topic)

    return Response({"message": f"Crawling started successfully with topic: {topic}"})


@api_view(['GET'])
def init_article_view(request):
    crawl_status = cache.get('article_crawl_status')
    if crawl_status:
        return Response({"error": "This endpoint can only be called once during the system's lifetime."}, status=403)

    topic = request.query_params.get('topic', None)
    if not topic:
        raise ValidationError({"error": "Missing required parameter: 'topic'"})

    crawler = Crawler(num_workers=2, init=True)
    crawler.start_crawling(search_query=topic)

    return Response({"message": f"Crawling started successfully with topic: {topic}"})


def index(request):
    return render(request, "payment/index.html", {"title": "Danh sách demo"})

def hmacsha512(key, data):
    byteKey = key.encode('utf-8')
    byteData = data.encode('utf-8')
    return hmac.new(byteKey, byteData, hashlib.sha512).hexdigest()


def payment(request):

    if request.method == 'POST':
        # Process input data and build url payment
        form = PaymentForm(request.POST)
        if form.is_valid():
            order_type = form.cleaned_data['order_type']
            order_id = form.cleaned_data['order_id']
            amount = form.cleaned_data['amount']
            order_desc = form.cleaned_data['order_desc']
            bank_code = form.cleaned_data['bank_code']
            language = form.cleaned_data['language']
            ipaddr = get_client_ip(request)
            # Build URL Payment
            vnp = vnpay()
            vnp.requestData['vnp_Version'] = '2.1.0'
            vnp.requestData['vnp_Command'] = 'pay'
            vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
            vnp.requestData['vnp_Amount'] = amount * 100
            vnp.requestData['vnp_CurrCode'] = 'VND'
            vnp.requestData['vnp_TxnRef'] = order_id
            vnp.requestData['vnp_OrderInfo'] = order_desc
            vnp.requestData['vnp_OrderType'] = order_type
            # Check language, default: vn
            if language and language != '':
                vnp.requestData['vnp_Locale'] = language
            else:
                vnp.requestData['vnp_Locale'] = 'vn'
                # Check bank_code, if bank_code is empty, customer will be selected bank on VNPAY
            if bank_code and bank_code != "":
                vnp.requestData['vnp_BankCode'] = bank_code

            vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')  # 20150410063022
            vnp.requestData['vnp_IpAddr'] = ipaddr
            vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
            vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)
            print(vnpay_payment_url)
            return redirect(vnpay_payment_url)
        else:
            print("Form input not validate")
    else:
        user_id = request.GET.get('user_id')
        campaign_id = request.GET.get('campaign_id')
        type = request.GET.get('type')
        response = render(request, "payment/payment.html", {"title": "Thanh toán"})
        response.set_cookie('user_id', user_id, max_age=600)
        response.set_cookie('campaign_id', campaign_id, max_age=600)
        response.set_cookie('type', type, max_age=600)
        return response


def payment_ipn(request):
    inputData = request.GET
    if not inputData:
        return JsonResponse({'RspCode': '99', 'Message': 'Invalid request'})

    vnp = vnpay()
    vnp.responseData = inputData.dict()
    order_id = inputData['vnp_TxnRef']
    amount = inputData['vnp_Amount']
    order_desc = inputData['vnp_OrderInfo']
    vnp_TransactionNo = inputData['vnp_TransactionNo']
    vnp_ResponseCode = inputData['vnp_ResponseCode']
    vnp_TmnCode = inputData['vnp_TmnCode']
    vnp_PayDate = inputData['vnp_PayDate']
    vnp_BankCode = inputData['vnp_BankCode']
    vnp_CardType = inputData['vnp_CardType']

    if not vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
        return JsonResponse({'RspCode': '97', 'Message': 'Invalid Signature'})

    # Check & Update Order Status in your Database
    # Your code here
    firstTimeUpdate = True
    totalamount = True

    if not totalamount:
        return JsonResponse({'RspCode': '04', 'Message': 'invalid amount'})

    if not firstTimeUpdate:
        return JsonResponse({'RspCode': '02', 'Message': 'Order Already Update'})

    if vnp_ResponseCode == '00':
        print('Payment Success. Your code implement here')
    else:
        print('Payment Error. Your code implement here')

    # Return VNPAY: Merchant update success
    return JsonResponse({'RspCode': '00', 'Message': 'Confirm Success'})


def payment_return(request):
    inputData = request.GET
    if not inputData:
        return render(request, "payment/payment_return.html", {"title": "Kết quả thanh toán", "result": ""})

    vnp = vnpay()
    vnp.responseData = inputData.dict()
    order_id = inputData['vnp_TxnRef']
    amount = int(inputData['vnp_Amount']) / 100
    order_desc = inputData['vnp_OrderInfo']
    vnp_TransactionNo = inputData['vnp_TransactionNo']
    vnp_ResponseCode = inputData['vnp_ResponseCode']
    vnp_TmnCode = inputData['vnp_TmnCode']
    vnp_PayDate = inputData['vnp_PayDate']
    vnp_BankCode = inputData['vnp_BankCode']
    vnp_CardType = inputData['vnp_CardType']

    if not vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
        return render(
            request, "payment/payment_return.html",
            {
                "title": "Kết quả thanh toán",
                "result": "Lỗi",
                "order_id": order_id,
                "amount": amount,
                "order_desc": order_desc,
                "vnp_TransactionNo": vnp_TransactionNo,
                "vnp_ResponseCode": vnp_ResponseCode,
                "msg": "Sai checksum"
            }
        )

    if vnp_ResponseCode != "00":
        return render(
            request, "payment/payment_return.html",
            {
                "title": "Kết quả thanh toán",
                "result": "Lỗi",
                "order_id": order_id,
                "amount": amount,
                "order_desc": order_desc,
                "vnp_TransactionNo": vnp_TransactionNo,
                "vnp_ResponseCode": vnp_ResponseCode
            }
        )

    uid = request.COOKIES.get('user_id')
    cid = request.COOKIES.get('campaign_id')

    match request.COOKIES.get("type"):
        case "campaign":
            Donation.objects.create(civilian_id=uid, campaign_id= cid, donated=amount)
            cp = CampaignLocation.objects.filter(pk=cid).first()
            cp.current_fund += amount
            cp.save()
        case "post":
            DonationPostHistory.objects.create(user_id=uid,post_id=cid, donated=amount)

    return render(
        request, "payment/payment_return.html",
        {
            "title": "Kết quả thanh toán",
            "result": "Thành công",
            "order_id": order_id,
            "amount": amount,
            "order_desc": order_desc,
            "vnp_TransactionNo": vnp_TransactionNo,
            "vnp_ResponseCode": vnp_ResponseCode
        }
    )


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

n = random.randint(10**11, 10**12 - 1)
n_str = str(n)
while len(n_str) < 12:
    n_str = '0' + n_str


def query(request):
    if request.method == 'GET':
        return render(request, "payment/query.html", {"title": "Kiểm tra kết quả giao dịch"})

    url = settings.VNPAY_API_URL
    secret_key = settings.VNPAY_HASH_SECRET_KEY
    vnp_TmnCode = settings.VNPAY_TMN_CODE
    vnp_Version = '2.1.0'

    vnp_RequestId = n_str
    vnp_Command = 'querydr'
    vnp_TxnRef = request.POST['order_id']
    vnp_OrderInfo = 'kiem tra gd'
    vnp_TransactionDate = request.POST['trans_date']
    vnp_CreateDate = datetime.now().strftime('%Y%m%d%H%M%S')
    vnp_IpAddr = get_client_ip(request)

    hash_data = "|".join([
        vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode,
        vnp_TxnRef, vnp_TransactionDate, vnp_CreateDate,
        vnp_IpAddr, vnp_OrderInfo
    ])

    secure_hash = hmac.new(secret_key.encode(), hash_data.encode(), hashlib.sha512).hexdigest()

    data = {
        "vnp_RequestId": vnp_RequestId,
        "vnp_TmnCode": vnp_TmnCode,
        "vnp_Command": vnp_Command,
        "vnp_TxnRef": vnp_TxnRef,
        "vnp_OrderInfo": vnp_OrderInfo,
        "vnp_TransactionDate": vnp_TransactionDate,
        "vnp_CreateDate": vnp_CreateDate,
        "vnp_IpAddr": vnp_IpAddr,
        "vnp_Version": vnp_Version,
        "vnp_SecureHash": secure_hash
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        response_json = json.loads(response.text)
    else:
        response_json = {"error": f"Request failed with status code: {response.status_code}"}

    return render(request, "payment/query.html", {"title": "Kiểm tra kết quả giao dịch", "response_json": response_json})

def refund(request):
    if request.method == 'GET':
        return render(request, "payment/refund.html", {"title": "Hoàn tiền giao dịch"})

    url = settings.VNPAY_API_URL
    secret_key = settings.VNPAY_HASH_SECRET_KEY
    vnp_TmnCode = settings.VNPAY_TMN_CODE
    vnp_RequestId = n_str
    vnp_Version = '2.1.0'
    vnp_Command = 'refund'
    vnp_TransactionType = request.POST['TransactionType']
    vnp_TxnRef = request.POST['order_id']
    vnp_Amount = request.POST['amount']
    vnp_OrderInfo = request.POST['order_desc']
    vnp_TransactionNo = '0'
    vnp_TransactionDate = request.POST['trans_date']
    vnp_CreateDate = datetime.now().strftime('%Y%m%d%H%M%S')
    vnp_CreateBy = 'user01'
    vnp_IpAddr = get_client_ip(request)

    hash_data = "|".join([
        vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode, vnp_TransactionType, vnp_TxnRef,
        vnp_Amount, vnp_TransactionNo, vnp_TransactionDate, vnp_CreateBy, vnp_CreateDate,
        vnp_IpAddr, vnp_OrderInfo
    ])

    secure_hash = hmac.new(secret_key.encode(), hash_data.encode(), hashlib.sha512).hexdigest()

    data = {
        "vnp_RequestId": vnp_RequestId,
        "vnp_TmnCode": vnp_TmnCode,
        "vnp_Command": vnp_Command,
        "vnp_TxnRef": vnp_TxnRef,
        "vnp_Amount": vnp_Amount,
        "vnp_OrderInfo": vnp_OrderInfo,
        "vnp_TransactionDate": vnp_TransactionDate,
        "vnp_CreateDate": vnp_CreateDate,
        "vnp_IpAddr": vnp_IpAddr,
        "vnp_TransactionType": vnp_TransactionType,
        "vnp_TransactionNo": vnp_TransactionNo,
        "vnp_CreateBy": vnp_CreateBy,
        "vnp_Version": vnp_Version,
        "vnp_SecureHash": secure_hash
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        response_json = json.loads(response.text)
    else:
        response_json = {"error": f"Request failed with status code: {response.status_code}"}

    return render(request, "payment/refund.html", {"title": "Kết quả hoàn tiền giao dịch", "response_json": response_json})
