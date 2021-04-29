from django.db import models

# Create your models here.

class Usuario(models.Model):
    idcUsuario=models.BigAutoField(primary_key=True)
    usuario =models.CharField(max_length=45)
    password =models.CharField(max_length=45)
    horaFechaUltimoAcceso=models.DateTimeField()
    horaFechaCreacion=models.DateTimeField()
    tipoUsuario=models.IntegerField()
    email =models.CharField(max_length=45)
    activo = models.CharField(max_length=45)
    
    class Meta:
        db_table = 'cUsuario'
        verbose_name='Usuario'
        verbose_name_plural='Usuarios'

    def __str__(self):
        return   f"id:{self.idcUsuario} usuario:{self.usuario}"
