const winston = require('winston')
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug'

const tsFormat = () => (new Date()).toLocaleTimeString()

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      name: 'Console',
      level: LOG_LEVEL,
      colorize: true,
      prettyPrint: true,
      handleExceptions: true,
      timestamp: tsFormat
    })
  ]
})

module.exports = logger
