const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const config = require('config')
const Boom = require('boom')


const utils = require('../utils')
const Models = require('../Models')
const Logger = require('../Libs/logger')
const Constants = require('../config/constants')
const statusCodes = require('../config/statusCodes')

const requestValidator = (decoded, request, callback) => {
    Logger.logger.info('DECODED: ', decoded)
    Logger.logger.info('PAYLOAD: ', request.payload)
    if (!decoded.id) {
        return callback(null, false);
    }
    let filters = {
        _id: decoded.id,
        'devices.device_token': decoded.device_token,
        'devices.is_blocked': false
    }
    if (decoded.scope === Constants.scopes.SUPERADMIN || decoded.scope === Constants.scopes.ADMIN || decoded.scope === Constants.scopes.MANAGER) {
        Models.Admin.findOne(filters, {}, { lean: true }, (err, admin) => {
            if (err || !admin) {
                Logger.logger.error(err)
                return callback(Boom.badRequest('Invalid credentials'))
            }
            if (request.payload && request.payload.device_token && request.payload.device_token !== decoded.device_token) {
                Logger.logger.error('Device token mismatch')
                return callback(Boom.badRequest('Cannot access through this device'))
            }
            if (admin.blocked) {
                Logger.logger.error('Account is blocked: ', admin.email)
                return callback(Boom.unauthorized('Account is blocked'))
            }
            if (admin.deleted) {
                Logger.logger.error('Account is deleted: ', admin.email)
                return callback(Boom.unauthorized('Account is deleted'))
            }
            return callback(null, true, { _id: admin._id, device_token: decoded.device_token, device_type: decoded.device_type, scope: decoded.scope });
        });
    }
    if (decoded.scope === Constants.scopes.TEACHER) {
        Models.Teacher.findOne(filters, {}, { lean: true }, (err, teacher) => {
            if (err || !teacher) {
                Logger.logger.error(err)
                return callback(Boom.badRequest('Invalid credentials'))
            }
            if (request.payload.device_token && request.payload.device_token !== decoded.device_token) {
                Logger.logger.error('Device token mismatch')
                return callback(Boom.badRequest('Cannot access through this device'))
            }
            if (teacher.blocked) {
                Logger.logger.error('Account is blocked: ', teacher.email)
                return callback(Boom.unauthorized('Account is blocked'))
            }
            if (teacher.deleted) {
                Logger.logger.error('Account is deleted: ', teacher.email)
                return callback(Boom.unauthorized('Account is deleted'))
            }
            return callback(null, true, { _id: teacher._id, device_token: decoded.device_token, device_type: decoded.device_type, scope: decoded.scope });
        });
    }
    if (decoded.scope === Constants.scopes.STUDENT) {
        Models.Student.findOne(filters, {}, { lean: true }, (err, student) => {
            if (err || !student) {
                Logger.logger.error(err)
                return callback(Boom.badRequest('Invalid credentials'))
            }
            if (request.payload && request.payload.device_token && request.payload.device_token !== decoded.device_token) {
                Logger.logger.error('Device token mismatch')
                return callback(Boom.badRequest('Invalid device'))
            }
            if (student.blocked) {
                Logger.logger.error('Account is blocked: ', student.email)
                return callback(Boom.unauthorized('Account is blocked'))
            }
            if (student.deleted) {
                Logger.logger.error('Account is deleted: ', student.email)
                return callback(Boom.unauthorized('Account is deleted'))
            }
            return callback(null, true, { _id: student._id, device_token: decoded.device_token, device_type: decoded.device_type, scope: decoded.scope });
        });
    }
}

exports.register = (server, options, next) => {
    server.register(require('hapi-auth-jwt2'), (err) => {
        server.auth.strategy('jwt', 'jwt', {
            key: config.get("secret_key"),
            validateFunc: requestValidator,
            verifyOptions: {
                ignoreExpiration: false,
                algorithms: ['HS256']
            }
        })
        server.auth.default('jwt')
        next()
    })
}

exports.register.attributes = {
    name: 'auth-token-plugin'
}