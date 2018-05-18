module.exports = (data) => {
  const key    = data.key
  const MODULE = data.moduleName
  const model  = data.model

  const MODEL_PATH = model ? `app.${MODULE}.models.${model}` : 'null'

  return `INPUT.${key} = {
    headers: {
      // TODO
    },
    query: {
      fields: Field.FIELDS
    },
    params: Field.group(${MODEL_PATH}, {
      // TODO
    }),
    body: Field.group(${MODEL_PATH}, {
      // TODO
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
}
