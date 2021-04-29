# Generated by Django 3.1.7 on 2021-04-29 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Trampas',
            fields=[
                ('idcTrampas', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=45)),
                ('direccion', models.CharField(max_length=45)),
                ('coordenadas', models.CharField(max_length=45)),
            ],
            options={
                'verbose_name': 'Trampa',
                'verbose_name_plural': 'Trampas',
                'db_table': 'cTrampas',
            },
        ),
    ]
