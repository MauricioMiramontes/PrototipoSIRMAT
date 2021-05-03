from django import forms
from .models import Camara

#Creacion del formulario a partir del modelo de Trampas
class CamaraForm(forms.ModelForm):
    class Meta:
        model = Camara #modelo a utilizar
        fields = '__all__'  #Para utilizar campos especificos :  ('nombre','coordenadas',...)