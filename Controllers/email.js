'use strict'
const uuidv4 = require('uuid/v4')
const bcrypt = require('bcrypt')

const utils = require('../utils')
const Models = require('../Models')
const Logger = require('../Libs/logger')
const Constants = require('../config/constants')
const statusCodes = require('../config/statusCodes')

exports.sendEmail = sendEmail
exports.updateEmailSettings = updateEmailSettings
/**
 * Send email
 * @param  {function} request
 * @param  {function} reply
 */
function sendEmail(request, reply) {
  return new Promise((resolve, reject) => {
    let payload = request.payload
    sendEmailRunner()
      .then(response => {
        return utils.sendSuccessResponse(response, reply)
      })
      .catch(error => {
        Logger.logger.error(error)
        return utils.sendErrorResponse(error, reply)
      })
    async function sendEmailRunner() {
      let emailConfig = await Models.EmailConfig.findOne()
      emailConfig.password = await utils.decrpyt(emailConfig.password)
      console.log('emailConfig.password: ', emailConfig.password);
      let messageId = await utils.sendEmail(payload, emailConfig)
      console.log('messageId: ', messageId);
      if (messageId) {
        payload.messageId = messageId
      }
      payload.from = emailConfig.email
      await Models.Email(payload).save()
      let response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK)
      }
      return response
    }
  })
}

/**
 * Send email
 * @param  {function} request
 * @param  {function} reply
 */
function updateEmailSettings(request, reply) {
  return new Promise((resolve, reject) => {
    let payload = request.payload
    EmailSettingsRunner()
      .then(response => {
        return utils.sendSuccessResponse(response, reply)
      })
      .catch(error => {
        Logger.logger.error(error)
        return utils.sendErrorResponse(error, reply)
      })
    async function EmailSettingsRunner() {
      payload.password = await utils.encrpyt(payload.password)
      await Models.EmailConfig.remove()
      await Models.EmailConfig(payload).save()
      let response = {
        flag: statusCodes.OK,
        message: statusCodes.getStatusText(statusCodes.OK)
      }
      return response
    }
  })
}