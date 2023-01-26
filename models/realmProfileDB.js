const mongoose = require('mongoose')

const realmProfilerDB = mongoose.Schema({
    profileID: {type: String, required: true},
    name: {type: String, required: true},
    hackerCount: {type: Number, required: true},
  })

const model = mongoose.model('realmProfilerDB', realmProfilerDB)

module.exports = model;