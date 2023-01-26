const mongoose = require('mongoose')

const discordDB = mongoose.Schema({
    userID: {type: String, unique: true, required: true},
    dbid: {type: String, unique: true, required: true},
    reason: {type: String, required: true},
  })

const model = mongoose.model('discordDB', discordDB)

module.exports = model;