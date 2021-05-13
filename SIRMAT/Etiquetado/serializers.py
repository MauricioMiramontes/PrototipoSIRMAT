from .models import Etiquetado
from rest_framework import serializers

class EtiquetadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiquetado
        fields = '__all__'