const mongoose = require('mongoose')
const Schema = mongoose.Schema

const emailConfig = new Schema({
  email: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  }
}, {
    timestamps: true    // inserts createdAt and updatedAt
  })

module.exports = mongoose.model('emailConfig', emailConfig)
