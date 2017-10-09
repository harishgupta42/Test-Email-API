const mongoose = require('mongoose')
const Schema = mongoose.Schema

const email = new Schema({
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    sparse: true
  },
  cc: {
    type: String
  },
  bcc: {
    type: String
  },
  subject: {
    type: String
  },
  body: {
    type: String
  },
  messageId : {
    type: String
  }
}, {
    timestamps: true    // inserts createdAt and updatedAt
  })

module.exports = mongoose.model('email', email)
