const _ = require('lodash')

const colors = require('../tools/logger').colors
const config = require('../config/app.config')

module.exports = async function action () {
  const WIDTH = 33

  let msg = '\n'
  msg += ` ${colors.PRIMARY} ${_.pad(`=====================================`, WIDTH, ' ')} ${colors.RESET}\n`
  msg += ` ${colors.PRIMARY} ${_.pad(`  ---------------------------------  `, WIDTH, ' ')} ${colors.RESET}\n`
  msg +=  ` ${colors.ACCENT} ${_.pad('    I N S A C   F R A M E W O R K    ', WIDTH, ' ')} ${colors.RESET}\n`
  msg += ` ${colors.PRIMARY} ${_.pad(`  =================================  `, WIDTH, ' ')} ${colors.RESET}\n`
  msg += ` ${colors.PRIMARY} ${_.pad(`-------------------------------------`, WIDTH, ' ')} ${colors.RESET}\n\n`
  msg += `  ${config.PROJECT.insacVersion2}\n`
  msg += `  ${config.PROJECT.cliVersion2}\n\n`

  process.stdout.write(msg)
}
