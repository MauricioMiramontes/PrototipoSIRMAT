from django.db import models
from Trampas.models import Trampas

# Create your models here.

class Muestra(models.Model):
    idtMuestra=models.BigAutoField(primary_key=True)
    horaFechainicio=models.DateTimeField(auto_now_add=True)
    horaFechaFin=models.DateTimeField(auto_now_add=True)
    idTrampas = models.ForeignKey(Trampas, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'tMuestras'
        verbose_name='tMuestra'
        verbose_name_plural='tMuestras'

    def __str__(self):
        return   f"id:{self.idtMuestra}"