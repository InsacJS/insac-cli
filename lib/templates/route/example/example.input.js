module.exports = (data) => {
  const key    = data.key
  const MODULE = data.moduleName
  const model  = data.model
  const method = data.method

  const TYPES = {}

  const fieldGroup = model ? `Field.group(app.${MODULE}.models.${model}, {
      // TODO
    })` : `Field.group(null, {
      // TODO
    })`

  TYPES.get = `INPUT.${key} = {
    headers: Field.group(null, {
      // TODO
    }),
    query: Field.group(null, {
      fields: Field.FIELDS()
    }),
    params: ${fieldGroup}
  }`

  TYPES.post = `INPUT.${key} = {
    headers: Field.group(null, {
      // TODO
    }),
    params: ${fieldGroup},
    body: ${fieldGroup}
  }`

  TYPES.put = TYPES.post

  TYPES.patch = TYPES.post

  TYPES.delete = TYPES.post

  return `${TYPES[method]}\n\n  // <!-- [CLI] - [COMPONENT] --!> //`
}
