from .models import DetallesMuestra
from rest_framework import serializers


class DetallesMuestraSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallesMuestra
        fields = '__all__'
