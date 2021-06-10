from django.db import models
from Especies.models import Especie
from DetallesMuestra.models import DetallesMuestra
from Usuario.models import User

# Create your models here.


class Etiquetado(models.Model):
    idEtiquetado = models.BigAutoField(primary_key=True)
    id_usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    hora_fecha = models.DateTimeField()
    poligono = models.CharField(max_length=45)
    idDetallesMuestra = models.ForeignKey(
        DetallesMuestra, on_delete=models.CASCADE)
    id_especie = models.ForeignKey(Especie, on_delete=models.CASCADE)

    class Meta:
        db_table = 'etiquetado'
        verbose_name = 'Etiquetado'
        verbose_name_plural = 'Etiquetados'

    def __str__(self):
        return str(self.idEtiquetado)
