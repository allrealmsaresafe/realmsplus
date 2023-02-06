require('dotenv').config()
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!serverwhitelist\` is a command that allows for a server to be whitelisted from the effects of the Security Measures put in place to prevent server botting.\n\nSyntax: !serverwhitelist <server-id>`)
    let userData = await userDB.findOne({ userID: message.author.id })
    if (userData === null) {
      newUser = await userDB.create({userID: message.author.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false});newUser.save().catch()
      userData = await userDB.findOne({ userID: message.author.id })
    }
    if (!userData.isAdmin) return
    let serverData = await serverDB.findOne({ serverID: args.toString().replaceAll(' ', '') })
    if (serverData === null) {
      newServer = await serverDB.create({serverID: args.toString().replaceAll(' ', ''),whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch()
      serverData = await serverDB.findOne({ serverID: args.toString().replaceAll(' ', '') })
    }
    if (serverData.whitelisted) return message.reply('This server is already whitelisted!')
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const whitelistLog = {
        color: 946466,
        title: 'New server whitelisted',
        description: `Someone whitelisted a guild.`,
        fields: [
          {
            name: 'Author ID',
            value: `${message.author.id}`,
            inline: true,
          },
          {
            name: 'Server ID',
            value: `${message.guild.id}`,
            inline: true,
          },
          {
            name: 'Target Guild ID',
            value: `${args.toString().replaceAll(' ', '')}`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
        },
      };
      id.send({ embeds: [whitelistLog] });
      message.reply(`<:yes:1070502230203039744> Successfully whitelisted the guild with the ID: **${args.toString().replaceAll(' ', '')}**!`)
      await serverDB.findOneAndUpdate({
        serverID: args.toString().replaceAll(' ', '')
    }, {
        $set: {
            whitelisted: true,
        }
    })
  };