from django.db import models

# Create your models here.

class Trampas(models.Model):
    idcTrampas=models.BigAutoField(primary_key=True)
    nombre=models.CharField(max_length=45)
    direccion=models.CharField(max_length=45)
    coordenadas=models.CharField(max_length=45)

    class Meta:
        db_table = 'cTrampas'
        verbose_name='Trampa'
        verbose_name_plural='Trampas'

    def __str__(self):
        return str(self.idcTrampas)