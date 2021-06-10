from .models import User
from rest_framework import serializers

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
        # La contraseña solo se puede escribir, para que no se envie en una peticion GET
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    # Esta funcion se llama cuando save() del serializador va a crear un nuevo registro en la BD (POST)
    def create(self, validated_data):
        # Se guarda el nuevo usuario con los 5 campos obligatorios
        user = User( # Los 5 campos obligatorios que deben estar en una peticion de POST 
            email = validated_data['email'],
            username = validated_data['username'],
            telefono = validated_data['telefono'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    # Esta funcion se llama cuando save() del serializador va a actualizar un nuevo registro en la BD (PUT)
    def update(self, instance, validated_data):
        
        
        instance.email = validated_data['email']
        instance.username = validated_data['username']
        instance.telefono = validated_data['telefono']
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.set_password(validated_data['password'])
        instance.save()
        return instance