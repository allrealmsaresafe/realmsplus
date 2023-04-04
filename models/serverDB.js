const mongoose = require('mongoose')

const serverDB = new mongoose.Schema({
  //basic server information
  serverID: {type: String, unique: true},
  isBlacklisted: {type: Boolean, default: false},
  addCount: {type: Number, default: 0},
  //discord server modules
  discordBanModule: {type: Boolean, default: false},
  logsChannel: {type: String, default: '0'},
  // //realm modules
  // realmChatRelay: {type: Boolean, default: false},
  // autobanFromDB: {type: Boolean, default: false},
  // automod: {type: Boolean, default: false},
  // //realm configs
  // configs: {type: Array, default: [{ banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}]}, //if 0 not added, if any other number its a channel id
  // //commands
  // banCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]}, //404 = default to owner only can run cmd, if any other number its a role id
  // kickCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // statusCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // playersCommand: {type: Array, default: [{ permission: ['0'], enabled: true}]},
  // editCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // worldCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // moduleCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // permissionsCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // consoleCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // automodCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  // botCommand: {type: Array, default: [{ permission: ['404'], enabled: true}]},
  //   //realm stuff
  //   realmID: {type: Array, default: [{ realmID: '0', name: '0'}]}, //0 = not connected, when linked, will update to realm IDs
  //   botConnected: {type: Boolean, default: false},
  //   realmStatus: {type: Array, default: [{ realmID: '0', status: '0'}]},
  //   realmBans: {type: Array, default: [{ realmID: '0', banCount: '0'}]},
  //   realmKicks: {type: Array, default: [{ realmID: '0', kickCount: '0'}]},
  //   realmOperators: {type: Array, default: [{ realmID: '0', operators: ['0']}]}, //0 = none, their xuids will be placed in each string
  //   automodLogic: {type: Array, default: [{ realmID: '0', logic: '0'}]}, //0 = no logic, 1 = preset 1, 2 = preset 2, etc.
})

const model = mongoose.model('serverDB', serverDB)

module.exports = model;

