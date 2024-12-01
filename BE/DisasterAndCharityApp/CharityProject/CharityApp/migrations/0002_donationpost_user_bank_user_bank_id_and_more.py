# Generated by Django 5.1.3 on 2024-12-02 17:00

import cloudinary.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CharityApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DonationPost',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('content', models.TextField()),
                ('civilian', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='CharityApp.civilian')),
                ('supply_type', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='CharityApp.supplytype')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='user',
            name='bank',
            field=models.CharField(default='Vietcombank', max_length=100),
        ),
        migrations.AddField(
            model_name='user',
            name='bank_id',
            field=models.CharField(default='12345678910', max_length=20),
        ),
        migrations.CreateModel(
            name='DonationPostPicture',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('picture', cloudinary.models.CloudinaryField(default=None, max_length=255, null=True, verbose_name='image')),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pictures', to='CharityApp.donationpost')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DonationPostApproval',
            fields=[
                ('report', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='CharityApp.donationpost')),
                ('priority', models.IntegerField(default=1)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='confirmed_post', to='CharityApp.admin')),
            ],
        ),
    ]
