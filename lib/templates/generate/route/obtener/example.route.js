module.exports = (data) => {
  const group   = data.GROUP
  const MODEL   = data.model
  const key     = data.key
  let   content = data.fileContent

  const pk = MODEL.primaryKeyAttribute

  const _r = `ROUTE.${key} = {
    path        : '/${group}/:${pk}',
    method      : 'get',
    description : 'Devuelve un registro por ID.'
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
