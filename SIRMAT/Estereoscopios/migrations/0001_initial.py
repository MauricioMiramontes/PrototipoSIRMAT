# Generated by Django 3.1.4 on 2021-05-25 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Estereoscopio',
            fields=[
                ('idcEstereoscopios', models.BigAutoField(primary_key=True, serialize=False)),
                ('marca', models.CharField(max_length=45)),
                ('caracteristicas', models.CharField(max_length=45)),
            ],
            options={
                'verbose_name': 'Estereoscopio',
                'verbose_name_plural': 'Estereoscopios',
                'db_table': 'cEstereoscopios',
            },
        ),
    ]
