from django.shortcuts import render, redirect
from Trampas.models import Trampas
from Trampas.forms import TrampaForm
# Create your views here.


def trampas(request):
    trampas=Trampas.objects.all() #llamar a todos los objetos de mi modelo
    if request.method == 'GET':
        form= TrampaForm()
    else:
        form= TrampaForm(request.POST)
        print(form)
        if form.is_valid():
            form.save()
            return redirect('Trampa')
    return render(request, 'Trampas/trampas.html',{'trampas':trampas,'form':form}) #contexto 'clave':valor


    
