# Generated by Django 3.2.2 on 2021-06-11 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DetallesMuestra', '0003_auto_20210526_2101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detallesmuestra',
            name='horaFecha',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
