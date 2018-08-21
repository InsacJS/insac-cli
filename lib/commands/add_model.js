module.exports = async function action (modelName, options) {
  console.log('ModelName : ', modelName)
  console.log('Fields    : ', options.fields)
  console.log('Force     : ', options.force === true)
  console.log('Example   : ', options.example === true)
  console.log('Module    : ', options.module)
}
