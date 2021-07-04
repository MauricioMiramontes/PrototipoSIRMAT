from django.db import models

# Create your models here.


class Estereoscopio(models.Model):
    idcEstereoscopios = models.BigAutoField(
        primary_key=True, 
        help_text="Numero de identificacion del registro")

    marca = models.CharField(
        max_length=45, 
        help_text="Marca del fabricante del estereoscopio")

    caracteristicas = models.CharField(
        max_length=45, 
        help_text="Carateristicas o espesificaciones del estereoscopio")

    is_active = models.BooleanField(
        default=True, 
        help_text="Define si el registro esta o no dado de baja en el sistema")

    class Meta:
        db_table = 'cEstereoscopios'
        verbose_name = 'Estereoscopio'
        verbose_name_plural = 'Estereoscopios'

    def __str__(self):
        return str(self.idcEstereoscopios)
