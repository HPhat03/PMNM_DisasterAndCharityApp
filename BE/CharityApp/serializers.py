from django.db import transaction
from rest_framework import serializers

from .enums import UserRole
from .models import (
    Article, CampaignLocation, CharityOrg, Chat, Civilian, CompanySetting,
    ContentPicture, DetailDonationReport, Donation, DonationCampaign,
    DonationPost, DonationPostPicture, DonationReport, DonationReportPicture,
    HelpRequest, Location, SupplyType, User
)


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class UserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    @transaction.atomic
    def create(self, validated_data):
        with transaction.atomic():
            other = {}
            if 'civilian_id' in validated_data.keys():
                other['civilian_id'] = validated_data.pop('civilian_id')

            if 'civilian_id_date' in validated_data.keys():
                other['civilian_id_date'] = validated_data.pop('civilian_id_date')

            user = User(**validated_data)
            user.set_password(validated_data['password'])
            user.role = UserRole.CIVILIAN if 'role' not in validated_data.keys() else validated_data['role']
            user.save()
            match (user.role):
                case UserRole.CIVILIAN:
                    info = Civilian(user_info = user)
                    info.save()
                case UserRole.CHARITY_ORG:
                    info = CharityOrg(user_info = user, civilian_id = other['civilian_id'], civilian_id_date = other['civilian_id_date'])
                    info.save()
            return user
        return None


class CivilianFromUserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Civilian
        # fields = "__all__"
        exclude = ('user_info',)


class CharityOrgFromUserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = CharityOrg
        # fields = "__all__"
        exclude = ('user_info',)


class CivilianSerializer(DynamicFieldsModelSerializer):
    user_info = UserSerializer(fields=['id', 'username', 'first_name', 'last_name', 'bank', 'bank_id', 'address'])

    class Meta:
        model = Civilian
        fields = "__all__"


class CharityOrgSerializer(DynamicFieldsModelSerializer):
    user_info = UserSerializer(fields=['id','username', 'first_name'])

    class Meta:
        model = CharityOrg
        fields = "__all__"


class ContentPictureSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ContentPicture
        fields = "__all__"


class SupplyTypeSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = SupplyType
        fields = "__all__"


class LocationSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class CampaignLocationDynamidSerializer(DynamicFieldsModelSerializer):
    location = LocationSerializer(fields=['location'])

    class Meta:
        model = CampaignLocation
        fields = "__all__"


class ArticleSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"


class CampagnSerializer(DynamicFieldsModelSerializer):
    org = CharityOrgSerializer()
    pictures = ContentPictureSerializer(many=True, fields=['path'])
    supply_type = SupplyTypeSerializer(fields=['type', 'unit'])
    locations = CampaignLocationDynamidSerializer(many=True, fields=['id','location', 'expected_fund', 'current_fund'])
    enclosed_article = ArticleSerializer(many=True)

    class Meta:
        model = DonationCampaign
        fields = "__all__"


class CampaignLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignLocation
        fields = ['id', 'campaign', 'location', 'expected_fund', 'current_fund']


class ReportSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = DonationReport
        fields = "__all__"


class DonationPostPictureSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = DonationPostPicture
        fields = "__all__"


class PostSerializer(DynamicFieldsModelSerializer):
    civilian = CivilianSerializer()
    pictures = DonationPostPictureSerializer(many=True, fields=['picture'])

    class Meta:
        model = DonationPost
        fields = "__all__"


class ArticleSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"


class ChatSerializer(DynamicFieldsModelSerializer):
    civilian = CivilianSerializer()

    class Meta:
        model = Chat
        fields = "__all__"


class CompanySettingSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = CompanySetting
        fields = "__all__"


class DonationSerializer(DynamicFieldsModelSerializer):
    civilian = CivilianSerializer()
    campaign =  CampaignLocationDynamidSerializer(fields=['id','location'])

    class Meta:
        model = Donation
        fields = "__all__"


class DonationReportPictureSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = DonationReportPicture
        fields = "__all__"


class DonationReportDetailSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = DetailDonationReport
        fields = "__all__"


class CampaignReportSerializer(DynamicFieldsModelSerializer):
    pictures = DonationReportPictureSerializer(fields= ['path'], many=True)
    details = DonationReportDetailSerializer(fields= ['id','paid_for', 'paid'], many=True)

    class Meta:
        model = DonationReport
        fields = "__all__"


class HelpRequestSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HelpRequest
        fields = "__all__"
