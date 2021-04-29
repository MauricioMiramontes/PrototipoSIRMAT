from django.db import models

# Create your models here.

class Estereoscopio(models.Model):
    idcEstereoscopios=models.BigAutoField(primary_key=True)
    marca=models.CharField(max_length=45)
    caracteristicas=models.CharField(max_length=45)
    
    class Meta:
        db_table = 'cEstereoscopios'
        verbose_name='Estereoscopio'
        verbose_name_plural='Estereoscopios'

    def __str__(self):
        return  f"id:{self.idcEstereoscopios}, marca:{self.marca}"