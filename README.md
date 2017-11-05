# INSAC - CLI
Herramienta de línea de comandos para trabajar con proyectos insac.

# Requerimientos
Para ejecutar los comandos `migrate`, `seed` y `apidoc`, se requiere el archivo `.insac.js` que contiene información del proyecto.

# Comandos
- **Migrate:** Crea las tablas a partir de los modelos.

- **Seed:** Adiciona datos por defecto en la base de datos.

- **Apidoc:** Crea la documentación del servicio (APIDOC).

- **Create:** Crea las tablas a partir de los modelos.

# Tecnologías utilizadas
- NodeJS v8.4.0: Entorno de programación de javascript

- Commander v2.11.0: Interfaz de línea de comandos de NodeJS

# Referencias
- Commander https://github.com/tj/commander.js

# Ejemplo
``` bash
$ insac --help

   |===============================|
   |===   I N S A C  -  C L I   ===|
   |===============================|

  Modo de uso: insac [comando] [opcion]

    Comandos:

      migrate       Crea todas las tablas de la base de datos.
      seed          Adiciona datos.
      apidoc        Crea la documentación (APIDOC).
      create        Crea un nuevo proyecto.

    Opciones:

      -v, --version               Muestra el número de versión de la aplicación.

                                  Ej.: insac --version

      -h, --help                  Muestra información acerca del uso de la aplicación.

                                  Ej.:  insac --help

      -e, --env <value>           Ejecuta un comando para un determinado entorno de ejecución.
                                  Se utiliza junto con el comando seed.
                                  El valor por defecto es 'development'.

                                  Ej.:  insac seed --env production

      -p, --models-path <value>   Nombre de una carpeta que se encuentre dentro de la carpeta 'models'.
                                  Sólo se crearán las tablas que se encuentren dentro de esta carpeta.
                                  Por defecto es la carpeta donde se encuentran todos los modelos.

                                  Ej.:  insac migrate --models-path central

                                  Este comando solamente creará aquellas tablas cuyos modelos
                                  se encuentren dentro de la carpeta 'models/central'.

    Ejemplos adicionales:

        insac migrate
        insac migrate --models-path central
        insac seed
        insac seed --env production
        insac apidoc

```
