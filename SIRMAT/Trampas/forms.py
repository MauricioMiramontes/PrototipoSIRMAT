from django import forms
from .models import Trampas

#Creacion del formulario a partir del modelo de Trampas
class TrampaForm(forms.ModelForm):
    class Meta:
        model = Trampas #modelo a utilizar
        fields = '__all__'  #Para utilizar campos especificos :  ('nombre','coordenadas',...)