'use strict'
//const winston = require('winston')
const log4js = require('log4js')

log4js.configure({
  appenders: { 'out': { type: 'stdout', layout: { type: 'coloured' } } },
  categories: { default: { appenders: ['out'], level: 'ALL' } }
})
let logger = log4js.getLogger('email');

// // converts the date object to local time string
// const tsFormat = () => (new Date()).toLocaleTimeString()

// // winston logger to generate logs
// const ogger = new (winston.Logger)({
//   transports: [
//     // colorize the output to the console
//     new winston.transports.Console({
//       timestamp: tsFormat,
//       colorize: true,
//       level: 'debug', // level of log
//       //handleExceptions: true
//     })
//   ]
// })

module.exports = {
  logger
}
