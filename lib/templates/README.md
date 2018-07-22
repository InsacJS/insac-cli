## 1. Características

## 2. Requerimientos

- **NodeJS v8.0**     : Entorno de programación de JavaScript.
- **PostgreSQL v9.4** : Gestor de base de datos PostgreSQL.

## 3. Instalación

El siguiente proceso de instalación es válido para distribuciones de linux basadas en Ubuntu o Debian.

### Proyecto

```bash
# Clonación del proyecto
git clone git@github.com:my-user/my-project.git
cd my-project

# Instalación de dependencias
yarn install
```

### Archivos de configuración

Crear el archivo `app.config.js` en base al archivo `example.app.config.js`.
```bash
cp ./src/config/example.app.config.js ./src/config/app.config.js
```

Modificar las valores que sean necesarios.

### Creación de la Base de Datos
```bash
# development
yarn setup

# producton
yarn setup-production
```

## 4. Ejecución

```bash
# development
yarn start

# production
yarn start-production
```

## 5. Pruebas

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
