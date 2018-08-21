const DATABASE = {
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  database : process.env.DB_NAME || '_example',

  // http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
  params: {
    dialect  : process.env.DIALECT || 'postgres', // postgres, mysql, mssql, sqlite
    host     : process.env.DB_HOST || '127.0.0.1',
    port     : process.env.DB_PORT || 5432, // postgres: 5432, mysql: 3306, mssql: 1433
    timezone : process.env.DB_TZ   || '-04:00',

    define: {
      underscored     : true,
      freezeTableName : true,
      timestamps      : true,
      paranoid        : true,
      createdAt       : '_fecha_creacion',
      updatedAt       : '_fecha_modificacion',
      deletedAt       : '_fecha_eliminacion'
    }
  },

  // Para controlar la instalación de la base de datos.
  onSetup: {
    modules: [],

    dropDatabase   : false,
    createDatabase : true,

    dropSchemas   : false,
    createSchemas : true,

    dropTables   : true,
    createTables : true,

    createSeeders: true
  }
}

module.exports = DATABASE
