const { Events } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const discordDB = require('../models/discordDB')
const mongoose = require('mongoose')
module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(guildMember) {
    try {
    if (mongoose.connection.readyState != 1) return
    let userData = await userDB.findOne({ userID: guildMember.id })
    if (!userData) {
      newUser = await userDB.create({userID: guildMember.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(() => {
      return
    })
      userData = await userDB.findOne({ userID: guildMember.id })
    }
    let discordUser = await discordDB.findOne({ userID: guildMember.id })
    let serverData = await serverDB.findOne({ serverID: guildMember.guild.id })
    if (!serverData) {
      newServer = await serverDB.create({serverID: guildMember.guild.id,whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch(() => {
      return
    })
      serverData = await serverDB.findOne({ serverID: guildMember.guild.id })
    }
    
    if (serverData.discordBanModule && discordUser) {
      let user = await guildMember.client.users.fetch(`${guildMember.id}`)
        if (serverData.logsChannel) {
            const banLog = {
                color: 946466,
                title: `New user banned from ${guildMember.guild.name}!`,
                description: `The user \`${user.tag}\`・\`${guildMember.id}\` was found in the Realms+ Discord User Database and has been automatically banned from this server.\nmore infromation regarding it will be below.`,
                fields: [
                  {
                    name: 'User Tag',
                    value: `${user.tag}`,
                    inline: true,
                  },
                  {
                    name: 'User ID',
                    value: `${guildMember.id}`,
                    inline: true,
                  },
                  {
                    name: 'Database ID',
                    value: `${discordUser.dbid}`,
                    inline: true,
                  },
                  {
                    name: 'Reason',
                    value: `Found in Realms+ Discord User Database. For [${discordUser.reason}]`,
                    inline: true,
                  },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                  text: `${process.env.FOOTER}`,
                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                },
              };
              const channel = guildMember.client.channels.cache.get(`${serverData.logsChannel}`)
              channel.send({ embeds: [banLog] })
        }
        return guildMember.guild.members.ban(guildMember);
    }
  } catch (error) {
    const errorChannel = await message.client.channels.fetch('1060347445722230867')
    await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **Can't get Guild Name**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **guildMemberAdd event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
    console.log(error)
  }
	},
};