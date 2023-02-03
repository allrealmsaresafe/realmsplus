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
        newUser = await userDB.create({userID: message.author.id,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save().catch()
        userData = await userDB.findOne({ userID: message.author.id })
      }
      if (message.author.bot || userData.botBan) return
      let serverData = await serverDB.findOne({ serverID: message.guild.id })
      if (!serverData) {
        newServer = await serverDB.create({serverID: message.guild.id,whitelisted: false,discordBanModule: false,logsChannel: '0',gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false});newServer.save()
        serverData = await serverDB.findOne({ serverID: message.guild.id })
      }
            message.client.user.setPresence({
          activities: [{ name: `${message.client.guilds.cache.size} servers!`, type: ActivityType.Watching }],
          status: 'online',
        });
        if (userData.isAdmin) {
      // const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
      // const command = args.shift().toLowerCase();
      // const cmd = message.client.prefixcommands.get(command);
      // if (!cmd) return;
      // cmd.run(message, args);
      // return
        }
  } catch (error) {
    const errorChannel = await message.client.channels.fetch('1060347445722230867')
    await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **Can't get Guild Name**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **messageCreate event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
    console.log(error)
  }
	},
};