const mongoose = require('mongoose')

const userDB = new mongoose.Schema({
  userID: {type: String, required: true, unique: true},
  xuid: {type: String, default: '0'}, //0 = no value
  email: {type: String, default: '0'}, //0 = no value
  accessToken: {type: String, default: '0'}, //0 = no value
  ownedRealms: {type: Array, default: [{realmID: '0', realmName: '0'}]}, //0 = no realms
  addCount: {type: Number, default: 0},
  reportCount: {type: Number, default: 0},
  botBan: {type: Boolean, required: true, default: false},
  isAdmin: {type: Boolean, required: true, default: false},
  databasePerms: {type: Boolean, required: true, default: false},
})

const model = mongoose.model('userDB', userDB)

module.exports = model;