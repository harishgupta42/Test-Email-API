'use strict';

const config = require('config')
const uuid = require('uuid/v1')
const fs = require('fs')
const Path = require('path')
const bcrypt = require('bcrypt')

const Logger = require('./Libs/logger');
const statusCodes = require('./config/statusCodes');
const Constants = require('./config/constants')
const Models = require('./Models')
let ENV = process.env.NODE_ENV;