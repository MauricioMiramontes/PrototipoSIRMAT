from drf_yasg import openapi
from .serializers import EtiquetadoSerializer


class docs_get():
    # Detalles de la documentacion para GET de Etiquetados

    # Los parametros que se aceptan en la operacion GET
    params = openapi.Parameter(
        'id', 
        openapi.IN_QUERY, 
        description="Parametro opcional en caso de que se requiera solo 1 registro", 
        type=openapi.TYPE_INTEGER
    )

    # Posibles respuestas para POST una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            schema = EtiquetadoSerializer(),
            description="Respuesta si la operacion GET fue exitosa",
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentra un registro con el id especificado",
            examples={
                "json": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                }
            }
        ),
        "400": openapi.Response(
            description="Respuesta si se proporciono un parametro distinto a 'id'",
            examples={
                "json": {
                    "message": "Solo se acepta un parametro con llave 'id'"
                }
            }
        ),
        "204": openapi.Response(
            description="Respuesta si no se tienen ningun registros en la base de datos",
            examples={
                "json": {
                'message': 'Aun no se tiene ningún registro en la base de datos'
                }
            }
        ),
    }

#----------------------------------------------------------------------------------------

class docs_post():
    # Detalles de la documentacion para POST de Etiquetados
    
    # Posibles respuestas para POST una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            schema = EtiquetadoSerializer(),
            description="Respuesta si la operacion POST fue exitosa"
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
        "400": openapi.Response(
            description="Posibles respuestas si la peticion no fue valida",
            examples={
                "json: Algun campo faltante":{
                    "hora_fecha": [
                        "This field is required."
                    ],
                    "poligono": [
                        "This field is required."
                    ],
                    "id_usuario": [
                        "This field is required."
                    ],
                    "idDetallesMuestra": [
                        "This field is required."
                    ],
                    "id_especie": [
                        "This field is required."
                    ]
                },  
                'json: Si no se encuentra un registro de DetallesMuestra con ese id':{
                    "idDetallesMuestra": [
                        "Invalid pk \"0\" - object does not exist."
                    ]
                }, 
                'json: Si no se encuentra una Especie con ese id':{
                    "id_especie": [
                        "Invalid pk \"0\" - object does not exist."
                    ]
                },
                'json: Si no se encuentra un Usuario con ese id':{
                    "id_usuario": [
                        "Invalid pk \"0\" - object does not exist."
                    ]
                },  
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = EtiquetadoSerializer

#----------------------------------------------------------------------------------------

class docs_put():
    # Detalles de la documentacion para PUT de Etiquetados


    # Los parametros que se aceptan en la operacion PUT
    params = openapi.Parameter(
        'id', 
        openapi.IN_QUERY, 
        description="Obligatorio. El 'id' del registro que se desea actualizar", 
        type=openapi.TYPE_INTEGER,
        required = True,
    )

    # Posibles respuestas para PUT una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            schema = EtiquetadoSerializer(),
            description="Respuesta si la operacion PUT fue exitosa"
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentra un registro con el id especificado",
            examples={
                "json": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                }
            }
        ),
        "400": openapi.Response(
            description="Respuesta si se proporciono un parametro distinto a 'id'",
            examples={
                "json: Si se proporciono un parametro distinto a 'id'": {
                    "message": "Solo se acepta un parametro con llave 'id'"
                },
                "json: Algun campo faltante":{
                    "hora_fecha": [
                        "This field is required."
                    ],
                    "poligono": [
                        "This field is required."
                    ],
                    "id_usuario": [
                        "This field is required."
                    ],
                    "idDetallesMuestra": [
                        "This field is required."
                    ],
                    "id_especie": [
                        "This field is required."
                    ]
                },  
                'json: Si no se encuentra un registro de DetallesMuestra con ese id':{
                    "idDetallesMuestra": [
                        "Invalid pk \"0\" - object does not exist."
                    ]
                }, 
                'json: Si no se encuentra una Especie con ese id':{
                    "id_especie": [
                        "Invalid pk \"0\" - object does not exist."
                    ]
                },
                'json: Si no se encuentra un Usuario con ese id':{
                    "id_usuario": [
                        "Invalid pk \"0\" - object does not exist."
                    ]
                },  
                'json: Si no se proporciono ningun parametro':{
                    "message": "PUT debe proporcionar parametro 'id'"
                },  
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

    # Como debe de ser el body de la peticion para ser valido
    body_valid = EtiquetadoSerializer

#----------------------------------------------------------------------------------------

class docs_delete():
    # Detalles de la documentacion para DELETE de Etiquetados


    # Los parametros que se aceptan en la operacion DELETE
    params = openapi.Parameter(
        'id', 
        openapi.IN_QUERY, 
        description="Obligatorio. El 'id' del registro que se desea eliminar", 
        type=openapi.TYPE_INTEGER,
        required = True,
    )

    # Posibles respuestas para PUT una vez pasada la autenticacion
    respuestas = {
        "200": openapi.Response(
            description="Respuesta si la operacion DELETE fue exitosa",
            examples={
                "json": {
                   'message': 'Etiquetado eliminado correctamente'
                }
            }
        ),
        "404": openapi.Response(
            description="Respuesta si no se encuentra un registro con el id especificado",
            examples={
                "json": {
                    'message': 'No se encontro ningun elemento que coincida con ese id'
                }
            }
        ),
        "400": openapi.Response(
            description="Respuesta si se proporciono un parametro distinto a 'id'",
            examples={
                "json: Si se proporciono un parametro distinto a 'id'": {
                    "message": "Solo se acepta un parametro con llave 'id'"
                },
                'json: Si no se proporciono ningun parametro':{
                    "message": "DELETE debe proporcionar parametro 'id'"
                },  
            }
        ),
        "403": openapi.Response(
            description="Solo usuarios administradores pueden hacer esta operacion",
            examples={
                "json": {
                    "error": "El usuario no tiene permisos para realizar esta accion"
                }
            }
        ),
    }

#--------------------------------------------------------------------------------------------
