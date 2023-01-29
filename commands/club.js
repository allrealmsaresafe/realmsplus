const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose')
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
require('dotenv').config()
const XboxLiveAPI = require('@xboxreplay/xboxlive-api')
const { Authflow } = require('prismarine-auth')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('club')
		.setDescription('Interact with your club.'),
	async execute(interaction) {
		try {
						if (mongoose.connection.readyState != 1) return await interaction.reply(`Database not connected! Run the command again in 5 seconds!`)
                        await interaction.deferReply({ ephemeral: true });
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
                        if (userData.isAdmin || userData.basicPlan || userData.arasPlan || userData.arasPlusPlan ) {
                          return await interaction.editReply({content: `This command is not done yet! Try again later!`, ephemeral: true})
                            // const flow = new Authflow()
                            // flow.getXboxToken().then(async (response) => {
                            //   return console.log(response)
                            //   // if (!response.XSTSToken) return await interaction.editReply({content: `${response}`, ephemeral: true})
                            //   // return await interaction.reply({content: `Operation Successful!\n\nLinked ${interaction.user.tag} to ${response.}`, ephemeral: true})
                            // })
                        } else {
                            return await interaction.editReply({content: `Sorry! This is a Premium Feature!\n\n**How to get access**\nTo get access to this command you need to subscribe to the ARAS Plan or higher!`, ephemeral: true})
                        }
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **XUID Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};