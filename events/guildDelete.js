const { Events } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const mongoose = require('mongoose')
module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(guild) {
    			if (mongoose.connection.readyState != 1) return
    const id = await guild.client.channels.fetch(`1060345116000268428`)
    let userData = await userDB.findOne({ userID: guild.ownerId })
    if (!userData) {
      newUser = await userDB.create({userID: guild.ownerId,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save()
      userData = await userDB.findOne({ userID: guild.ownerId })
    }
    let serverData = await serverDB.findOne({ serverID: guild.id })
    if (!serverData) {
      newServer = await serverDB.create({serverID: guild.id,whitelisted: false,discordBanModule: false,logsChannel: '0',gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false});newServer.save()
      serverData = await serverDB.findOne({ serverID: guild.id })
    }
    const leaveLogEmbed = {
      color: 946466,
      title: 'Left a server!',
      description: `I was either kicked from or left **${guild.name}** <t:${Math.trunc(Date.now() / 1000)}:R>! The owner of the server was **<@${guild.ownerId}>** and their id is **${guild.ownerId}**!`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
      },
    };
    id.send({ embeds: [leaveLogEmbed] })
	},
};