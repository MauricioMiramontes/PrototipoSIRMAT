import sqlite3



def agregar_foto_ls(id_foto, nombre_foto, id_usuario, id_proyecto):
    con = sqlite3.connect('C:/Users/ASUS/AppData/Local/label-studio/label-studio/label_studio.sqlite3')
    cur = con.cursor()

    data_import_fileupload = [
        (id_foto, 'upload/'+nombre_foto, id_usuario, id_proyecto)
    ]

    cur.executemany("insert into data_import_fileupload values (?, ?, ?, ?)", data_import_fileupload)
    
    data_task_ls = [
        (id_foto, '{"image": "/data/upload/'+ nombre_foto +'"}', '2021-05-06 01:35:46.100762','2021-05-06 01:35:46.100762', 0, id_proyecto, 1, id_foto,'{}')
    ]

    cur.executemany("insert into task values (?, ?, ?, ?, ?, ?, ?, ?, ?)", data_task_ls)
    con.commit()
    con.close()
    print(data_import_fileupload)
    print(data_task_ls)



##for row in cur.execute('SELECT * FROM task'):
    ##print(type(row[0]))
    ##print(row)