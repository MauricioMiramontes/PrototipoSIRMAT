from django.db import models
from Camaras.models import Camara
from django.conf import settings
# Create your models here.
class Fotografia(models.Model):
    idFotografias=models.BigAutoField(primary_key=True)
    horaFecha=models.DateTimeField()
    zoom =models.CharField(max_length=45)
    resolucion =models.CharField(max_length=45)
    idCamara = models.ForeignKey(Camara, on_delete=models.CASCADE)
    fileFoto = models.FileField(upload_to= settings.LS_FILES_DIR + 'media/upload/', max_length=100)
    
    class Meta:
        db_table = 'fotografias'
        verbose_name='Fotografia'
        verbose_name_plural='Fotografias'

    def __str__(self):
        return   f"id:{self.idFotografias} zoom:{self.zoom}"