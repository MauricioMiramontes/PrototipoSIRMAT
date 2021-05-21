from .models import Estereoscopio
from rest_framework import serializers

class EstereoscopioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estereoscopio
        fields = '__all__'