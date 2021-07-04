from django.db import models
from Estereoscopios.models import Estereoscopio
# Create your models here.


class Camara(models.Model):
    idcCamaras = models.BigAutoField(
        primary_key=True, help_text='Numero de identificacion del registro')

    marca = models.CharField(
        max_length=45, help_text='Marca del fabricante de la Camara')

    foco = models.CharField(max_length=45, help_text='Foco de la camara')

    resolucion = models.CharField(
        max_length=45, help_text='Resolucion maxima de la Camara')

    idEstereoscopios = models.ForeignKey(
        Estereoscopio, on_delete=models.CASCADE, help_text='Estereoscopio al que pertenece la Camara')
    
    is_active = models.BooleanField(
        default=True, help_text='Define si el registro esta o no dado de baja en el sistema, default: True')

    class Meta:
        db_table = 'cCamaras'
        verbose_name = 'Camara'
        verbose_name_plural = 'Camaras'

    def __str__(self):
        return str(self.idcCamaras)
