module.exports = (app) => {
  /**
  * Envía un mensaje por correo electrónico.
  * Ejemplo: app.EMAIL.welcome('destino@example.com', 'Bienvenido al sistema')
  */
  return (direccionEmail, mensaje) => {
    const CONTENT = {}

    CONTENT.from    = `Sistema ${app.config.EMAIL.systemName} <${app.config.EMAIL.systemEmail}>`
    CONTENT.to      = `<${direccionEmail}>`
    CONTENT.subject = 'Prueba'

    CONTENT.data = {
      systemName : app.config.EMAIL.systemName,
      message    : mensaje
    }

    return CONTENT
  }
}
