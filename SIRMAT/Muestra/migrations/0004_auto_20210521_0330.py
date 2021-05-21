# Generated by Django 3.1.4 on 2021-05-21 03:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Trampas', '0001_initial'),
        ('Muestra', '0003_auto_20210429_1836'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muestra',
            name='horaFechaFin',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='muestra',
            name='horaFechainicio',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='muestra',
            name='idTrampas',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='Trampas.trampas'),
        ),
    ]
