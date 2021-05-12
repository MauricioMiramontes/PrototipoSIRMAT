# Sistema SIRMAT

## Requisitos para instalacion 
- Python 3.8: 
    - Windows: https://www.python.org/downloads/windows/
    - Linux: https://www.python.org/downloads/source/
    - Mac OS X: https://www.python.org/downloads/mac-osx/
###
- Git 2.25 o superior:
    - Windows: https://git-scm.com/
    - Linux:
        RPM: 
        ####
            sudo dnf install git-all
        Debian: 
        ####
            sudo apt install git-all
    - Mac OS X:
        ####
            git --version

#### Modulos de python necesarios
- Django 3.2.2:
    - Utilizando pip:
        ######  
            pip install -U django==3.2.2  
- Cliente MySQL 2.0.3:
    - Utilizando pip:
        ######  
            pip install -U mysqlclient==2.0.3

### Instalacion para desarrollo

1. Clonar el repositorio de git:
    ###
        git clone https://github.com/LEAI-IIMAS/projects.git
####
2. Dentro de la carpeta SIRMAT crear un archivo llamado 'UsuarioDB.cnf'
####
3. Dentro de este archivo se tendran los datos del usuario con el que Django accedera a la base de datos MySQL, estos seran los contenidos del archivo:
    ####
        !includedir /etc/mysql/conf.d/
        !includedir /etc/mysql/mysql.conf.d/
        [client]
        database = Nombre_Base_Datos
        user = Nombre_Usuario_MySQL
        password = Contraseña_Usuario_MySQL     
        default-character-set = utf8
    Reemplazar el valor de las variables 'database', 'user', 'password' por los datos de su base de datos y su usuario.
####
4. Comprobar que se Django puede ingresar a la base de datos utilizando:
    ####
        python manage.py migrate
####
5. Es necesario descargar label studio desde el submodulo ya incluido en el repositorio:
    - https://git-scm.com/book/en/v2/Git-Tools-Submodules
    1.  Iniciamos el submodulo
    ####
        git submodule init
    2.  Descargamos label studio 
    ####
        git submodule update --recursive --progress
    3. Alternativamente se puede agregar '--recurse-submodules' al comando clone del paso 1 para descargar label studio directamente 
    ####
        git clone --recurse-submodules https://github.com/LEAI-IIMAS/projects.git

# Comandos git 
#### https://git-scm.com/docs
- Clonar un repositorio en internet a tu computadora de forma local:
https://git-scm.com/docs/git-clone
    #### 
        git clone LinkRepositorio
    Este comando normalmente solo se hace una vez.
###
- Descargar actualizaciones del repositorio en internet al repositorio local:
https://git-scm.com/docs/git-pull
    #### 
        git pull origin main
        git pull origin master
    Si se quiere descargar la version de otra rama sustituir el 'main' por el nombre de la rama, dependiendo de que tan viejo sea el repositorio aveces la rama principal se llamara 'master' en lugar de 'main'
###
- Agregar cambios como una nueva version y subirlos del repositorio local al respositorio en internet:
https://git-scm.com/docs/git-add
https://git-scm.com/docs/git-commit
https://git-scm.com/docs/git-push
    ####
    1. Revisar que se tenga la version mas actualizada del repositorio de internet, aqui puede haber conflictos:
        #### 
            git pull origin main
    ####
    2. Añadir los cambios al registro
        #### 
            git add .
    ####
    3. Añadir un comentario a los cambios
        #### 
            git commit -m "ComentarioDeCambios"
    ####
    Con esto la nueva version junto con su comentario ya estara registrada en el repositorio local.
    ####
    4. Agregar la nueva version al repositorio de internet
        #### 
            git push origin main
##
- Resolver conflictos:
https://docs.github.com/es/github/collaborating-with-issues-and-pull-requests/resolving-a-merge-conflict-using-the-command-line
####
1. Al momento de hacer 'pull' puede haber un conflicto con las version local y la version de internet del repositorio:
    #### 
        error: Your local changes would be overwritten by merge:
    Este error aparecera solo si aun no se han añadido y comentado los cambios locales, si ya se han añadido y comentado ir directamente al paso 4.
####
2. En este caso habra que guardar los cambios en un 'stash' antes de hacer el pull
https://git-scm.com/docs/git-stash 
    #### 
        git stash
        git pull origin main/master
####
3. Una vez terminado el pull habra que sacar los cambios del stash
    #### 
        git stash pop
####
4. Se modificaran los archivos donde esta el conflicto para que se pueda resolver, se puede ver detalles de estos al utilizar git status, en este caso el archivo que tiene conflicto es 'suma'
    #### 
        git status
        > # On branch main
        > # You have unmerged paths.
        > #   (fix conflicts and run "git commit")
        > #
        > # Unmerged paths:
        > #   (use "git add ..." to mark resolution)
        > #
        > # both modified:      suma.py
        > #
        > no changes added to commit (use "git add" and/or "git commit -a")
####
5. Para ver el origen de un conflicto de fusión en tu archivo, busca el archivo para el marcador de conflicto <<<<<<<. Cuando abras el archivo en tu editor de texto, verás los cambios desde la rama HEAD (encabezado) o base después de la línea <<<<<<< HEAD / Updated upstream. Luego verás =======, que separa tus cambios de los cambios en el repositorio de intetrnet, seguido de >>>>>>> Stashed changes / commit. En este ejemplo, una persona escribió "suma = 1 + 2" en la rama base o HEAD (encabezado), y otra persona escribió "suma = 1 + 3" en la rama de comparacion.
    ####
        <<<<<<< Updated upstream / HEAD
        suma = 1 + 2
        =======
        suma = 1 + 3
        >>>>>>> Stashed changes / commit
####
6. Decide si quieres mantener únicamente los cambios de tu repositorio local, mantener únicamente los cambios del repositorio de internet, o hacer un cambio nuevo, el cual puede incorporar cambios de ambas ramas. Borra los marcadores de conflicto <<<<<<<, =======, >>>>>>> y realiza los cambios que quieras en la fusión final. En este caso se conservara solamente "suma 1 + 2".
####
7. Agrega o almacena tus cambios.
    ####
        git add .
####
8. Confirma tus cambios con un comentario.
    ####
        git commit -m "Conflicto de fusión resuelto"
    Generalmente se agrega al comentario cual fue la solucion que se aplico al conflicto.
####
9. Sube los cambios locales y la solucion al repositorio en linea
    ####
        git push origin main




    