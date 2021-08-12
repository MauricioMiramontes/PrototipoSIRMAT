from django.http.response import JsonResponse
from .models import Fotografia
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
import os
from pathlib import Path
# Importamos el serializador del modelo Fotografia
from .serializers import FotografiaSerializer
from .Label_Studio_db import eliminar_foto_ls, agregar_foto_ls

# importar clase Authentication (LMRG)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# Importaciones de documentacion Swagger
from drf_yasg.utils import swagger_auto_schema
from .docs import * 

DIR = Path(__file__).resolve().parent.parent

class FotografiaAPI(APIView):
    # Vistas de la API para la tabla 'Fotografia' de la base de datos

    # Pedimos autenticacion por Token (LMRG)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=docs_get.params, responses=docs_get.respuestas)
    def get(self, request, format=JsonResponse):
        # Logica para una peticion tipo GET
        # Si se quiere ver un solo objeto es necesario proporcionar un parametro llamado 'id' con el valor
        # del idFotografiafia que se desea ver, ejmpl: fotografias/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion HTTP

            # Se verifica cual de los parametros fue el recibido
            try: 
                id = request.query_params['id']
            except:
                id = False
            try: 
                muestra = request.query_params['muestra']
            except:
                muestra = False

            # Si se recibieron parametro pero ninguno es 'id' o 'muestra' se manda un error
            if not id and not muestra:
                 return Response({
                    "message": "Solo se acepta un parametro con llave 'id' o 'muestra'"
                },  status=status.HTTP_400_BAD_REQUEST)
            
            # Si se recibieron ambos al mismo tiempo se manda un error
            if id and muestra:
                return Response({
                    "message": "'id' y 'muestra' son mutuamente excluyentes"
                },  status=status.HTTP_400_BAD_REQUEST)

            # Si se recibio el parametro 'id'
            if id:
                # Si intentamos encontrar el elemento que coincida con el parametro 'id'
                try:
                    fotografia = Fotografia.objects.get(
                        idFotografias=request.query_params['id'])
                # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
                except:
                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con ese id'
                    },  status=status.HTTP_404_NOT_FOUND)

                # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'Fotografia'
                serializer = FotografiaSerializer(fotografia)

            # Si se recibio parametro 'muestra'
            elif muestra:
                 # Intentamos encontrar los elementos que pertenezcan a la muestra

                fotografias = Fotografia.objects.filter(idMuestra=muestra)
                
                # Si el filter() regresa una lista vacia se manda un mensaje de error
                if not fotografias:
                    return Response({
                        'message': 'No se encontro ningun elemento que coincida con esa muestra'
                    },  status=status.HTTP_404_NOT_FOUND)

                serializer = FotografiaSerializer(fotografias, many=True)
        else:
            # Si no hay parameteros tomamos todos los objetos en la base de datos y los serializamos
            fotografias = Fotografia.objects.all()
            serializer = FotografiaSerializer(fotografias, many=True)

        # Si no se encuentran registros 
        if not serializer.data:
            # Si aun no hay registros mandamos una respuesta con el error y un mensaje con detalles
            return Response({
                'message': 'Aun no se tiene ningún registro en la base de datos'
            },  status=status.HTTP_204_NO_CONTENT)
        # Respondemos con los datos que se hayan guardado en el serializador 'serializer'
        return Response(serializer.data)

    # --------------------------------------------------------------------------------------------------------------

    parser_classes = [MultiPartParser]
    @swagger_auto_schema(responses = docs_post.respuestas, request_body=docs_put.body_valid)
    def post(self, request):
        # Logica para una peticion tipo POST

        # Se definen los permisos para peticiones tipo POST
        if request.user.is_superuser or request.user.is_staff:

            # Tomamos los datos que vengan en la peticion HTTP y los des-serializamos para que Python los pueda usar
            serializer = FotografiaSerializer(data=request.data)

            if serializer.is_valid():  # Si la peticion es valida
                serializer.save()  # Guardamos los datos del serializador en la base de datos y label studio
                fotografia_guardada = Fotografia.objects.latest('idFotografias')

                agregar_foto_ls(
                    fotografia_guardada.idFotografias,
                    str(fotografia_guardada.fileFoto).split("/")[-1],
                    request.user.id,
                    str(fotografia_guardada.idMuestra)
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
                        "error" : "El usuario no tiene permisos para realizar esta accion"
                    },  status=status.HTTP_403_FORBIDDEN)

    # ----------------------------------------------------------------------------------------------------------------

    @swagger_auto_schema(manual_parameters=[docs_put.params],responses=docs_put.respuestas, request_body=docs_put.body_valid)
    def put(self, request):
        # Logica para peticiones tipo PUT
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idFotografias que se desea actualizar
        # ejmpl: fotografias/?id=1

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
                fotografia = Fotografia.objects.get(
                    idFotografias=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Se definen los permisos para peticiones tipo PUT 
            if request.user.is_superuser or request.user.is_staff:
                if not request.user.is_superuser and request.user.id != fotografia.idUsuario.id:
                    return Response({
                            "error" : "Solo puede realizar esta operación el dueño este registro"
                        },  status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                            "error" : "El usuario no tiene permisos para realizar esta accion"
                        },  status=status.HTTP_403_FORBIDDEN)

            # Si el try no falla entonces creamos el serializador utilizando el objeto guardado en 'muestra'
            serializer = FotografiaSerializer(fotografia, data=request.data)

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
        # Es necesario proporcionar un parametro llamado 'id' con el valor del idFotografias que se desea eliminar
        # ejmpl: fotografias/?id=1

        if request.query_params:  # Revisamos si hay o no parametros dentro de la peticion 
            
            # Se verifica que exista el parametro con llave 'id'
            try:
                request.query_params['id']
            except:
                return Response({
                    "message": "Solo se acepta un parametro con llave 'id'"
                },  status=status.HTTP_400_BAD_REQUEST)

            # Si los hay intentamos encontrar el elemento que coincida con el parametro 'id' y lo eliminamos
            try:
                fotografia = Fotografia.objects.get(
                    idFotografias=request.query_params['id'])
            # Si el try falla mandamos una respuesta con el error y un mensaje con detalles
            except:
                return Response({
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                },  status=status.HTTP_404_NOT_FOUND)

            # Se definen los permisos para peticiones tipo PUT 
            if request.user.is_superuser or request.user.is_staff:
                if not request.user.is_superuser and request.user.id != fotografia.idUsuario.id:
                    return Response({
                            "error" : "Solo puede realizar esta operación el dueño este registro"
                        },  status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                            "error" : "El usuario no tiene permisos para realizar esta accion"
                        },  status=status.HTTP_403_FORBIDDEN)

            # Si el try no falla entonces eliminamos la muestra de label studio
            eliminar_foto_ls(fotografia.idFotografias)

            # Elimina el archivo de la fotografia de la carpeta Label_Studio_Data
            os.remove(str(DIR) + "/" + str(fotografia.fileFoto))

            # Eliminamos el registro de la fotografia de la base de datos
            fotografia.delete()

            return Response({
                'message': 'Fotografia eliminada correctamente'
            }, status=status.HTTP_200_OK)

        else:  # El parametro es requerido por lo que si no se proporciona se respondera un error
            return Response({
                'message': 'DELETE debe proporcionar parametro "id"'
            },  status=status.HTTP_400_BAD_REQUEST)
