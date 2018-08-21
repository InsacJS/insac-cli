module.exports = async function action (modelName, options) {
  console.log('ModelName : ', modelName)
  console.log('Module    : ', options.module)
  console.log('Records   : ', options.records)
  console.log('Force     : ', options.force === true)
}
