# Generated by Django 3.1.4 on 2021-05-11 00:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Fotografias', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='fotografia',
            name='fileFoto',
            field=models.FileField(default='foto', upload_to='Label_Studio_Data/media/upload/'),
            preserve_default=False,
        ),
    ]