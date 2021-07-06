# Generated by Django 3.1.4 on 2021-07-04 15:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Camaras', '0003_auto_20210704_1030'),
        ('Muestra', '0007_auto_20210704_1030'),
        ('Fotografias', '0003_fotografia_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fotografia',
            name='fileFoto',
            field=models.ImageField(help_text='Archivo de la fotografia que se guardara en el sistema y label studio', upload_to='Label_Studio_Data/media/upload/'),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='horaFecha',
            field=models.DateTimeField(auto_now_add=True, help_text='Hora y fecha en la que se tomo la fotografia'),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='idCamara',
            field=models.ForeignKey(help_text='Camara con la que se tomo la fotografia', on_delete=django.db.models.deletion.CASCADE, to='Camaras.camara'),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='idFotografias',
            field=models.BigAutoField(help_text='Numero de identificacion del registro', primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='idMuestra',
            field=models.ForeignKey(help_text='Muestra a la que pertenece la fotografia', on_delete=django.db.models.deletion.CASCADE, to='Muestra.muestra'),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='is_active',
            field=models.BooleanField(default=True, help_text='Define si el registro esta o no dado de baja en el sistema'),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='resolucion',
            field=models.CharField(help_text='Resolucion de la fotografia', max_length=45),
        ),
        migrations.AlterField(
            model_name='fotografia',
            name='zoom',
            field=models.CharField(help_text='Cantidad de zoom de la fotografia', max_length=45),
        ),
    ]
