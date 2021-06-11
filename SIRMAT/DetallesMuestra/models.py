from django.db import models
from Especies.models import Especie
from Muestra.models import Muestra

# Create your models here.


class DetallesMuestra(models.Model):
    idtDetallesMuestra = models.BigAutoField(primary_key=True)
    idEspecie = models.ForeignKey(Especie, on_delete=models.CASCADE)
    horaFecha = models.DateTimeField()
    observaciones = models.CharField(max_length=45)
    cantidad = models.IntegerField()
    idMuestra = models.ForeignKey(Muestra, on_delete=models.CASCADE)


    class Meta:
        db_table = 'tDetallesMuestra'
        verbose_name = 'Detalles Muestra'
        verbose_name_plural = 'Detalles Muestras'

    def __str__(self):
        return str(self.idtDetallesMuestra)
