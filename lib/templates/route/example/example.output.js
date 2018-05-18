module.exports = (data) => {
  const key    = data.key
  const MODULE = data.moduleName
  const model  = data.model

  const MODEL_PATH = model ? `app.${MODULE}.models.${model}` : 'null'

  return `OUTPUT.${key} = Field.group(${MODEL_PATH}, {
    // TODO
  })

  // <!-- [CLI] - [COMPONENT] --!> //`
}
