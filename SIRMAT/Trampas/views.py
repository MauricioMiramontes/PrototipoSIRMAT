from django.shortcuts import render
from Trampas.models import Trampas
# Create your views here.


def trampas(request):

    trampas=Trampas.objects.all()
    return render(request, 'Trampas/trampas.html',{'trampas':trampas})