'user strict'

const mongoose = require('mongoose')
const config = require('config')

const Logger = require('../Libs/logger')
mongoose.Promise = Promise
global.Mongoose = mongoose

let uri = config.get('mongoDb.URI')        // get MongoDb URI from .json

// Connect to MongoDB
exports.connection = mongoose.connect(uri, {
  useMongoClient: true
})
  .then(success => {
    mongoose.set('debug', true)
    Logger.logger.info('MongoDB Connected')
  })
  .catch(err => {
    Logger.logger.error({
      ERROR: err
    })
    process.exit(1)
  })
