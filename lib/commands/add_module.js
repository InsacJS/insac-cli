module.exports = async function action (moduleName, options) {
  console.log('ModuleName : ', moduleName)
  console.log('Force      : ', options.force === true)
}
