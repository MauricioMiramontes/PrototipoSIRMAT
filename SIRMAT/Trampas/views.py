from django.http.response import JsonResponse
from .models import Trampas
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Importamos el serializador del modelo Especie
from .serializers import TrampaSerializer

# impportar clase Authentication
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# Importaciones de documentacion Swagger
from drf_yasg.utils import swagger_auto_schema
from .docs import * 

class TrampasAPI(APIView):
    # Vistas de la API para la tabla 'Trampas' de la base de datos
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=[docs_get.params], responses=docs_get.respuestas)
    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idcTrampas que se desea ver, ejmpl: trampas/?id=1

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
                trampa = Trampas.objects.get(
                    idcTrampas=request.query_params['id'])
        # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

        # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'trampa'
            serializer = TrampaSerializer(trampa)
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            trampas = Trampas.objects.all()
            serializer = TrampaSerializer(trampas, many=True)

        if not serializer.data:
            # Si aun no hay registros mandamos una respuesta con el error y un mensaje con detalles
            return Response({
                'message': 'Aun no se tiene ning??n registro en la base de datos'
            },  status=status.HTTP_204_NO_CONTENT)
        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    # ------------------------------------------------------------------------------------

    @swagger_auto_schema(responses = docs_post.respuestas, request_body=docs_post.body_valid)
    def post(self, request):
        # Logica para una peticion tipo POST

        # Solo se puede hacer si el token es de un superusuario (LMRG)
        # Se revisa si el usuario no es adminitrador
        if not request.user.is_superuser:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)
        else:

            # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
            serializer = TrampaSerializer(data=request.data)
            # Comprobamos
            if serializer.is_valid():  # Si la peticion es valida
                serializer.save()  # Guardamos los datos del serializador en la base de datos
            # Y respondemos con los datos del nuevo objeto creado
                return Response(serializer.data)
            else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

    # ----------------------------------------------------------------------------------------------------------------
    
    @swagger_auto_schema(manual_parameters=[docs_put.params],responses=docs_put.respuestas, request_body=docs_put.body_valid)
    def put(self, request):
        # Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcTrampas que se desea actualizar
        # ejmpl: trampas/?id=1

        # Solo se puede hacer si el token es de un superusuario (LMRG)
        # Revisamos si el usuario no es un superusuario
        if not request.user.is_superuser:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)
        else:

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
                    trampa = Trampas.objects.get(
                        idcTrampas=request.query_params['id'])
                # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                except:
                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con ese id'
                    },  status=status.HTTP_404_NOT_FOUND)

                # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'trampa'
                serializer = TrampaSerializer(trampa, data=request.data)

                if serializer.is_valid():  # Si la peticion es valida
                    serializer.save()  # Actualizamos el serializador en la base de datos
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

    # --------------------------------------------------------------------------------------------------------------

    @swagger_auto_schema(manual_parameters=[docs_delete.params],responses=docs_delete.respuestas)
    def delete(self, request):
        # Logica para una peticion DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idcTrampas que se desea eliminar
        # ejmpl: trampas/?id=1
        if not request.user.is_superuser:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)
        else:
            if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

                # Se verifica que exista el parametro con llave 'id'
                try:
                    request.query_params['id']
                except:
                    return Response({
                        "message": "Solo se acepta un parametro con llave 'id'"
                    },  status=status.HTTP_400_BAD_REQUEST)

                # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id' y lo eliminamos
                try:
                    trampa = Trampas.objects.get(
                        idcTrampas=request.query_params['id'])
                # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                except:
                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con ese id'
                    },  status=status.HTTP_404_NOT_FOUND)

                # Si el try no falla entonces cambiamos el registro is_active de la BD

                trampa.is_active = False  # cambiamos is_active a False
                # guardamos los cambios
                trampa.save(update_fields=['is_active'])
                # Enviamos mensaje de ??xito
                return Response({
                    'message': 'Trampa eliminada correctamente'
                }, status=status.HTTP_200_OK)

            else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
                return Response({
                    'message': 'DELETE debe proporcionar parametro "id"'
                },  status=status.HTTP_400_BAD_REQUEST)
