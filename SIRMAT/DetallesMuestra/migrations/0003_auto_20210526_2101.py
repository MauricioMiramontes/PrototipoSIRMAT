# Generated by Django 3.1.4 on 2021-05-27 02:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('DetallesMuestra', '0002_auto_20210525_1804'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='detallesmuestra',
            name='idUsuario',
        ),
        migrations.RemoveField(
            model_name='detallesmuestra',
            name='idfotografias',
        ),
    ]
