/** @ignore */ const _    = require('lodash')

/** @ignore */ const { createLogger, format, transports } = require('winston')
/** @ignore */ const { printf } = format

/**
* Clase para crear logs.
*/
class Logger {
  /**
  * Crea una instancia de Logger.
  */
  constructor () {
    // ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md
    this.colors = {
      BLACK         : `\x1b[30m`,
      RED           : `\x1b[31m`,
      GREEN         : `\x1b[32m`,
      YELLOW        : `\x1b[33m`,
      BLUE          : `\x1b[34m`,
      MAGENTA       : `\x1b[35m`,
      CYAN          : `\x1b[36m`,
      LIGHT_GREY    : `\x1b[90m`,
      LIGHT_RED     : `\x1b[91m`,
      LIGHT_GREEN   : `\x1b[92m`,
      LIGHT_YELLOW  : `\x1b[93m`,
      LIGHT_BLUE    : `\x1b[94m`,
      LIGHT_MAGENTA : `\x1b[95m`,
      LIGHT_CYAN    : `\x1b[96m`,
      LIGHT_WHITE   : `\x1b[97m`
    }

    const colors = this.colors
    if (process.env.LOGGER_THEME && process.env.LOGGER_THEME === 'false') {
      Object.keys(colors).forEach(key => { colors[key] = '' })
    }

    colors.WHITE = colors.LIGHT_WHITE

    const styles = {
      BOLD          : `\x1b[1m`,
      BOLD_OFF      : `\x1b[21m`,
      UNDERLINE     : `\x1b[4m`,
      UNDERLINE_OFF : `\x1b[24m`,
      BLINK         : `\x1b[5m`,
      BLINK_OFF     : `\x1b[25m`
    }

    colors.PRIMARY = `${styles.BOLD}${colors.LIGHT_BLUE}`
    colors.ACCENT  = `${styles.BOLD}${colors.LIGHT_WHITE}`

    colors.FATAL   = `${styles.BOLD}${colors.RED}`
    colors.ERROR   = `${styles.BOLD}${colors.LIGHT_RED}`
    colors.WARN    = `${styles.BOLD}${colors.LIGHT_YELLOW}`
    colors.NOTICE  = `${styles.BOLD}${colors.LIGHT_GREEN}`
    colors.INFO    = `${styles.BOLD}${colors.LIGHT_WHITE}`
    colors.VERBOSE = `${styles.BOLD}${colors.LIGHT_CYAN}`
    colors.DEBUG   = `${styles.BOLD}${colors.MAGENTA}`
    colors.SILLY   = `${styles.BOLD}${colors.BLUE}`

    colors.TEXT    = `${colors.LIGHT_WHITE}`

    colors.RESET   = `\x1b[0m`

    /**
    * Contiene los niveles de logs.
    * Basado en RFC 5424 - The Syslog Protocol - March 2009
    * Mas información: https://github.com/winstonjs/winston#logging-levels
    * @type {Object}
    */
    this.levels = { fatal: 0, error: 1, warn: 2, notice: 3, info: 4, verbose: 5, debug: 6, silly: 7 }

    /**
    * Contiene los colores asociados a los diferentes niveles de logs.
    * @type {Object}
    */
    this.levelColors = {
      fatal   : colors.RED,           // 0 Mensajes críticos
      error   : colors.LIGHT_RED,     // 1 Mensajes de error
      warn    : colors.LIGHT_YELLOW,  // 2 Mensajes de advertencia
      notice  : colors.LIGHT_GREEN,   // 3 Mensajes importantes
      info    : colors.LIGHT_WHITE,   // 4 Mensajes informativos
      verbose : colors.LIGHT_CYAN,    // 5 Mensajes detallados
      debug   : colors.MAGENTA,       // 6 Mensajes para el depurador
      silly   : colors.BLUE           // 7 Mensajes sin importancia
    }

    /**
    * Instancia de winston logger.
    * @type {WinstonLogger}
    */
    this.winstonLogger = createLogger({
      levels      : this.levels,
      transports  : createTransports(this),
      exitOnError : false
    })

    /**
    * Cadena de texto que representa un Ok.
    * @type {String}
    */
    this.OK   = `${colors.LIGHT_WHITE}${process.platform === 'linux' ? '\u2713' : ''}${colors.RESET}`

    /**
    * Cadena de texto que representa un Fail.
    * @type {String}
    */
    this.FAIL = `${colors.LIGHT_WHITE}${process.platform === 'linux' ? '\u2715' : 'x'}${colors.RESET}`

    createAppLoggerFunctions(this)
  }

  /**
  * Indica si los logs están habilitados.
  * @return {Boolean}
  */
  isEnabled () {
    return !process.env.LOGGER || process.env.LOGGER === 'true'
  }

  /**
  * Muestra el título principal de una tarea.
  * @param {String} title - Título principal.
  */
  appTitle (title) {
    const colors = this.colors
    let msg = ''
    msg += `\n`
    msg += ` ${colors.ACCENT} ${title} ${colors.RESET}\n`
    msg += ` ${colors.PRIMARY} ${_.pad('', title.length, '=')} ${colors.RESET}\n`
    msg += `\n`
    process.stdout.write(msg)
  }

  /**
  * Muestra el título secundario de una tarea.
  * @param {String} title - Título secundario.
  */
  appTitle2 (title) {
    const colors = this.colors
    process.stdout.write(`\n`)
    process.stdout.write(` ${colors.ACCENT} ${title} ${colors.RESET}\n`)
    process.stdout.write(`\n`)
  }

  /**
  * Muestra logs optimizados para informar el flujo de ejecución de la aplicación.
  * @param {String} level   - Nivel de log.
  * @param {String} title   - Título del mensaje.
  * @param {String} message - Mensaje.
  * @param {Object} data    - Información adicional (puede ser un objeto).
  */
  app (level = 'info', title = '', message = '', data = '') {
    const colors = this.colors
    if (typeof title === 'string')   { title = ` ${title}` }     else { title = ` ${level}:` }
    if (typeof message === 'string') { message = ` ${message}` } else { message = `` }
    data = data ? (typeof data === 'string' ? data : require('util').inspect(data, { depth: null })) : ''
    if (data !== '') data = `\n${data}`
    const COLOR1 = colors[level.toUpperCase()]
    const COLOR2 = colors.TEXT
    process.stdout.write(` ${COLOR1}${title}${colors.RESET}${COLOR2}${message}${data}${colors.RESET}\n`)
  }
}

/**
* @ignore
* Crea una lista de transportes que utiliza WinstonLogger.
* @param {!Logger}      logger - Instancia de logger.
* @return {Transport[]}
*/
function createTransports (logger) {
  const TRANSPORTS = []
  if (logger.isEnabled()) {
    TRANSPORTS.push(new transports.Console({
      format           : printf(consoleFormat(logger)),
      level            : 'verbose',
      handleExceptions : false,
      colorize         : false,
      json             : false
    }))
  }
  return TRANSPORTS
}

/**
* @ignore
* Devuelve una cadena de texto con formato personalizado para los logs de la consola.
* @param {!Function} app - Instancia del servidor express.
* @return {String}
*/
function consoleFormat (logger) {
  return (info) => {
    const RESULT = {
      timestamp : '',
      reqId     : '',
      level     : info.level,
      message   : info.message,
      data      : ''
    }
    if (info.data) {
      const dataSTR = require('util').inspect(info.data, { depth: null })
      if (dataSTR) { RESULT.data = `\n${dataSTR}` }
    }
    const LEVEL_STR = _.padEnd(`[${RESULT.level}]`, 10, ' ')
    return `${logger.levelColors[RESULT.level]}${RESULT.timestamp}${RESULT.reqId}${LEVEL_STR} ${RESULT.message}${RESULT.data}${logger.colors.RESET}`
  }
}

/**
* @ignore
* Adiciona funciones personalizadas para todos los niveles de logs soportados.
* @param {!Logger} logger - Instancia de logger.
* @return {String}
*/
function createAppLoggerFunctions (logger) {
  const IS_ENABLED = logger.isEnabled()
  Object.keys(logger.levels).forEach(level => {
    // Logger para el framework.
    const functionName = `app${_.upperFirst(level)}`
    logger[functionName] = (...args) => {
      if (!IS_ENABLED) return
      logger.app(level, ...args)
    }
  })
}

module.exports = new Logger()
