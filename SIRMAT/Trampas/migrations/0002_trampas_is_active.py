# Generated by Django 3.1.7 on 2021-06-11 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Trampas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='trampas',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
