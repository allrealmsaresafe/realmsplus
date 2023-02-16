const { Events } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const mongoose = require('mongoose')
module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute(guild) {
    			if (mongoose.connection.readyState != 1) return
    const id = await guild.client.channels.fetch(`1060345116000268428`)
    let userData = await userDB.findOne({ userID: guild.ownerId })
    if (!userData) {
      newUser = await userDB.create({userID: guild.ownerId,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(() => {
      return
    })
      userData = await userDB.findOne({ userID: guild.ownerId })
    }
    let serverData = await serverDB.findOne({ serverID: guild.id })
    if (!serverData) {
      newServer = await serverDB.create({serverID: guild.id,whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch(() => {
      return
    })
      serverData = await serverDB.findOne({ serverID: guild.id })
    }
    if (userData.botBan || serverData.botBan) {
      const joinEmbed = {
        color: 946466,
        title: 'Unable to Join Guild',
        description: 'A blacklisted user/server just tried to invite me! Here is the information regarding it.',
        fields: [
          {
            name: 'Owner ID',
            value: `${guild.ownerId}`,
          },
          {
            name: 'Guild ID',
            value: `${guild.id}`,
            inline: false,
          },
          {
            name: 'Guild Name',
            value: `${guild.name}`,
            inline: false,
          },
          {
            name: 'Member Count',
            value: `${guild.memberCount}`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
        },
      };
      
      id.send({ embeds: [joinEmbed] }).catch(() => {
      return
    })
      return guild.leave().catch(() => {
      return
    })
    }
    // if (guild.memberCount < 30 && !userData.isAdmin && !serverData.whitelisted) {
    //   if (guild.systemChannel) guild.systemChannel.send(`Sorry! For security reasons your server must have over 30 members to use Realms+!`)
    //   const joinEmbed = {
    //     color: 946466,
    //     title: 'Unable to Join Guild',
    //     description: 'A server with less than 30 members just tried to invite me! Here is the information regarding it.',
    //     fields: [
    //       {
    //         name: 'Owner ID',
    //         value: `${guild.ownerId}`,
    //       },
    //       {
    //         name: 'Guild ID',
    //         value: `${guild.id}`,
    //         inline: false,
    //       },
    //       {
    //         name: 'Guild Name',
    //         value: `${guild.name}`,
    //         inline: false,
    //       },
    //       {
    //         name: 'Member Count',
    //         value: `${guild.memberCount}`,
    //         inline: true,
    //       },
    //     ],
    //     timestamp: new Date().toISOString(),
    //     footer: {
    //       text: `${process.env.FOOTER}`,
    //       icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
    //     },
    //   };
      
    //   id.send({ embeds: [joinEmbed] })
    //   return guild.leave()
    // }
    const joinEmbed = {
      color: 946466,
      title: 'Thanks for inviting Realms+!',
      description: 'Please run `/help` if you need help!\nPlease make sure to also join our Support Server if you need more help:\nhttps://discord.gg/Q2ndaxNqVy',
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
      },
    };
    
    if (guild.systemChannel) guild.systemChannel.send({ embeds: [joinEmbed] }).catch(() => {
      return
    })
    const joinLogEmbed = {
      color: 946466,
      title: 'Joined a new server!',
      description: `I was just invited to **${guild.name}**・**${guild.id}** <t:${Math.trunc(Date.now() / 1000)}:R>! The owner of the server is **<@${guild.ownerId}>** and their id is **${guild.ownerId}**! The server has **${guild.memberCount}** members!`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
      },
    };
    id.send({ embeds: [joinLogEmbed] }).catch((error) => {
      return
    })
	},
};