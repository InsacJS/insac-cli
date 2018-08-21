# Insac CLI

Interfaz de línea de comandos para trabajar con proyectos insac.

## Características

- Crea un proyecto con todos los componentes básicos.
- Permite la adición y creación de nuevos componentes a un proyecto.
- Genera recursos de tipo CRUD a partir de modelos.

## Instalación

`npm install -g insac-cli`

## Ayuda general

``` bash
$ insac --help

Modo de uso: insac [opciones] [commando]

Opciones:

  -V, --version                          Muestra el número de versión.
  -h, --help                             Información sobre el modo de uso.

Comandos:

  new [options] <appName> <data>         Crea una nueva aplicación.
  add:module [options] <moduleName>      Adiciona un nuevo módulo.
  add:model [options] <modelName>        Adiciona un nuevo modelo.
  add:seed [options] <modelName>         Adiciona un archivo de tipo seed en base a un modelo.
  add:resource [options] <path>          Adiciona un recurso.
  add:route [options] <key>              Adiciona una ruta sobre un recurso existente.
  gen:resource [options] <resourceName>  Genera un recurso (CRUD) con el código autogenerado.

Ejemplos:

  $ insac new blog
  $ insac add:module api
  $ insac add:model libro --fields titulo,nro_paginas:INTEGER,precio:FLOAT
  $ insac add:seed libro
  $ insac gen:resource api/v1/libros -m libro
```

## Ayuda específica

``` bash
$ insac new --help

Modo de uso: new [opciones] <appName>

Crea una nueva aplicación.

Opciones:

  -d, --description <string>  Descripción breve del proyecto. (Por defecto: )
  -f, --force                 Fuerza la creación del proyecto (Elimina el proyecto anterior).
  -v, --version <number>      Versión del proyecto. (Por defecto: 1.0.0)
  -h, --help                  Información sobre el modo de uso.

Ejemplos:

  $ insac new academico
  $ insac new academico -d "Sistema académico."
  $ insac new academico -v 2.0.0
```
