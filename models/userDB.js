const mongoose = require('mongoose')

const userDB = new mongoose.Schema({
  userID: {type: String, required: true, unique: true},
  botBan: {type: Boolean, required: true, default: false},
  isHacker: {type: Boolean, required: true, default: false},
  isAdmin: {type: Boolean, required: true, default: false},
})

const model = mongoose.model('userDB', userDB)

module.exports = model;