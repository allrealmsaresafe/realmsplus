const { Events, ActivityType } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const mongoose = require('mongoose')
require('dotenv').config()
module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
    try {
      if (mongoose.connection.readyState != 1) return
      const id = await message.client.channels.fetch(`1060345095347523644`)
      let userData = await userDB.findOne({ userID: message.author.id })
      if (!userData) {
        newUser = await userDB.create({userID: message.author.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(() => {
      return
    })
        userData = await userDB.findOne({ userID: message.author.id })
      }
      if (message.author.bot || userData.botBan) return
      let serverData = await serverDB.findOne({ serverID: message.guild.id })
      if (!serverData) {
        newServer = await serverDB.create({serverID: message.guild.id,whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch(() => {
      return
    })
        serverData = await serverDB.findOne({ serverID: message.guild.id })
      }
            message.client.user.setPresence({
          activities: [{ name: `${message.client.guilds.cache.size} servers!`, type: ActivityType.Watching }],
          status: 'online',
        });
        if (userData.isAdmin) {
      const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd = message.client.prefixcommands.get(command);
      if (!cmd) return;
      cmd.run(message, args);
      return
        }
  } catch (error) {
    const errorChannel = await message.client.channels.fetch('1060347445722230867')
    await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **Can't get Guild Name**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **messageCreate event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
    console.log(error)
  }
	},
};