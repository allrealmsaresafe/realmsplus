const mongoose = require('mongoose')

const serverDB = new mongoose.Schema({
  serverID: {type: String, unique: true},
  whitelisted: {type: Boolean, default: false},
  discordBanModule: {type: Boolean, default: false},
  logsChannel: {type: String, default: '0'},
  hasPremium: {type: Boolean, default: false},
})

const model = mongoose.model('serverDB', serverDB)

module.exports = model;