module.exports = (app) => {
  return (email) => {
    const DATA = {}

    DATA.header = {
      from    : `Sistema ${app.config.EMAIL.systemName} <${app.config.EMAIL.systemEmail}>`,
      to      : `<${email}>`,
      subject : 'Mensaje de bienvenida'
    }

    DATA.body = {
      systemName: app.config.EMAIL.systemName
    }

    return DATA
  }
}
