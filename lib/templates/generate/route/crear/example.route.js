module.exports = (data) => {
  const group   = data.GROUP
  const key     = data.key
  let   content = data.fileContent

  const _r = `ROUTE.${key} = {
    path        : '/${group}',
    method      : 'post',
    description : 'Crea un nuevo registro.'
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
