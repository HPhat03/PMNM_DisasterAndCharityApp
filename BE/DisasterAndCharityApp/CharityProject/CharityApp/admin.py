from django.contrib import admin
from django.urls import path
from django.shortcuts import render
# Register your models here.

def ApprovalPage(request):
    return render(request, 'admin_approval.html', {})

class MyAdminPage(admin.AdminSite):
    site_header = "THE ANTIBUG ADMIN"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('custom-page/', self.admin_view(ApprovalPage), name='custom_admin_page'),
        ]
        return custom_urls + urls


admin_site = MyAdminPage(name="admin_site")