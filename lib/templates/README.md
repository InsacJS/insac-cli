## 1. Características

Expone servicios que pueden ser consumidos por una apliación front-end.

## 2. Requerimientos

| Herramienta  | Versión          | Descripción                            |
|--------------|------------------|----------------------------------------|
| `NodeJS`     | 8.0.0 o superior | Entorno de programación de JavaScript. |
| `PostgreSQL` | 9.4              | Gestor de base de datos.               |

## 3. Instalación

El siguiente proceso de instalación es válido para distribuciones de linux basadas en Ubuntu o Debian.

### 3.1. Clonación del proyecto e instalación de dependencias

```bash
# Clonación del proyecto
git clone git@github.com:my-user/my-project.git
cd my-project

# Instalación de dependencias
yarn install
```

### 3.2. Archivos de configuración

Crear los archivos de configuración `*.config.js` en base a los archivos `*.config.js.example` y modificar los valores que sean necesarios.

```bash
# SERVER
$ cp ./src/config/server.config.js.example ./src/config/server.config.js

# DATABASE
$ cp ./src/config/database.config.js.example ./src/config/database.config.js

# LOGGER
$ cp ./src/config/logger.config.js.example ./src/config/logger.config.js
```

### 3.3 Creación de la Base de Datos

La base de datos se crea automáticamente si no existe.

```bash
# Entorno de desarrollo
yarn setup

# Entorno de producción
yarn setup-production
```

## 4. Despliegue de la aplicación

```bash
# Entorno de desarrollo
yarn start

# Entorno de producción
yarn start-production
```

Para desplegar la aplicación de manera contínua, puede utilizar [PM2](http://pm2.keymetrics.io/), para hacer esto, crear el archivo `ecosystem.config.json` en base al archivo `ecosystem.config.json.example`, modificar los valores si es necesario y ejecutarlo:

```bash
# ECOSYSTEM
$ cp ./ecosystem.config.json.example ./ecosystem.config.json

# Despliegue continuo
$ pm2 start ecosystem.config.json
```

## 5. Pruebas unitarias y de integración

```bash
# Todas las pruebas
yarn test

# Pruebas unitarias
yarn test-unit

# Pruebas de integración
yarn test-integration
```

## 6. Referencias

- [Insac JS](http://insacjs.com): Framework de creación de servicios web
- [Express JS](http://expressjs.com): Infraestructura de aplicaciones web Node.js
- [Sequelize](http://docs.sequelizejs.com): Framework ORM de NodeJS
