from django.http.response import JsonResponse
from .models import DetallesMuestra
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Importamos el serializador del modelo Especie
from .serializers import DetallesMuestraSerializer

# To do: Agregar archivo para interaccion con label studio que agregue descripcion al proyecto de la muestra

# importar clase Authentication (LMRG)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class DetallesMuestraAPI(APIView):
    # Vistas de la API para la tabla 'Detalles Muestra' de la base de datos

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idtDetallesMuestra que se desea ver, ejmpl: DetallesMuestra/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

            # Se verifica que exista el parametro con llave 'id'
            try: request.query_params['id']
            except:
                return Response({
                    "message": "Solo se acepta un parametro con llave 'id'"
                },  status=status.HTTP_400_BAD_REQUEST)

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try:
                detallesmuestra = DetallesMuestra.objects.get(
                    idtDetallesMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'estereoscopio'
            serializer = DetallesMuestraSerializer(detallesmuestra)
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            detallesmuestras = DetallesMuestra.objects.all()
            serializer = DetallesMuestraSerializer(detallesmuestras, many=True)

        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    # ------------------------------------------------------------------------------------
