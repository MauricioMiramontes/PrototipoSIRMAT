from django.db import models

# Create your models here.


class Especie(models.Model):
    idcEspecie = models.BigAutoField(primary_key=True)
    especie = models.CharField(max_length=45)

    class Meta:
        db_table = 'cEspecies'
        verbose_name = 'Especie'
        verbose_name_plural = 'Especies'

    def __str__(self):
        return str(self.idcEspecie)
