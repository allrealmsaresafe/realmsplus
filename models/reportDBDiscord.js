const mongoose = require('mongoose')

const reportDBDiscord = mongoose.Schema({
    serverID: {type: String, required: true},
    authorID: {type: String, required: true},
    discordid: {type: String, required: true},
    dbid: {type: String, required: true},
    reason: {type: String, required: true},
    proof: {type: String, required: true},
    reportID: {type: String, required: true},
  })

const model = mongoose.model('reportDBDiscord', reportDBDiscord)

module.exports = model;