from lib2to3.fixes.fix_input import context

from django.contrib import admin
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
    reports = DonationReport.objects.filter(confimation=None)
    context = {
        "reports" : reports
    }
    return render(request, 'admin_report_approval.html', context)
class MyAdminPage(admin.AdminSite):
    site_header = "THE ANTIBUG ADMIN"
    change_list_template = 'admin_approval.html'
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('org_approval/', self.admin_view(ApprovalPage), name='Campaign Approval'),
            path('org_approval/<int:id>/', self.admin_view(DetailApprovalePage), name='Campaign Approval'),
            path('report_approval/', self.admin_view(ApprovalReportPage), name='Report Approval'),
        ]
        return custom_urls + urls

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        print(app_list)
        company_setting = supply_type = {}
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
                    'admin_url': '/admin/approval/',
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

admin_site = MyAdminPage(name="admin_site")
admin_site.register(DonationCampaign, CampaignAdmin)
admin_site.register(CompanySetting, CompanySettingAdmin)
admin_site.register(SupplyType, SupplyTypeAdmin)
