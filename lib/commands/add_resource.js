module.exports = async function action (path, options) {
  console.log('Force  : ', options.force === true)
  console.log('model  : ', options.model ? options.model : null)
  console.log('Module : ', options.module)
  console.log('Path   : ', path)
}
