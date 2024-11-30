# Generated by Django 5.1.3 on 2024-11-30 09:37

import CharityApp.models
import django.db.models.deletion
import django_enumfield.db.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CharityApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompanySetting',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('topic', models.CharField(max_length=20)),
                ('title', models.CharField(max_length=100)),
                ('type', django_enumfield.db.fields.EnumField(default=2, enum=CharityApp.models.LocationState)),
                ('primary_color', models.CharField(max_length=20)),
                ('secondary_color', models.CharField(max_length=20)),
                ('button_color', models.CharField(max_length=20)),
                ('log_color', models.CharField(max_length=20)),
                ('logo', models.CharField(max_length=20)),
                ('stat_data_source', models.CharField(max_length=100)),
                ('is_chosen', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('location', models.CharField(max_length=45, unique=True)),
                ('area', models.IntegerField(default=1)),
                ('current_status', django_enumfield.db.fields.EnumField(default=0, enum=CharityApp.models.LocationState)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SupplyType',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('type', models.CharField(max_length=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='reply',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='reply',
            name='parent',
        ),
        migrations.RenameField(
            model_name='donationreport',
            old_name='donation',
            new_name='campaign',
        ),
        migrations.RemoveField(
            model_name='donationcampaign',
            name='current_fund',
        ),
        migrations.RemoveField(
            model_name='donationcampaign',
            name='expected_fund',
        ),
        migrations.AddField(
            model_name='approval',
            name='is_final',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='CampaignLocation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('expected_fund', models.IntegerField()),
                ('current_fund', models.IntegerField(default=0)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='locations', to='CharityApp.donationcampaign')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campaigns', to='CharityApp.location')),
            ],
            options={
                'unique_together': {('campaign', 'location')},
            },
        ),
        migrations.AlterField(
            model_name='donation',
            name='campaign',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='donated', to='CharityApp.campaignlocation'),
        ),
        migrations.CreateModel(
            name='DonationReportPicture',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('path', models.CharField(max_length=20)),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pictures', to='CharityApp.donationreport')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='statinfo',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stat_history', to='CharityApp.location'),
        ),
        migrations.CreateModel(
            name='Storage',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('address', models.CharField(max_length=100)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='storage', to='CharityApp.location')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('amount', models.IntegerField()),
                ('wareHouse', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock', to='CharityApp.storage')),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stocks', to='CharityApp.supplytype')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='Comment',
        ),
        migrations.DeleteModel(
            name='Reply',
        ),
        migrations.DeleteModel(
            name='LocationStatus',
        ),
    ]
