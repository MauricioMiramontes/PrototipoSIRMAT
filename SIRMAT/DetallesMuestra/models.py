from django.db import models
from Especies.models import Especie
from Muestra.models import Muestra

# Create your models here.


class DetallesMuestra(models.Model):
    idtDetallesMuestra = models.BigAutoField(
        primary_key=True, help_text='Numero de identificacion del registro')

    horaFecha = models.DateTimeField(
        auto_now_add=True, help_text='Hora en la que se registro la Muestra')

    observaciones = models.CharField(
        max_length=45, help_text='Observaciones del empleado sobre la muestra')
    
    idMuestra = models.OneToOneField(
        Muestra, on_delete=models.CASCADE, help_text='Muestra a la que pertenecen estos detalles')
    
    is_active = models.BooleanField(
        default=True, help_text='Define si el registro esta o no dado de baja en el sistema')

    Especies = models.JSONField(
        help_text='Indica cuales especies se observo en la muestra y sus cantidades',
        default = dict)

    class Meta:
        db_table = 'tDetallesMuestra'
        verbose_name = 'Detalles Muestra'
        verbose_name_plural = 'Detalles Muestras'

    def __str__(self):
        return str(self.idtDetallesMuestra)
