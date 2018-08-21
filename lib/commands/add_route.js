module.exports = async function action (key, options) {
  console.log('Key         : ', key)
  console.log('Descripción : ', options.description)
  console.log('Force       : ', options.force === true)
  console.log('Model       : ', options.model ? options.model : null)
  console.log('Module      : ', options.module)
  console.log('Path        : ', options.path)
  console.log('Resource    : ', options.resource)
  console.log('Type        : ', options.type)
  console.log('Version     : ', options.version)
}
