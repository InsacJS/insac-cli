<h1 align="center">Interfaz de línea de comandos</h1>

<p align="center">
  <img src="https://github.com/insacjs/insac-cli/raw/master/assets/insac-logo-256.png" alt="Logo Insac JS" />
</p>

<p align="center">
  <a href="https://github.com/insacjs/insac-cli/releases">
      <img src="https://img.shields.io/github/release/insacjs/insac.svg" alt="Release" />
  </a>

  <a href="https://npmcharts.com/compare/insac-cli">
    <img src="https://img.shields.io/npm/dm/insac-cli.svg" alt="Downloads">
  </a>

  <a href="https://www.npmjs.com/package/insac-cli">
    <img src="https://img.shields.io/npm/v/insac-cli.svg" alt="Version">
  </a>

  <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/github/license/insacjs/insac-cli.svg" alt="License: MIT" />
  </a>
</p>

Esta herramienta permite la creación de nuevos proyectos para el [Framework Insac JS](https://github.com/insacjs/insac), adiciona nuevos componentes y genera recursos de tipo CRUD de una manera fácil y sencilla.

La documentación se encuentra disponible en la página [https://insacjs.com](https://insacjs.com).

## Instalación

```bash
npm install -g insac-cli
```

## Modo de uso

```bash
insac [opciones] [commando]
```

## Opciones

```bash
  -V, --version                          Muestra el número de versión.
  -h, --help                             Información sobre el modo de uso.
```

## Comandos

```bash
  new [options] <appName>                Crea una nueva aplicación.
  add:module [options] <moduleName>      Adiciona un nuevo módulo.
  add:model [options] <modelName>        Adiciona un nuevo modelo.
  add:seed [options] <modelName>         Adiciona un archivo de tipo seed en base a un modelo.
  add:resource [options] <path>          Adiciona un recurso.
  add:route [options] <key>              Adiciona una ruta sobre un recurso existente.
  add:config [options] <type>            Adiciona un archivo de configuración (database, server, logger, response, apidoc, ecosystem, <moduleName>).
  gen:resource [options] <resourceName>  Genera un recurso (CRUD) con el código autogenerado.
```

## Ejemplos

```bash
  $ insac new blog
  $ insac add:module api
  $ insac add:model libro --fields titulo,nro_paginas:INTEGER,precio:FLOAT
  $ insac add:seed libro
  $ insac gen:resource api/v1/libros -m libro
```

## Modo de uso de un comando específico

```bash
  $ insac new --help
  $ insac add:module --help
```
