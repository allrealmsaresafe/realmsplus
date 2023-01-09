const mongoose = require('mongoose')

const serverDB = new mongoose.Schema({
  serverID: {type: String, required: true, unique: true},
  botBan: {type: Boolean, required: true, default: false},
  isAdmin: {type: Boolean, required: true, default: false},
  hasPremium: {type: Boolean, required: true, default: false},
})

const model = mongoose.model('serverDB', serverDB)

module.exports = model;