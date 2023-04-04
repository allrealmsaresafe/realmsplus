const { Events } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const mongoose = require('mongoose')
module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(guild) {
    try {
    			if (mongoose.connection.readyState != 1) return
    const id = await guild.client.channels.fetch(`1060345116000268428`)
    let userData = await userDB.findOne({ userID: guild.ownerId })
    if (!userData) {
      newUser = await userDB.create({userID: guild.ownerId,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch((error) => {
                        return console.log(error)
                      })
      userData = await userDB.findOne({ userID: guild.ownerId })
    }
    let serverData = await serverDB.findOne({ serverID: guild.id })
    if (!serverData) {
      newServer = await serverDB.create({serverID: guild.id,discordBanModule: false, logsChannel: '0',});newServer.save().catch((error) => {
                        return console.log(error)
                      })
      serverData = await serverDB.findOne({ serverID: guild.id })
    }
    const leaveLogEmbed = {
      color: 946466,
      title: 'Left a server!',
      description: `I was either kicked from or left **${guild.name}** <t:${Math.trunc(Date.now() / 1000)}:R>! The owner of the server was **<@${guild.ownerId}>** and their id is **${guild.ownerId}**!`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
      },
    };
    return id.send({ embeds: [leaveLogEmbed] })
  } catch (error) {
    const errorChannel = await message.client.channels.fetch('1086347050838401074')
    if (interaction.channel) await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **Can't get Guild Name**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **guildDelete event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
    console.log(error)
  }
	},
};