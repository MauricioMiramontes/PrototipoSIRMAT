from django.db import models
from Trampas.models import Trampas
from Usuario.models import User

# Create your models here.


class Muestra(models.Model):
    idtMuestra = models.BigAutoField(
        primary_key=True, 
        help_text='Numero de identificacion del registro')

    horaFechainicio = models.DateTimeField(
        auto_now_add=True)

    horaFechaFin = models.DateTimeField(
        auto_now_add=True)
        
    idTrampas = models.ForeignKey(
        Trampas, 
        on_delete=models.CASCADE, 
        help_text='Trampa a la que pertenece la muestra')

    idUsuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        help_text='Usuario que registro la nueva muestra')

    NombreMuestra = models.CharField(
        max_length=50, 
        help_text='Nombre de identificacion de la muestra')

    is_active = models.BooleanField(
        default=True, 
        help_text='Define si el registro esta o no dado de baja en el sistema')

    
    etiquetado = models.CharField(
        max_length=45,
        default="Pendiente",
        help_text='Define el progreso de las fotografias que pertenecen a la muestra')


    

    class Meta:
        db_table = 'tMuestras'
        verbose_name = 'tMuestra'
        verbose_name_plural = 'tMuestras'

    def __str__(self):
        return str(self.idtMuestra)
