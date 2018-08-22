module.exports = (data) => {
  const key         = data.key
  const path        = data.path
  const method      = data.method
  const description = data.description
  const version     = data.version

  const _r = `ROUTE.${key} = {
    path        : '${path}',
    method      : '${method}',
    description : '${description}',
    version     : ${version}
  }

  // <!-- [CLI] - [COMPONENT] --!> //`
  return _r
}
