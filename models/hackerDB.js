const mongoose = require('mongoose')

const hackerDB = mongoose.Schema({
    gamertag: {type: String, unique: true, required: true},
    xuid: {type: String, required: true},
    dbid: {type: String, unique: true, required: true},
    discord: {type: String, required: true},
    realm: {type: String, required: true},
    reason: {type: String, required: true},
  })

const model = mongoose.model('hackerDB', hackerDB)

module.exports = model;