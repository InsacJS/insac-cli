# Insac CLI

Herramienta de línea de comandos para trabajar con proyectos insac.

## Características

- Crea un proyecto.
- Adiciona nuevos módulos.
- Adiciona nuevos modelos.
- Adiciona nuevos dao.
- Adiciona nuevos seeders.
- Adiciona nuevos recursos.
- Adiciona nuevas rutas.
- Genera recursos de tipo CRUD a partir de modelos.

## Instalación

`npm install -g insac-cli`

## Ejemplo
``` bash
$ insac --help

|===============================|
|===   I N S A C  -  C L I   ===|
|===============================|

insac     : v2.2
insac-cli : v2.2

Modo de uso: insac [comando] [opciones]

  Comandos:

    new <name> [description]  Crea un nuevo proyecto.

    add:module <name>         Adiciona un nuevo módulo.
    add:model <name>          Adiciona un nuevo modelo.
    add:dao                   Adiciona un nuevo dao.
    add:seed                  Adiciona un nuevo seed.
    add:resource <name>       Adiciona un nuevo recurso.
    add:route <key>           Adiciona una nueva ruta.

    gen:resource <name>       Genera un recurso (CRUD) con el código autogenerado.

  Opciones:

    -v, --version             Muestra el número de versión de la herramienta CLI.
    -h, --help                Muestra información acerca del uso de la herramienta CLI.
    -f, --force               Fuerza la operación.
    -e, --example             Incluye un ejemplo.

    -M, --module <value>      Nombre del módulo.
    -m, --model <value>       Nombre del modelo.
    -r, --resource <value>    Nombre del recurso.

    -t, --type <value>        Tipo de modulo o ruta.
                                - MODULOS : RESOURCE (default), SENDGRID_MAIL, MODULE.
                                - RUTAS   : all (default), get, getId, create, update, destroy, restore.
    -c, --count <value>       Cantidad de registros a incluir en el fichero de seeds. [opcional] Valor por defecto: 1

    --fields <value>          Atributos de un modelo separados por comas y el tipo de dato por dos puntos.
                                - Tipos: STRING (default), INTEGER, FLOAT, BOOLEAN, DATE. [opcional]

    --level <value>           Nivel de submodelos a incluir en el componente OUTPUT. [opcional] Valor por defecto: 0
    --method <value>          Propiedad method de una ruta. [opcional] Valor por defecto: get
    --path <value>            Propiedad path de una ruta. [opcional]
    --description <value>     Propiedad description de una ruta. [opcional]

  Ejemplo para crear un nuevo proyecto:

    insac new blog
    insac add:module api
    insac add:model libro --fields titulo,paginas:INTEGER,precio:FLOAT
    insac add:seed -m libro
    insac gen:resource api/v1/libros -m libro

  Ejemplo para adicionar recursos:

    insac add:resource api/v1/libros -m libro
    insac add:resource api/v1/custom

  Ejemplo para adicionar rutas a un recurso existente:

    insac add:route listar -r api/v1/libros -m libro
    insac add:route listar -r api/v1/libros -m libro -t get,create
    insac add:route welcome -r api/v1/custom

  Ejemplo para crear un recurso en un módulo diferente:

    insac add:resource auth/v1/usuarios -m usuario -M AUTH
```
