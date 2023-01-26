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
      newUser = await userDB.create({userID: guild.ownerId,hasPremium: false,reportCount: 0,botBan: false,isHacker: false,isAdmin: false});newUser.save()
      userData = await userDB.findOne({ userID: guild.ownerId })
    }
    let serverData = await serverDB.findOne({ serverID: guild.id })
    if (!serverData) {
      newServer = await serverDB.create({serverID: guild.id,whitelisted: false,discordBanModule: false,logsChannel: '0',hasPremium: false});newServer.save()
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
      
      id.send({ embeds: [joinEmbed] });
      return guild.leave()
    }
    if (guild.memberCount < 30 && !userData.isAdmin && !serverData.whitelisted) {
      if (guild.systemChannel) guild.systemChannel.send(`Sorry! For security reasons your server must have over 30 members to use RealmDB!`)
      const joinEmbed = {
        color: 946466,
        title: 'Unable to Join Guild',
        description: 'A server with less than 30 members just tried to invite me! Here is the information regarding it.',
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
      
      id.send({ embeds: [joinEmbed] });
      return guild.leave()
    }
    const joinEmbed = {
      color: 946466,
      title: 'Thanks for inviting RealmDB!',
      description: 'Please run `/help` if you need help!\nPlease make sure to also join our Support Server if you need more help:\nhttps://discord.gg/Q2ndaxNqVy',
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
      },
    };
    
    if (guild.systemChannel) guild.systemChannel.send({ embeds: [joinEmbed] });
    const joinLogEmbed = {
      color: 946466,
      title: 'Joined a new server!',
      description: `I was just invited to **${guild.name}** <t:${Math.trunc(Date.now() / 1000)}:R>! The owner of the server is **<@${guild.ownerId}>** and their id is **${guild.ownerId}**!`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
      },
    };
    id.send({ embeds: [joinLogEmbed] })
	},
};