const mongoose = require('mongoose')

const realmProfilerDB = mongoose.Schema({
    profileID: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    hackerCount: {type: String, required: true},
  })

const model = mongoose.model('realmProfilerDB', realmProfilerDB)

module.exports = model;