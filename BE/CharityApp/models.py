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
from datetime import date, timedelta

from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import TextInput
from django_enumfield import enum
from django import forms

from .enums import ContentPictureType, LocationState, UserRole, WayType


class BaseModel(models.Model):
    class Meta:
        abstract = True

    id = models.AutoField(primary_key=True)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    active = models.BooleanField(default=True)


class User(AbstractUser):
    birthdate = models.DateField(null=False, default=date(2024, 1, 1))
    address = models.CharField(max_length=100, null=False, default='ABC')
    gender = models.BooleanField(null=False, default=True)
    avatar = CloudinaryField('image', default= None, null=True)
    role = enum.EnumField(UserRole, default=UserRole.CIVILIAN)
    bank = models.CharField(max_length=100, default="Vietcombank")
    bank_id = models.CharField(max_length=20, default="12345678910")

    @property
    def name(self):
        return self.last_name + ' ' + self.first_name

    @property
    def image_url(self):
        return self.avatar.url


class Civilian(models.Model):
    user_info = models.OneToOneField(User,related_name="civilian_info",on_delete=models.CASCADE, primary_key=True, null=False)
    money = models.IntegerField(default=0)

    def __str__(self):
        return self.user_info.last_name + " " + self.user_info.first_name


class Admin(models.Model):
    user_info = models.OneToOneField(User,related_name="admin_info",on_delete=models.CASCADE, primary_key=True, null=False)

    def __str__(self):
        return self.user_info.username


class CharityOrg(models.Model):
    user_info = models.OneToOneField(User,related_name="charity_org_info",on_delete=models.CASCADE, primary_key=True, null=False)
    is_verified = models.BooleanField(default=False)
    civilian_id = models.CharField(max_length=15)
    civilian_id_date = models.DateField()
    badge = models.ForeignKey('Badge', related_name='orgs', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.user_info.username


class Chat(BaseModel):
    civilian = models.ForeignKey(Civilian,on_delete=models.CASCADE, null= False, related_name="chat")
    org = models.ForeignKey(CharityOrg, on_delete=models.CASCADE, null= False, related_name="chat")
    firebase_id = models.CharField(max_length=20, null= True)


class Badge(BaseModel):
    tittle = models.CharField(max_length=100)
    condition = models.CharField(max_length=100)


class DonationPost(BaseModel):
    civilian = models.ForeignKey(Civilian, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    supply_type = models.ForeignKey("SupplyType", on_delete=models.CASCADE, related_name="posts", default=1)


class DonationPostPicture(BaseModel):
    post = models.ForeignKey(DonationPost, on_delete=models.CASCADE, related_name="pictures")
    picture = CloudinaryField('image', default= None, null=True)


class DonationPostApproval(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='confirmed_post')
    post = models.OneToOneField(DonationPost, on_delete=models.CASCADE, primary_key=True)
    priority = models.IntegerField(default= 1)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    active = models.BooleanField(default=True)


class DonationPostHistory(BaseModel):
    user = models.ForeignKey(Civilian, on_delete=models.CASCADE, null=False, related_name="post_donated")
    post = models.ForeignKey(DonationPost, on_delete=models.CASCADE, null=False, related_name="donated")
    donated = models.IntegerField()


class DonationCampaign(BaseModel):
    org = models.ForeignKey(CharityOrg, on_delete=models.CASCADE, null=False, related_name="campaign")
    title = models.CharField(max_length=50, default="ABC")
    content = models.TextField()
    supply_type = models.ForeignKey("SupplyType", on_delete=models.CASCADE, related_name="campaigns", default=1)
    expected_charity_start_date = models.DateField()
    expected_charity_end_date = models.DateField()
    is_permitted = models.BooleanField(default=False)
    enclosed_article = models.ManyToManyField('Article', related_name='enclosed')

    def __str__(self):
        return f"{self.title} - {self.org.user_info.first_name} ({self.expected_charity_start_date} - {self.expected_charity_end_date})"


class DonationReport(BaseModel):
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE)
    total_used = models.IntegerField()
    total_left = models.IntegerField(default=0)

    @property
    def is_late(self):
        return self.created_date > self.campaign.expected_charity_end_date + timedelta(days=3)


class DonationReportPicture(BaseModel):
    report = models.ForeignKey(DonationReport, related_name="pictures", on_delete=models.CASCADE)
    path = models.CharField(max_length=20)


class DetailDonationReport(BaseModel):
    report = models.ForeignKey(DonationReport, related_name="details", on_delete=models.CASCADE)
    paid_for = models.CharField(max_length=100)
    paid = models.IntegerField()


class ContentPicture(BaseModel):
    donation = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE, null=False, related_name="pictures")
    type = enum.EnumField(ContentPictureType, default=ContentPictureType.CONTENT)
    path = CloudinaryField('image', default= None, null=True)


class SupplyType(BaseModel):
    type = models.CharField(max_length=10)
    unit = models.CharField(max_length=10, default="Kg")
    
    def __str__(self):
        return f'{self.type} ({self.unit})'


class CampaignLocation(BaseModel):
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE, related_name="locations")
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name="campaigns")
    expected_fund = models.IntegerField()
    current_fund = models.IntegerField(default=0)

    class Meta:
        unique_together = ['campaign', 'location']


class Storage(BaseModel):
    address = models.CharField(max_length=100)
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name="storage")


class Stock(BaseModel):
    type = models.ForeignKey(SupplyType, related_name='stocks', null=False, on_delete=models.CASCADE)
    amount = models.IntegerField()
    wareHouse = models.ForeignKey(Storage,on_delete= models.CASCADE, null=False,related_name="stock")


class StockApply(BaseModel):
    type = models.ForeignKey(SupplyType, related_name='stock_applies', null=False, on_delete=models.CASCADE)
    amount = models.IntegerField()
    way = enum.EnumField(WayType, default = WayType.IMPORT)
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE, related_name="stock_applies")
    location = models.ForeignKey('Location', on_delete=models.CASCADE, default=1)
    wareHouse = models.ForeignKey(Storage, on_delete=models.CASCADE, null=False, related_name="stock_applies")


class Approval(BaseModel):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name= 'approvals')
    donation = models.ForeignKey(DonationCampaign, on_delete=models.CASCADE)
    time_id = models.IntegerField(null=False, default=1)
    is_approved = models.BooleanField(null=True)
    is_final = models.BooleanField(default=False)


class Confimation (models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='confirmed')
    report = models.OneToOneField(DonationReport, on_delete=models.CASCADE, primary_key=True)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    active = models.BooleanField(default=True)


class Donation(BaseModel):
    civilian = models.ForeignKey(Civilian, on_delete=models.CASCADE, null=False, related_name="donated")
    campaign = models.ForeignKey(CampaignLocation, on_delete=models.CASCADE, null=False, related_name="donated")
    donated = models.IntegerField()


class Article(BaseModel):
    title = models.CharField(max_length=100)
    brief = models.TextField()
    real_path = models.CharField(max_length=255)
    img_url = models.CharField(null=True, max_length=255)
    content = models.TextField()
    created_date = models.DateField()
    updated_date = models.DateField()


# class Comment(BaseModel):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     article = models.ForeignKey(Article, on_delete=models.CASCADE)
#     level = models.IntegerField(default=1)
#     content = models.CharField(max_length=100)
#

# class Reply (models.Model):
#     comment = models.OneToOneField(Comment, on_delete=models.CASCADE, primary_key=True, null=False, related_name='reply')
#     parent = models.OneToOneField(Comment, on_delete=models.CASCADE, null=False, related_name='childs')


class Location(BaseModel):
    location = models.CharField(max_length=45, unique=True)
    area = models.IntegerField(default = 1)
    current_status = models.CharField(max_length=100, default="Bình thường")
    latitude = models.DecimalField(max_digits=9, decimal_places=6,default=0.0, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6,default=0.0, null=True)

    def __str__(self):
        return self.location


class StatInfo(BaseModel):
    location = models.ForeignKey(Location, related_name='stat_history', on_delete=models.CASCADE)
    status = enum.EnumField(LocationState, default=LocationState.NORMAL)
    label = models.CharField(max_length=40)
    number = models.FloatField()


class CompanySetting(BaseModel):
    topic = models.CharField(max_length=20)
    title = models.CharField(max_length=100)
    type = enum.EnumField(LocationState, default=LocationState.DISASTER)
    primary_color = models.CharField(max_length=20)
    secondary_color = models.CharField(max_length=20)
    button_color = models.CharField(max_length=20)
    log_color = models.CharField(max_length=20)
    logo = models.CharField(max_length=200)
    is_chosen = models.BooleanField(default=False)
    deploy_path = models.CharField(max_length=255)
    openai_key = models.CharField(max_length=255)


class HelpRequest(BaseModel):
    latitude = models.DecimalField(max_digits=9, decimal_places=6,default=0.0, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6,default=0.0, null=True)
    location = models.ForeignKey(Location, related_name='help_request', on_delete=models.CASCADE, null=True)
    victim_name = models.CharField(max_length=50, null=True)
    victim_problem = models.CharField(max_length=100, null=True)
    victim_solution = models.TextField()
    victim_place = models.CharField(max_length=225, null=True)
    is_helping = models.BooleanField(default=False)


class CameraLocation(BaseModel):
    camera_code = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0, null=True)
    location = models.ForeignKey(Location, related_name='cameras', on_delete=models.CASCADE)


class PaymentForm(forms.Form):
    order_id = forms.CharField(max_length=250)
    order_type = forms.CharField(max_length=20)
    amount = forms.IntegerField()
    order_desc = forms.CharField(max_length=100)
    bank_code = forms.CharField(max_length=20, required=False)
    language = forms.CharField(max_length=2)


class SettingForm(forms.ModelForm):
    class Meta:
        model = CompanySetting
        fields= "__all__"
        widgets = {
            'primary_color': TextInput(attrs={
                'class': 'color-picker',
                'type': 'color',
                'style': 'width: 100px;'
            }),
            'secondary_color': TextInput(attrs={
                'class': 'color-picker',
                'type': 'color',
                'style': 'width: 100px;'
            }),
            'button_color': TextInput(attrs={
                'class': 'color-picker',
                'type': 'color',
                'style': 'width: 100px;'
            }),
            'log_color': TextInput(attrs={
                'class': 'color-picker',
                'type': 'color',
                'style': 'width: 100px;'
            })
        }
