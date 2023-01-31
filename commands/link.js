const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose')
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const realmProfileDB = require('../models/realmProfileDB')
require('dotenv').config()
const { live } = require('@xboxreplay/xboxlive-auth')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Links your xbox account to Realms+.'),
	async execute(interaction) {
		try {
      if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,botBan: false,isAdmin: false});newUser.save()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
            let serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            if (!serverData) {
              newServer = await serverDB.create({serverID: interaction.guild.id,whitelisted: false,discordBanModule: false,logsChannel: '0',gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false});newServer.save()
              serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            }
            const { Authflow } = require('prismarine-auth') 
            const { RealmAPI } = require('prismarine-realms')

            const authflow = new Authflow()

            const api = RealmAPI.from(authflow, 'bedrock')
    } catch (error) {
      const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
      await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Realm Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
          console.log(error)
    }
  }
}