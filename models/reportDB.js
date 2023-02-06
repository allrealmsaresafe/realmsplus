const mongoose = require('mongoose')

const reportDB = mongoose.Schema({
    serverID: {type: String, required: true},
    authorID: {type: String, required: true},
    gamertag: {type: String, required: true},
    xuid: {type: String, required: true},
    discord: {type: String, required: true},
    dbid: {type: String, required: true},
    realm: {type: String, required: true},
    reason: {type: String, required: true},
    proof: {type: String, required: true},
    reportID: {type: String, required: true},
  })

const model = mongoose.model('reportDB', reportDB)

module.exports = model;