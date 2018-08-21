const _ = require('lodash')

const colors = require('../tools/logger').colors
const config = require('../config/app.config')

module.exports = async function action () {
  const WIDTH = 53

  let msg = `\n`
  msg += ` ${_.pad(`${colors.PRIMARY}=====================================${colors.RESET}`, WIDTH, ' ')} \n`
  msg += ` ${_.pad(`${colors.PRIMARY}  ---------------------------------  ${colors.RESET}`, WIDTH, ' ')} \n`
  msg +=  ` ${_.pad(`${colors.ACCENT}    I N S A C   F R A M E W O R K    ${colors.RESET}`, WIDTH, ' ')} \n`
  msg += ` ${_.pad(`${colors.PRIMARY}  ---------------------------------  ${colors.RESET}`, WIDTH, ' ')} \n`
  msg += ` ${_.pad(`${colors.PRIMARY}=====================================${colors.RESET}`, WIDTH, ' ')} \n\n`
  msg += ` ${_.pad(config.PROJECT.insacVersion2, WIDTH + 12, ' ')} \n`
  msg += ` ${_.pad(config.PROJECT.cliVersion2,   WIDTH + 12, ' ')} \n\n`

  process.stdout.write(msg)
}
