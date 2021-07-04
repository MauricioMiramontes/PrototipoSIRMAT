from django.db import models
from Especies.models import Especie
from DetallesMuestra.models import DetallesMuestra
from Usuario.models import User

# Create your models here.


class Etiquetado(models.Model):
    idEtiquetado = models.BigAutoField(
        primary_key=True,
        help_text="Numero de identificacion del registro")

    id_usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        help_text="Usuario al que pertenece el registro")

    hora_fecha = models.DateTimeField(
        help_text="Hora y fecha en la que se realizo el etiquetado")

    poligono = models.CharField(
        max_length=45, 
        help_text="Coordenadas que conforman el poligono")

    idDetallesMuestra = models.ForeignKey(
        DetallesMuestra, 
        on_delete=models.CASCADE, 
        help_text="Muestra a la que pertenece el etiquetado")

    id_especie = models.ForeignKey(
        Especie, 
        on_delete=models.CASCADE, 
        help_text="Especies observadas en la fotografia")

    is_active = models.BooleanField(
        default=True, 
        help_text="Define si el registro esta o no dado de baja en el sistema")

    class Meta:
        db_table = 'etiquetado'
        verbose_name = 'Etiquetado'
        verbose_name_plural = 'Etiquetados'

    def __str__(self):
        return str(self.idEtiquetado)
