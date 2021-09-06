from django.http.response import JsonResponse
from .models import Muestra
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Importamos el serializador del modelo Muestra
from .serializers import MuestraSerializer
from .Label_Studio_db import editar_muestra_ls, eliminar_muestra_ls, agregar_muestra_ls

# importar clase Authentication (LMRG)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# Importaciones de documentacion Swagger
from drf_yasg.utils import swagger_auto_schema
from .docs import *


class MuestraAPI(APIView):
    # Vistas de la API para la tabla 'muestra' de la base de datos

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=[docs_get.params], responses=docs_get.respuestas)
    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idtMuestra que se desea ver, ejmpl: muestras/?id=1

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
                muestra = Muestra.objects.get(
                    idtMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'muestra'
            serializer = MuestraSerializer(muestra)
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            muestras = Muestra.objects.all()
            serializer = MuestraSerializer(muestras, many=True)

        if not serializer.data:
            # Si aun no hay registros mandamos una respuesta con el error y un mensaje con detalles
            return Response({
                'message': 'Aun no se tiene ningún registro en la base de datos'
            },  status=status.HTTP_204_NO_CONTENT)
        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    # --------------------------------------------------------------------------------------------------------------

    @swagger_auto_schema(responses=docs_post.respuestas, request_body=docs_post.body_valid)
    def post(self, request):
        # Logica para una peticion tipo POST

        # Se definen los permisos para peticiones tipo POST
        if request.user.is_superuser or request.user.is_staff:
            # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
            serializer = MuestraSerializer(data=request.data)

            if serializer.is_valid():  # Si la peticion es valida
                serializer.save()  # Guardamos los datos del serializador en la base de datos

                # Tomamos los datos de la muestra nueva
                muestra_guardada = Muestra.objects.latest('idtMuestra')
                agregar_muestra_ls(  # Creamos un nuevo proyecto en label studio con los datos de la muestra nueva
                    muestra_guardada.idtMuestra,
                    str(muestra_guardada.idUsuario),
                    muestra_guardada.NombreMuestra
                )

                # Y respondemos con los datos del nuevo objeto creado
                return Response(serializer.data)
            else:  # Si la peticion no es valida respondemos con un error y un mensaje con los detalles del error
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response({
                "error": "El usuario no tiene permisos para realizar esta accion"
            },  status=status.HTTP_403_FORBIDDEN)

    # ----------------------------------------------------------------------------------------------------------------

    @swagger_auto_schema(manual_parameters=[docs_put.params], responses=docs_put.respuestas, request_body=docs_put.body_valid)
    def put(self, request):
        # Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idtMuestra que se desea actualizar
        # ejmpl: muestras/?id=1

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
                muestra = Muestra.objects.get(
                    idtMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Se definen los permisos para peticiones tipo PUT
            if request.user.is_superuser or request.user.is_staff:
                if not request.user.is_superuser and request.user.id != muestra.idUsuario.id:
                    return Response({
                        "error": "Solo puede realizar esta operación el dueño este registro"
                    },  status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    "error": "El usuario no tiene permisos para realizar esta accion"
                },  status=status.HTTP_403_FORBIDDEN)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'muestra'
            serializer = MuestraSerializer(muestra, data=request.data)

            if serializer.is_valid():  # Si la peticion es valida
                serializer.save()  # Actualizamos el serializador en la base de datos
                # Pasamos los datos actualizados de la muestra a label_studio
                editar_muestra_ls(muestra.idtMuestra, muestra.NombreMuestra)
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

    @swagger_auto_schema(manual_parameters=[docs_delete.params], responses=docs_delete.respuestas)
    def delete(self, request):
        # Logica para una peticion DELETE
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idtMuestra que se desea eliminar
        # ejmpl: muestras/?id=1

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
                muestra = Muestra.objects.get(
                    idtMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Se definen los permisos para peticiones tipo PUT
            if request.user.is_superuser or request.user.is_staff:
                if not request.user.is_superuser and request.user.id != muestra.idUsuario.id:
                    return Response({
                        "error": "Solo puede realizar esta operación el dueño este registro"
                    },  status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    "error": "El usuario no tiene permisos para realizar esta accion"
                },  status=status.HTTP_403_FORBIDDEN)

            # Si el try no falla entonces eliminamos la muestra de label studio
            eliminar_muestra_ls(muestra.idtMuestra)
            # cambiamos el registro is_active de la BD

            muestra.is_active = False  # cambiamos is_active a False
            muestra.save(update_fields=['is_active'])  # guardamos los cambios
            # Enviamos mensaje de éxito

            return Response({
                'message': 'Muestra eliminada correctamente'
            }, status=status.HTTP_200_OK)

        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                'message': 'DELETE debe proporcionar parametro "id"'
            },  status=status.HTTP_400_BAD_REQUEST)


class EtiquetadoFinalizado(APIView):

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # Logica para una peticion PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idtMuestra que se desea eliminar
        # ejmpl: muestras/?id=1

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
                muestra = Muestra.objects.get(
                    idtMuestra=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Se definen los permisos para peticiones tipo PUT
            if request.user.is_superuser or request.user.is_staff:
                pass
            else:
                return Response({
                    "error": "El usuario no tiene permisos para realizar esta accion"
                },  status=status.HTTP_403_FORBIDDEN)

            # cambiamos el registro is_active de la BD

            muestra.etiquetado = "Finalizado"  # cambiamos is_active a False
            muestra.save(update_fields=['etiquetado'])  # guardamos los cambios
            # Enviamos mensaje de éxito

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'muestra'
            serializer = MuestraSerializer(muestra)

            return Response(serializer.data)

        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                'message': 'PUT debe proporcionar parametro "id"'
            },  status=status.HTTP_400_BAD_REQUEST)
