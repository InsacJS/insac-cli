module.exports = (data) => {
  const key         = data.key
  const path        = data.path
  const method      = data.method
  const description = data.description
  let vMatch  = path.match(/\/v(\d)*\//i)
  const version = vMatch ? parseInt(vMatch[0].substr(2, vMatch[0].length - 3)) : 1

  const _r = `ROUTE.${key} = {
    path        : '${path}',
    method      : '${method}',
    description : '${description}',
    version     : ${version}
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return _r
}
