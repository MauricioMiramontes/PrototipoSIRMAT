import sqlite3
from pathlib import Path
import datetime
import os
import requests

DIR = Path(__file__).resolve().parent.parent

# URL de Label Studio junto con puerto 
urlLS = 'http://127.0.0.1:8080/user/signup/'

def agregar_usuario_ls(email, password):
    """
    Funcion para agregar un nuevo usuario atravez de la API de label studio, 

    :param    email: email que se usara para el registo
    :type     email: str
    :param password: id del usuario que se usara para definir id del creador del registro
    :type  password: str
    """

    # Se guardan los datos en un diccionario 
    data = {
        "email" : email,
        "password" : password
    }

    try: respuesta = requests.post(urlLS, data)
    except:
        print('Error: No se recibio respuesta de API label studio, ¿Esta activo el servidor de Label Studio?')
        return()

    if respuesta.status_code == 200:
        print('Usuario agregado correctamente a label studio')
        print(respuesta.status_code)
    else : 
        print("Error al intentar agregar usuario a Label Studio:")
        print(respuesta.status_code)

#------------------------------------------------------------------------------------------------------------------    

def eliminar_usuario_ls(id):

    """
    Funcion para eliminar un usuario de label studio, 

    :param id: id de la muestra que se usara para identificar el registro a eliminar
    :type  id: str
    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()

    # Se crea el Query SQL para llevar a cabo la accion
    sql = 'DELETE FROM htx_user WHERE id=?'

    # Se ejecuta el Query
    try: cur.execute(sql, (id,))
    except:
        con.close()
        print('Error: No fue posible eliminar el usuario de la base de datos de label studio')
        return()
        
    # Se guardan los cambios en la base de datos
    con.commit()
    con.close()
    print('Usuario eliminado en label studio')

#-------------------------------------------------------------------------------------------------------------------

def editar_usuario_ls(id, email, password):
    """
    Funcion para editar un nuevo registro en la tabla de htx_user de label studio, 

    :param       id: id del usuario que se usara para identificar el registro a actualizar
    :type        id: str
    :param    email: nuevo email que tendra el usuario
    :type     email: str
    :param password: nueva contraseña que tendra el usuario
    :type  password: str

    """

    ## TODO: encontrar una mejor manera de hacer esto, utilizando PATCH de la API de Label Studio
    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '/Label_Studio_Data/label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()

    # Se elimina el usuario antiguo
    eliminar_usuario_ls(id)
    # Se agrega un nuevo usuario con los elementos actualizados
    agregar_usuario_ls(email, password)

    usuarios = cur.execute('SELECT * FROM htx_user')
    lista_usuarios = usuarios.fetchall()

    # Cambiar el id del nuevo usuario al id del usuario antiguo
    new_data = (
        id,
        lista_usuarios[-1][0],
    )

    # Se crea el SQL Query con el comando a ejecutar
    update_sql = ''' UPDATE htx_user
                     SET id = ?
                     WHERE id = ?'''

    # Se intenta ejecutar el Query
    try: cur.execute(update_sql, new_data)
    except:
        con.close()
        print('Error: No fue posible editar el usuario de la base de datos de label studio')
        return()

    # Se guardan los cambios en la tabla
    con.commit()
    con.close()
    print('Usuario editado en label studio')



