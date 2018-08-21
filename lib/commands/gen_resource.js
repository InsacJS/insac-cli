module.exports = async function action (resourceName, options) {
  options.resourceName = resourceName
  await parseArgs(options)
  console.log('ResourceName : ', resourceName)
  console.log('Force        : ', options.force === true)
  console.log('Model        : ', options.model)
  console.log('Module       : ', options.module)
  console.log('Type         : ', options.type)
  console.log('Version      : ', options.version)
}

async function parseArgs (options) {
  if (!options.model) {
    console.log()
    console.log('  Se requiere la opción --model')
    console.log()
    process.exit(1)
  }
}
