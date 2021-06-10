from django.db import models
from Estereoscopios.models import Estereoscopio
# Create your models here.


class Camara(models.Model):
    idcCamaras = models.BigAutoField(primary_key=True)
    marca = models.CharField(max_length=45)
    foco = models.CharField(max_length=45)
    resolucion = models.CharField(max_length=45)
    idEstereoscopios = models.ForeignKey(
        Estereoscopio, on_delete=models.CASCADE)

    class Meta:
        db_table = 'cCamaras'
        verbose_name = 'Camara'
        verbose_name_plural = 'Camaras'

    def __str__(self):
        return str(self.idcCamaras)
