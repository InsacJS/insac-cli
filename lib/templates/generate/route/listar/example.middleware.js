module.exports = (data) => {
  const key   = data.key
  let content = data.fileContent

  const _r = `MIDDLEWARE.${key} = []

  // <!-- [CLI] - [COMPONENT] --!> //`

  return content.replace('// <!-- [CLI] - [COMPONENT] --!> //', _r)
}
