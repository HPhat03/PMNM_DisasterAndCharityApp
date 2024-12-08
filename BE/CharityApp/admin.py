from lib2to3.fixes.fix_input import context
from tkinter.font import names

from django.contrib import admin, messages
from django.core.files.storage import storages
from django.db.models import Sum
from django.urls import path
from django.shortcuts import render
from pycparser.c_ast import Return

from .models import *
# Register your models here.

def ApprovalPage(request):
    registeries = DonationCampaign.objects.filter(is_permitted=False, approval__admin_id=request.user.id, approval__is_approved=None)
    context = {
        "registeries" : registeries
    }
    return render(request, 'admin_approval.html', context)
def DetailApprovalePage(request, id = None):
    detail = DonationCampaign.objects.filter(pk=id).first()
    approval = Approval.objects.filter(donation_id=id,is_approved=None).first()
    admins = Admin.objects.all()
    context = {
        "detail": detail,
        "approval": approval,
        "admins": admins
    }
    return render(request, 'admin_detail_approval.html', context)

def ApprovalReportPage(request):
    reports = DonationReport.objects.filter(active=True,confimation=None)
    context = {
        "reports" : reports
    }
    return render(request, 'admin_report_approval.html', context)
def DetailApprovalReportPage(request, id = None):
    report = DonationReport.objects.filter(pk=id).first()
    context = {
        "report": report,
        "detail": report.campaign,
    }
    return render(request, 'admin_detail_report_approval.html', context)

def ApprovalPostPage(request):
    posts = DonationPost.objects.filter(donationpostapproval=None)
    context = {
        "posts" : posts
    }
    return render(request, 'admin_post_approval.html', context)

def DetailPostApprovalePage(request, id = None):
    detail = DonationPost.objects.filter(pk=id).first()
    print(detail.pictures.all())
    context = {
        "detail": detail,
    }
    return render(request, 'admin_detail_post_approval.html', context)

def StorageFollowUpPage(request):
    storages = Storage.objects.filter(active=True)
    context = {
        "storages": storages
    }
    return render(request, 'admin_storage_follow_up.html', context)
def StorageFollowUpDetailPage(request, id=None):
    storages = Storage.objects.filter(active=True)
    detail = Stock.objects.filter(wareHouse__id=id)
    context = {
        "storages": storages,
        "detail": detail
    }
    return render(request, 'admin_storage_detail_follow_up.html', context)
class MyAdminPage(admin.AdminSite):
    site_header = "THE ANTIBUG ADMIN"
    change_list_template = 'admin_approval.html'
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('org_approval/', self.admin_view(ApprovalPage), name='Campaign Approval'),
            path('org_approval/<int:id>/', self.admin_view(DetailApprovalePage), name='Campaign Approval'),
            path('report_approval/', self.admin_view(ApprovalReportPage), name='Report Approval'),
            path('report_approval/<int:id>/', self.admin_view(DetailApprovalReportPage), name='Detail Report Approval'),
            path('post_approval/', self.admin_view(ApprovalPostPage), name='Post Approval'),
            path('post_approval/<int:id>/', self.admin_view(DetailPostApprovalePage), name='Detail Post Approval'),
            path('storage_follow_up/', self.admin_view(StorageFollowUpPage), name='storage_follow_up'),
            path('storage_follow_up/<int:id>/', self.admin_view(StorageFollowUpDetailPage), name='storage_detail_follow_up')
        ]
        return custom_urls + urls

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        print(app_list)
        company_setting = supply_type = storage = applies = {}
        if(len(app_list) > 0):
            app_list[0]['name'] = 'Quyên góp'
            arr = app_list[0]['models']
            mn = 0
            while mn < len(arr):
                match arr[mn]['name']:
                    case 'Donation campaigns':
                        print(mn)
                        arr[mn]['name'] = "Hoạt động kêu gọi quyên góp tổ chức"
                    case 'Company settings':
                        company_setting = app_list[0]['models'].pop(mn)
                        company_setting['name'] = "Cài đặt công ty"
                        mn = mn - 1
                    case 'Supply types':
                        supply_type = app_list[0]['models'].pop(mn)
                        supply_type['name'] = "Cài đặt loại hình quyên góp"
                        mn = mn - 1
                    case 'Stock applys':
                        applies = app_list[0]['models'].pop(mn)
                        applies['name'] = "Đăng kí nhập/xuất quyên góp"
                        mn = mn - 1
                    case 'Storages':
                        storage = app_list[0]['models'].pop(mn)
                        storage['name'] = "Quản lý kho toàn quốc"
                        mn = mn - 1
                mn = mn + 1

        app_list.append({
            'name': ('Phê duyệt và xác nhận'),
            'app_label': 'Campaign Approval',
            'models': [
                {
                    'name': "Hoạt động kêu gọi quyên góp tổ chức",
                    'object_name': ('Registery Approval'),
                    'admin_url': '/admin/org_approval/',
                    'name_plural': 'Campaign Approvals'
                },
                {
                    'name': "Hoạt động kêu gọi quyên góp cá nhân",
                    'object_name': ('Registery Approval'),
                    'admin_url': '/admin/post_approval/',
                    'name_plural': 'Campaign Approvals'
                },
                {
                    'name': "Báo cáo quyên góp tổ chức",
                    'object_name': ('Registery Approval'),
                    'admin_url': '/admin/report_approval/',
                    'name_plural': 'Campaign Approvals'
                }
            ]
        })

        app_list.append({
            'name': ('Cài đặt'),
            'app_label': 'Company Setting',
            'models': [company_setting, supply_type]
        })
        app_list.append({
            'name': ('Kho'),
            'app_label': 'Storage',
            'models': [storage, applies,
                       {
                           'name': "Theo dõi hàng hóa",
                           'object_name': ('Storage Follow up'),
                           'admin_url': '/admin/storage_follow_up/',
                           'name_plural': 'Storage Follow up'
                       }
                       ]
        })
        return app_list
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['id', 'org', 'title', 'is_permitted']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

class CompanySettingAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'topic', 'is_chosen']
class SupplyTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'type', 'unit', 'active']
class StockApplyAdmin(admin.ModelAdmin):
    list_display = ['id', 'way','type', 'campaign', 'location']
    list_filter = ('way','location', 'campaign')
    search_fields = ('campaign',)

    def save_model(self, request, obj, form, change):
        stock = Stock.objects.filter(type= obj.type,wareHouse=obj.wareHouse).first()
        cplc = CampaignLocation.objects.filter(campaign=obj.campaign, location=obj.location).first()
        if cplc is None:
            msg = f'Không tìm thấy nơi cứu trợ trong chiến dịch {obj.campaign}'
            messages.add_message(request, level=messages.ERROR, message=msg)
            return
        if obj.campaign.supply_type != obj.type:
            msg = f'chiến dịch {obj.campaign} hiện không kêu gọi quần áo'
            messages.add_message(request, level=messages.ERROR, message=msg)
            return
        if obj.way == WayType.IMPORT:
            if stock is None:
                Stock.objects.create(type=obj.type, wareHouse=obj.wareHouse, amount=obj.amount)
            else:
                stock.amount += obj.amount
                stock.save()
            cplc.current_fund += obj.amount
            cplc.save()
        elif obj.way == WayType.EXPORT:
            if stock is None:
                msg = f'Không có sẵn hàng để xuất'
                messages.add_message(request, level=messages.ERROR, message=msg)
                return
            else:
                imported = StockApply.objects.filter(campaign=obj.campaign, location=obj.location, wareHouse=obj.wareHouse, way=WayType.IMPORT).aggregate(Sum('amount'))
                exported = StockApply.objects.filter(campaign=obj.campaign, location=obj.location,
                                                     wareHouse=obj.wareHouse, way=WayType.EXPORT).aggregate(Sum('amount'))

                imported = 0 if imported['amount__sum'] is None else imported['amount__sum']
                exported = 0 if exported['amount__sum'] is None else exported['amount__sum']
                available = imported - exported - obj.amount
                print(available)
                if available < 0:
                    msg = f'Không có sẵn hàng để xuất (đã nhập: {imported}, đã xuất: {exported}, còn lại: {imported-exported})'
                    messages.add_message(request, level=messages.ERROR, message=msg)
                    return
                stock.amount -= obj.amount
                stock.save()

        super().save_model(request, obj, form, change)


class StorageAdmin(admin.ModelAdmin):
    list_display = ['id', 'address', 'location']
    list_filter = ('location',)
    search_fields = ('address', 'location')
admin_site = MyAdminPage(name="admin_site")
admin_site.register(DonationCampaign, CampaignAdmin)
admin_site.register(CompanySetting, CompanySettingAdmin)
admin_site.register(SupplyType, SupplyTypeAdmin)
admin_site.register(StockApply, StockApplyAdmin)
admin_site.register(Storage, StorageAdmin)
