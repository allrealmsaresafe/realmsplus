const mongoose = require('mongoose')

const userDB = new mongoose.Schema({
  userID: {type: String, required: true, unique: true},
  gamertag: {type: String, default: '0'},
  addCount: {type: Number, default: 0},
  reportCount: {type: Number, default: 0},
  basicPlan: {type: Boolean, required: true, default: false},
  arasPlan: {type: Boolean, required: true, default: false},
  arasPlusPlan: {type: Boolean, required: true, default: false},
  botBan: {type: Boolean, required: true, default: false},
  isAdmin: {type: Boolean, required: true, default: false},
})

const model = mongoose.model('userDB', userDB)

module.exports = model;