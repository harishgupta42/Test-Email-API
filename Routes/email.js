'use strict'
let Controller = require('../Controllers/index')
let Joi = require('joi')
let Constants = require('../config/constants')
let utils = require('../utils')
let Logger = require('../Libs/logger')

module.exports = [{
  /** ********** Email *************/
  method: 'POST',
  path: '/email',
  handler: (request, reply) => {
    Controller.Email.sendEmail(request, reply)
      .then(response => {
        return utils.sendSuccessResponse(response, reply)
      })
      .catch(error => {
        return utils.sendErrorResponse(error, reply)
      })
  },
  config: {
    auth: false,
    description: 'Send Email',
    tags: ['api', 'email'],
    validate: {
      payload: Joi.object({
        to: Joi.string().email().lowercase().required().description('Enter to email'),
        cc: Joi.string().email().lowercase().description('Enter cc email'),
        bcc: Joi.string().email().lowercase().description('Enter cc email'),
        subject: Joi.string().description('Enter email subject'),
        body: Joi.string().description('Enter body')
      }),
      failAction: utils.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        response: Constants.swaggerDefaultResponseMessages()
      }
    }
  }
},
{
  /** ********** Email Settings *************/
  method: 'PUT',
  path: '/email',
  handler: (request, reply) => {
    Controller.Email.updateEmailSettings(request, reply)
      .then(response => {
        return utils.sendSuccessResponse(response, reply)
      })
      .catch(error => {
        return utils.sendErrorResponse(error, reply)
      })
  },
  config: {
    auth: false,
    description: 'Change email settings',
    tags: ['api', 'email'],
    validate: {
      payload: Joi.object({
        email: Joi.string().email().description('Enter email'),
        password: Joi.string().required().description('Enter password'),
        service: Joi.string().required().description('Enter password')
      }),
      failAction: utils.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        response: Constants.swaggerDefaultResponseMessages()
      }
    }
  }
}
]
