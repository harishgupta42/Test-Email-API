'use strict'

const HapiSwagger = require('hapi-swagger-next')
const Inert = require('inert')
const Vision = require('vision')

const Logger = require('../Libs/logger')

// Register Swagger
exports.register = (server, options, next) => {
  server.register([
    Inert,
    Vision,
    {
      'register': HapiSwagger,
      'options': {
        'info': {
          'title': 'Test-Email-API',
          'version': '1.0.0'
        },
        'pathPrefixSize': 3,
        'payloadType': 'form',
        'jsonEditor': false,
        'grouping': 'tags'
        //'consumes': ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'],
        //'produces': ['application/json']
      }
    }
  ], (err) => {
    if (err) {
      Logger.logger.error({
        ERROR: err
      })
    } else {
      Logger.logger.info('Hapi-Swagger interface loaded')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'swagger-plugin',
  once: true
}
