module.exports = (data) => {
  const key    = data.key
  const MODULE = data.moduleName
  const model  = data.model

  if (model) {
    return `OUTPUT.${key} = Field.group(app.${MODULE}.models.${model}, {
    // TODO
  })

  // <!-- [CLI] - [COMPONENT] --!> //`
  } else {
    return `OUTPUT.${key} = {
    // TODO
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  }
}
