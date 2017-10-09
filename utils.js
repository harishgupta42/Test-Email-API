'use strict';

const config = require('config')
const JWT = require('jsonwebtoken')
const otplib = require('otplib')
const uuid = require('uuid/v1')
const fs = require('fs')
const Path = require('path')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const Logger = require('./Libs/logger');
const statusCodes = require('./config/statusCodes');
const Constants = require('./config/constants')
const Models = require('./Models')
module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
    failActionFunction,
    generateToken,
    generateOtp,
    sendEmail,
    encrpyt,
    decrpyt
}

/**
 * Compresses a given response object and sends it.
 * @param  {object} response    Contains the final result of any API
 * @param  {stream} res         express res stream
 */
function sendSuccessResponse(response, res) {
    if (!response.flag) {
        response.flag = statusCodes.OK
    }
    if (!response.message) {
        response.message = statusCodes.getStatusText(statusCodes.OK);
    }
    return res({
        statusCode: response.flag,
        message: response.description || response.message || 'OK',
        data: response.data || {}
    }).code(response.flag);
}

/**
 * Sends a response in case of an error
 * @param  {object} error       {responseFlag, responseMessage}
 * @param  {stream} res         express res stream
 */
function sendErrorResponse(error, res) {
    if (!error.responseFlag) {
        error.responseFlag = statusCodes.METHOD_FAILURE;
    }
    if (!error.responseMessage) {
        error.responseMessage =
            error.message ||
            statusCodes.getStatusText(statusCodes.METHOD_FAILURE);
    }
    let response = {
        flag: error.responseFlag,
        message: error.responseMessage
    };
    if (error.addnInfo) {
        for (let key in error.addnInfo) {
            response[key] = error.addnInfo[key];
        }
    }
    return res({
        statusCode: response.flag,
        message: response.description || response.message || 'Something has gone wrong!',
        data: response.data || {}
    }).code(response.flag);
}


function failActionFunction(request, reply, source, error) {
    Logger.logger.info('error', error)

    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    if (customErrorMessage.indexOf('mobile') > -1) {
        customErrorMessage = customErrorMessage.replace('mobile', 'Phone number');
    }
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation;
    return reply(error);
};

function generateToken(tokenData) {
    return new Promise((resolve, reject) => {
        let secret = config.get("secret_key")
        try {
            let token = JWT.sign(tokenData, secret)
            return resolve(token)
        }
        catch (err) {
            return reject(err)
        }
    })
}

function generateOtp(secret) {
    return new Promise((resolve, reject) => {
        //let secret = config.get("otp_secret")
        otplib.authenticator.options = {
            digits: 6,
            step: 120
        }
        try {
            let otp = otplib.authenticator.generate(secret);
            return resolve(otp);
        }
        catch (err) {
            return reject(err)
        }
    })
}
function sendEmail(dataObject, config) {
    console.log('config: ', config);
    console.log('dataObject: ', dataObject);
    return new Promise((resolve, reject) => {

        let transport = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.email,
                pass: config.password
            },
            logger: true,
            debug: true
        })
        let options = {
            from: 'harishgupta42@gmail.com',
            to: dataObject.to,
            subject: dataObject.subject,
            html: `<p>${dataObject.body}<p>`
        }
        transport.sendMail(options)
            .then(success => {
                console.log('success: ', success);
                Logger.logger.info('EmailID', success.messageId)
                return resolve(success.messageId)
            })
            .catch(error => {
                Logger.logger.error(error)
                return resolve()
            })
    })
}

function encrpyt(data) {
    return new Promise((resolve, reject) => {
        let cipher = crypto.createCipher('aes-256-ctr', 'waKeThEmU9')
        let crypted = cipher.update(data,'utf-8', 'hex');
        crypted += cipher.final('hex')
        return resolve(crypted)
    })
}
function decrpyt(data) {
    return new Promise((resolve, reject) => {
        let decipher = crypto.createDecipher('aes-256-ctr', 'waKeThEmU9')
        let decrypted = decipher.update(data,'hex', 'utf-8');
        decrypted += decipher.final('utf-8')
        return resolve(decrypted)
    })
}