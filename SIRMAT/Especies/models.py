from django.db import models

# Create your models here.


class Especie(models.Model):
    idcEspecie = models.BigAutoField(
        primary_key=True, 
        help_text="Numero de identificacion del registro")

    especie = models.CharField(
        max_length=100,
        help_text="Nombre de la especie")

    is_active = models.BooleanField(
        default=True, 
        help_text="Define si el registro esta o no dado de baja en el sistema")

    class Meta:
        db_table = 'cEspecies'
        verbose_name = 'Especie'
        verbose_name_plural = 'Especies'

    def __str__(self):
        return str(self.idcEspecie)
