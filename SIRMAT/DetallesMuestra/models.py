from django.db import models
from Especies.models import Especie
from Muestra.models import Muestra

# Create your models here.


class DetallesMuestra(models.Model):
    idtDetallesMuestra = models.BigAutoField(
        primary_key=True, help_text='Numero de identificacion del registro')

    idEspecie = models.ForeignKey(
        Especie, on_delete=models.CASCADE, help_text='Especies encontradas en la muestra')
    
    horaFecha = models.DateTimeField(
        auto_now_add=True, help_text='Hora en la que se registro la Muestra')

    observaciones = models.CharField(
        max_length=45, help_text='Observaciones del empleado sobre la muestra')
    
    cantidad = models.IntegerField(
        help_text='Cantidad de insectos detectados en la muestra')
    
    idMuestra = models.OneToOneField(
        Muestra, on_delete=models.CASCADE, help_text='Muestra a la que pertenecen estos detalles')
    
    is_active = models.BooleanField(
        default=True, help_text='Define si el registro esta o no dado de baja en el sistema')

    class Meta:
        db_table = 'tDetallesMuestra'
        verbose_name = 'Detalles Muestra'
        verbose_name_plural = 'Detalles Muestras'

    def __str__(self):
        return str(self.idtDetallesMuestra)
