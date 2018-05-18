const _ = require('lodash')

module.exports = (data) => {
  const MODULE   = data.moduleName
  const model    = data.modelName
  const key      = data.key
  const MODEL    = data.model
  const LEVEL    = data.LEVEL
  const IS_ARRAY = data.isArray

  function generate (output, model, level) {
    if (Array.isArray(output)) output = output[0]
    Object.keys(model.attributes).forEach(fieldName => {
      if (fieldName.startsWith('_')) return
      output[fieldName] = 'THIS()'
    })
    if (level >= LEVEL) return
    const associations = model.associations
    Object.keys(associations).forEach(assoc => {
      const target  = associations[assoc].target
      output[assoc] = (associations[assoc].associationType === 'HasMany') ? [{}] : {}
      generate(output[assoc], target, level + 1)
    })
  }
  const output = IS_ARRAY ? [{}] : {}
  generate(output, MODEL, 1)

  let result     = JSON.stringify(output, null, 2) + ')'
  let split      = result.split('\n')
  let containerA = []
  let containerB = []
  let final      = ''
  for (let i = 1; i < split.length; i++) {
    let line = split[i]
    while (line.indexOf('"') !== -1) { line = line.replace('"', '') }
    if (line.indexOf(':') !== -1) {
      containerA.push(line.split(':')[0])
      containerB.push(line.split(':')[1])
      if (line.endsWith('{') || line.endsWith('[') || line.endsWith('()')) {
        let max = 0
        let n   = containerA.length
        containerA.forEach(prop => { if (prop.length > max) max = prop.length })
        for (let k = 0; k < n; k++) {
          const finalLine = `  ${_.padEnd(containerA[k], max, ' ')}${n === 1 ? ':' : ' :'}${containerB[k]}`
          final += finalLine + '\n'
        }
        containerA = []
        containerB = []
      }
    } else {
      final += (line.trim() === '') ? '' : ('  ' + line + '\n')
    }
  }
  return `OUTPUT.${key} = Field.group(app.${MODULE}.models.${model}, ${IS_ARRAY ? '[' : '{'}\n${final}`
}
