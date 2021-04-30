from django import forms
from .models import Trampas

class TrampaForm(forms.ModelForm):
    class Meta:
        model = Trampas
        fields = '__all__'