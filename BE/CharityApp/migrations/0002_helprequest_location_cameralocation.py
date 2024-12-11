# Generated by Django 5.1.3 on 2024-12-10 14:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CharityApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='helprequest',
            name='location',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='help_request', to='CharityApp.location'),
        ),
        migrations.CreateModel(
            name='CameraLocation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('camera_code', models.CharField(max_length=20)),
                ('latitude', models.DecimalField(decimal_places=6, default=0.0, max_digits=9, null=True)),
                ('longitude', models.DecimalField(decimal_places=6, default=0.0, max_digits=9, null=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cameras', to='CharityApp.location')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]