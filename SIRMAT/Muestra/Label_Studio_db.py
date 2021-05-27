import sqlite3
from pathlib import Path
import datetime
import os

DIR = Path(__file__).resolve().parent.parent

# Configuracion predeterminada para etiquetado de poligonos
CONFIG_label_LS_POLIGONOS = '<View> <Image name="image" value="$image" zoom="true"/> <PolygonLabels name="label" toName="image" strokeWidth="3" pointSize="small" opacity="0.9"><Label value="Airplane" background="red"/><Label value="Car" background="blue"/></PolygonLabels></View>'
data_types = '{"image": "Image"}'
control_weights = '{"label": {"overall": 1.0, "type": "PolygonLabels", "labels": {"Airplane": 1.0, "Car": 1.0} } }'


def agregar_muestra_ls(id_muestra, id_usuario, title):
    """
    Funcion para agregar un nuevo registro en la tabla de project de label studio, 
    El nuevo registro se hara en base a cada muestra nueva que se haya agregado a la base de datos SIRMAT

    :param id_muestra: id de la muestra que se usara para definir id del registro 
    :type  id_muestra: str
    :param id_usuario: id del usuario que se usara para definir id del creador del registro
    :type  id_usuario: str
    :param      title: titulo que se pondra en el campo 'title' del registro y sirve como el nombre del proyecto en label studio
    :type       title: str

    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '\Label_Studio_data\label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '\Label_Studio_data\label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()
    

    # Se define la hora y fecha actual
    now = datetime.datetime.now()

    # Se guardan los datos en una tupla junto con algunos predeterminados para la configuracion del proyecto
    data = [(
        id_muestra,                # id
        CONFIG_label_LS_POLIGONOS, # label_config
        0,                         # show_instruction
        data_types,                # data_types
        0,                         # is_published
        str(now),                  # created_at
        str(now),                  # updated_at
        id_usuario,                # created_by_id
        0,                         # show_skip_button
        1,                         # show_collab_predictions
        'Sequential sampling',     # sampling
        100,                       # overlap_cohort_percentage
        1,                         # show_overlap_first
        control_weights,           # control_weights
        0,                         # result_count
        1,                         # organization_id
        0,                         # is_draft
        '#FFFFFF',                 # color
        1,                         # enable_empty_annotation
        5,                         # maximum_annotations
        10,                        # min_annotations_to_start_training
        0,                         # show_annotation_history
        1,                         # show_ground_truth_first
        title                      # title
    )]

    # Se ejecuta el Query de SQL con los datos guardados en data y se usa commit para guardar los cambios
    try: cur.executemany("insert into project(id, label_config, show_instruction, data_types, is_published, created_at, updated_at, created_by_id, show_skip_button, show_collab_predictions, sampling, overlap_cohort_percentage, show_overlap_first, control_weights, result_count, organization_id, is_draft, color, enable_empty_annotation, maximum_annotations, min_annotations_to_start_training, show_annotation_history, show_ground_truth_first, title ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", data)
    except:
        con.close()
        print('Error: No fue posible agregar la muestra de label studio')
        return()
    
    con.commit()
    con.close()
    print('Muestra agregada correctamente a label studio')

#------------------------------------------------------------------------------------------------------------------    

def eliminar_muestra_ls(id):

    """
    Funcion para eliminar un nuevo en la tabla de project de label studio, 
    El registro eliminado sera que tenga el mismo id que la muestra eliminada en la base de datos SIRMAT 

    :param id: id de la muestra que se usara para identificar el registro a eliminar
    :type  id: str

    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '\Label_Studio_data\label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '\Label_Studio_data\label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()

    # Se crea el Query SQL para llevar a cabo la accion
    sql = 'DELETE FROM project WHERE id=?'

    # Se ejecuta el Query
    try: cur.execute(sql, (id,))
    except:
        con.close()
        print('Error: No fue posible eliminar la muestra de la base de datos de label studio')
        return()
        
    # Se guardan los cambios en la base de datos
    con.commit()
    con.close()
    print('Muestra Eliminada en label studio')

def editar_muestra_ls(id, title):
    """
    Funcion para editar un nuevo registro en la tabla de project de label studio, 
    El nuevo registro se hara en base a cada muestra nueva que se haya agregado a la base de datos SIRMAT

    :param    id: id de la muestra que se usara para identificar el registro a actualizar
    :type     id: str
    :param title: titulo que se pondra en el campo 'title' del registro y sirve como el nombre del proyecto en label studio
    :type  title: str

    """

    # Se revisa primero si existe el archivo de la base de datos de label studio 
    # Este archivo lo genera automaticamente label studio cuando se inicia por primera vez

    if os.path.exists(str(DIR) + '\Label_Studio_data\label_studio.sqlite3'):
         # Se crea conexion a base de datos
        try: 
            con = sqlite3.connect(str(DIR) + '\Label_Studio_data\label_studio.sqlite3')
            cur = con.cursor()
        except:
            print('Error: No fue posible crear la conexion a la base de datos de label studio')
            return()
    else: 
        print('Error: No existe el archivo label_studio.sqlite3 dentro de Label_Studio_data')
        return()

    # Se guardan los datos nuevos en una sola variable
    new_data = (
        title,
        id
    )

    # Se crea el SQL Query con el comando a ejecutar
    sql = ''' UPDATE project
              SET title= ?
              WHERE id = ?'''

    # Se intenta ejecutar el Query
    try: cur.execute(sql, new_data)
    except:
        con.close()
        print('Error: No fue posible editar la muestra de la base de datos de label studio')
        return()

    # Se guardan los cambios en la tabla
    con.commit()
    con.close()
    print('Muestra editada en label studio')
