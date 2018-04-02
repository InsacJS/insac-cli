module.exports = (data) => {
  const key    = data.key
  const MODULE = data.moduleName
  const model  = data.model

  if (model) {
    return `INPUT.${key} = {
    headers: {
      // TODO
    },
    query: {
      // TODO
    },
    params: Field.group(app.${MODULE}.models.${model}, {
      // TODO
    }),
    body: Field.group(app.${MODULE}.models.${model}, {
      // TODO
    })
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  } else {
    return `INPUT.${key} = {
    headers: {
      // TODO
    },
    query: {
      // TODO
    },
    params: {
      // TODO
    },
    body: {
      // TODO
    }
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  }
}
