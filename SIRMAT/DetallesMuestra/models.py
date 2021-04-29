from django.db import models
from Especies.models import Especie 
from Fotografias.models import Fotografia
from Muestra.models import Muestra 
from Usuario.models import Usuario
# Create your models here.
class DetallesMuestra(models.Model):
    idtDetallesMuestra=models.BigAutoField(primary_key=True)
    idEspecie = models.ForeignKey(Especie, on_delete=models.CASCADE)
    horaFecha=models.DateTimeField()
    observaciones =models.CharField(max_length=45)
    cantidad =models.IntegerField()
    idfotografias = models.ForeignKey(Fotografia, on_delete=models.CASCADE)
    idMuestra = models.ForeignKey(Muestra, on_delete=models.CASCADE)
    idUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'tDetallesMuestra'
        verbose_name='Detalles Muestra'
        verbose_name_plural='Detalles Muestras'

    def __str__(self):
        return   f"id:{self.idtDetallesMuestra} observaciones:{self.observaciones}"