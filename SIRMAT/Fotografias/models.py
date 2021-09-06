from django.db import models
from django.db.models.fields.files import ImageField
from Camaras.models import Camara
from Muestra.models import Muestra
from django.conf import settings
# Create your models here.


class Fotografia(models.Model):
    idFotografias = models.BigAutoField(
        primary_key=True,
        help_text="Numero de identificacion del registro")

    horaFecha = models.DateTimeField(
        auto_now_add=True,
        help_text="Hora y fecha en la que se tomo la fotografia")

    zoom = models.CharField(
        max_length=45,
        help_text="Cantidad de zoom de la fotografia")

    resolucion = models.CharField(
        max_length=45,
        help_text="Resolucion de la fotografia")

    etiquetado = models.JSONField(
        help_text="Estado de Etiquetado de la fotografia ('Pendiente', 'Finalizado', 'Pendiente de calificar')",
        default = {
            "Estado" : "Pendiente",
            "Observaciones" : ""
        }
    )
        
    idCamara = models.ForeignKey(
        Camara,
        on_delete=models.CASCADE,
        help_text="Camara con la que se tomo la fotografia")

    idMuestra = models.ForeignKey(
        Muestra,
        on_delete=models.CASCADE,
        help_text='Muestra a la que pertenece la fotografia')

    fileFoto = models.ImageField(
        upload_to=settings.LS_FILES_DIR + 'media/upload/',
        max_length=100,
        help_text='Archivo de la fotografia que se guardara en el sistema y label studio')

    is_active = models.BooleanField(
        default=True,
        help_text="Define si el registro esta o no dado de baja en el sistema")

    class Meta:
        db_table = 'fotografias'
        verbose_name = 'Fotografia'
        verbose_name_plural = 'Fotografias'

    def __str__(self):
        return str(self.idFotografias)
