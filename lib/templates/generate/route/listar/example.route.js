module.exports = (data) => {
  const key         = data.key
  const path        = data.path
  const method      = data.method
  const description = data.description
  let   content     = data.fileContent

  const _r = `ROUTE.${key} = {
    path        : '${path}',
    method      : '${method}',
    description : '${description}'
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
