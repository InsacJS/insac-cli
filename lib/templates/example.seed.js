module.exports = (data) => {
  const model  = data.modelName

  const _r = `module.exports = (app) => {
  const DATA = [
    { id_${model}: 1 }
  ]

  DATA.forEach(data => {
    data._usuario_creacion = 1
  })

  return DATA
}
`
  return _r
}
