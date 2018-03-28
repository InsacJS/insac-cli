module.exports = (data) => {
  const key         = data.key
  const path        = data.path
  const method      = data.method
  const description = data.description

  const _r = `ROUTE.${key} = {
    path        : '${path}',
    method      : '${method}',
    description : '${description}'
  }

  // <!-- [CLI] - [ROUTE] --!> //`
  return _r
}
