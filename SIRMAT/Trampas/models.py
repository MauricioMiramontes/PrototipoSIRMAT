from django.db import models

# Create your models here.


class Trampas(models.Model):
    idcTrampas = models.BigAutoField(
        primary_key=True, 
        help_text='Numero de identificacion del registro')

    nombre = models.CharField(
        max_length=45, 
        help_text='Nombre de la trampa')

    direccion = models.CharField(
        max_length=45, 
        help_text='Direccion en la que se encuentra la trampa')

    coordenadas = models.CharField(
        max_length=45, 
        help_text='Coordenadas en las que se encuentra la trampa')

    is_active = models.BooleanField(
        default=True, 
        help_text='Define si el registro esta o no dado de baja en el sistema')


    class Meta:
        db_table = 'cTrampas'
        verbose_name = 'Trampa'
        verbose_name_plural = 'Trampas'

    def __str__(self):
        return str(self.idcTrampas)
