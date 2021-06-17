from .Label_Studio_db import agregar_detallesMuestra_ls, editar_detallesMuestra_ls
from django.http.response import JsonResponse
from .models import DetallesMuestra, Muestra
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
            try:
                request.query_params['id']
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

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'detallemuestra'
            serializer = DetallesMuestraSerializer(detallesmuestra)
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            detallesmuestras = DetallesMuestra.objects.all()
            serializer = DetallesMuestraSerializer(detallesmuestras, many=True)

        if not serializer.data:
            # Si aun no hay registros mandamos una respuesta con el error y un mensaje con detalles
            return Response({
                'message': 'Aun no se tiene ningún registro en la base de datos'
            },  status=status.HTTP_204_NO_CONTENT)
        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    # ------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------
    def post(self, request):
        # Logica para una peticion tipo POST

        # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
        serializer = DetallesMuestraSerializer(data=request.data)

        if serializer.is_valid():  # Si la peticion es valida
            serializer.save()  # Guardamos los datos del serializador en la base de datos
            # Tomamos los datos de los detalles de la muestra 
            detalles_guardados = DetallesMuestra.objects.latest('idtDetallesMuestra')
            agregar_detallesMuestra_ls(  # Creamos un nuevo proyecto en label studio con los datos de de los detalles de la muestra
                str(detalles_guardados.idMuestra),
                detalles_guardados.observaciones
            )

            # Y respondemos con los datos del nuevo objeto creado
            return Response(serializer.data)
        else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
            # ----------------------------------------------------------------------------------------------------------------

    def put(self, request):
        # Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idtDetallesMuestra que se desea actualizar
        # ejmpl: detallesmuestra/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP
            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id'
            try:
                detallemuestra = DetallesMuestra.objects.get(
                    idtDetallesMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'especie'
            serializer = DetallesMuestraSerializer(
                detallemuestra, data=request.data)

            if serializer.is_valid():  # Si la peticion es valida
                serializer.save()  # Actualizamos el serializador en la base de datos
                # Pasamos los datos actualizados de los detalles de la muestra a label_studio
                editar_detallesMuestra_ls(str(detallemuestra.idMuestra), detallemuestra.observaciones)
                # Y respondemos con los datos del nuevo objeto creado
                return Response(serializer.data)
            else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                'message': 'PUT debe proporcionar parametro "id"'
            },  status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Logica para una peticion DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idtDetallesMuestra que se desea eliminar
        # ejmpl: detallesmuestra/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id' y lo eliminamos
            try:
                detallemuestra = DetallesMuestra.objects.get(
                    idtDetallesMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No hay parametro con nombre "id" o No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces cambiamos el registro is_active de la BD

            detallemuestra.is_active = False  # cambiamos is_active a False
            # guardamos los cambios
            detallemuestra.save(update_fields=['is_active'])
            # Enviamos mensaje de éxito
            return Response({
                'message': 'Detalle Muestra eliminada correctamente'
            }, status=status.HTTP_200_OK)

        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                'message': 'DELETE debe proporcionar parametro "id"'
            },  status=status.HTTP_400_BAD_REQUEST)
