const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose')
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const realmProfileDB = require('../models/realmProfileDB')
require('dotenv').config()
const { request } = require('undici');
const { authenticate } = require('@xboxreplay/xboxlive-auth')
const XboxLiveAPI = require('@xboxreplay/xboxlive-api')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Lookup a player based on a query.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('player')
                .setDescription('Find a Xbox User based on a query.')
                .addStringOption(option => option.setName('query').setDescription('The Gamertag or XUID.').setRequired(true)))
                .addSubcommand(subcommand =>
                  subcommand
                      .setName('realm')
                      .setDescription('Find a realm based on a query.')
                      .addStringOption(option => option.setName('query').setDescription('The Gamertag or XUID.').setRequired(true))),
	async execute(interaction) {
		try {
						if (mongoose.connection.readyState != 1) return await interaction.reply(`Database not connected! Run the command again in 5 seconds!`)
                        await interaction.deferReply({ content: `Loading <a:loading:1069385540077637742>`, ephemeral: true });
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
                        // if (userData.isAdmin || userData.basicPlan || userData.arasPlan || userData.arasPlusPlan ) {
                          if (interaction.options.getSubcommand() === 'player') {
                            const query = interaction.options.getString('query')
                            let hackerData = await hackerDB.findOne({ xuid: query })
                            let hackerData1 = await hackerDB.findOne({ gamertag: query })
                            if (hackerData) var discordID = hackerData.discord
                            if (hackerData1) var discordID = hackerData1.discord
                            if (!discordID) var discordID = 'N/A'
                            hackerData ? s = 'True' : s = 'False'
                            hackerData1 ? s = 'True' : s = 'False'
                            authenticate(`${process.env.EMAIL}`, `${process.env.PASSWORD}`)
                            .then(response => {
                                XboxLiveAPI.getPlayerSettings(
                                    `${query}`,
                                    {
                                        userHash: `${response.user_hash}`,
                                        XSTSToken: `${response.xsts_token}`,
                                    }, ['GameDisplayPicRaw', 'Gamerscore', 'Gamertag', 'XboxOneRep', 'Bio']
                                    ).then(async (settings) => {
                                      if (query.match(/^[0-9]+$/) != null) {
                                        XboxLiveAPI.getPlayerXUID(
                                          `${query}`, 
                                          {
                                              userHash: `${response.user_hash}`,
                                              XSTSToken: `${response.xsts_token}`,
                                          }
                                          ).then(async (xuid) => {
                                        let Gamertag = settings[2].value
                                        let GameDisplayPicRaw = settings[0].value
                                        let Gamerscore = parseInt(settings[1].value)
                                        let XboxOneRep = settings[3].value
                                        let Bio = settings[4].value
                                        Bio ? Bio = Bio : Bio = 'No Bio.'
                                        let altPercent = 0
                                        if (Gamerscore <= 600 && Gamerscore > 325) altPercent = 14.76
                                        if (Gamerscore <= 325 && Gamerscore > 200) altPercent = 36.98
                                        if (Gamerscore <= 200 && Gamerscore > 100) altPercent = 50.65
                                        if (Gamerscore <= 100 && Gamerscore > 50) altPercent = 87.75
                                        if (Gamerscore <= 50 && Gamerscore > 0) altPercent = 95.30
                                        if (Gamerscore === 0) altPercent = 99.99
                                      const finalEmbed = {
                                          color: 946466,
                                          title: `${Gamertag}`,
                                          description: `<:Bio:1069209492719419422> **Bio**: ${Bio}\n\n<:Gamertag:1069209163487526963> **Gamertag**: \`${Gamertag}\`\n<:Xuid:1069209594515177492> **XUID**: \`${xuid}\`\n<:Discord:1069209364386291793> **Discord ID**: \`${discordID}\`\n<:gamerscore:1069200591852683324> **Gamerscore**: \`${Gamerscore}\`\n<:hackerdatabase:1069207536395362434> **Currently In Hacker Database**: \`${s}\`\n<:Reputation:1069203712024776714> **Xbox Reputation**: \`${XboxOneRep}\`\n<:altdetect:1069203941973311519> **Alt-Detect AI**: \`${altPercent}% Accurate\``,
                                          thumbnail: {
                                            url: `${GameDisplayPicRaw}`,
                                          }, 
                                          timestamp: new Date().toISOString(),
                                          footer: {
                                            text: `${process.env.FOOTER}`,
                                            icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                                          },
                                        };
                                        await interaction.editReply({ content: `✅ Operation Successful!`, ephemeral: true });
                                        return await interaction.channel.send({ content: `Result found for **${interaction.user.tag}**!`, embeds: [finalEmbed] });
                                      })
                                      } else {
                                        XboxLiveAPI.getPlayerXUID(
                                          `${query}`, 
                                          {
                                              userHash: `${response.user_hash}`,
                                              XSTSToken: `${response.xsts_token}`,
                                          }
                                          ).then(async (xuid) => {
                                        let Gamertag = settings[2].value
                                        let GameDisplayPicRaw = settings[0].value
                                        let Gamerscore = parseInt(settings[1].value)
                                        let XboxOneRep = settings[3].value
                                        let Bio = settings[4].value
                                        Bio ? Bio = Bio : Bio = 'No Bio.'
                                        let altPercent = 0
                                        if (Gamerscore <= 600 && Gamerscore > 325) altPercent = 14.76
                                        if (Gamerscore <= 325 && Gamerscore > 200) altPercent = 36.98
                                        if (Gamerscore <= 200 && Gamerscore > 100) altPercent = 50.65
                                        if (Gamerscore <= 100 && Gamerscore > 50) altPercent = 87.75
                                        if (Gamerscore <= 50 && Gamerscore > 0) altPercent = 95.30
                                        if (Gamerscore === 0) altPercent = 99.99
                                      const finalEmbed = {
                                          color: 946466,
                                          title: `${Gamertag}`,
                                          description: `<:Bio:1069209492719419422> **Bio**: ${Bio}\n\n<:Gamertag:1069209163487526963> **Gamertag**: \`${Gamertag}\`\n<:Xuid:1069209594515177492> **XUID**: \`${xuid}\`\n<:Discord:1069209364386291793> **Discord ID**: \`${discordID}\`\n<:gamerscore:1069200591852683324> **Gamerscore**: \`${Gamerscore}\`\n<:hackerdatabase:1069207536395362434> **Currently In Hacker Database**: \`${s}\`\n<:Reputation:1069203712024776714> **Xbox Reputation**: \`${XboxOneRep}\`\n<:altdetect:1069203941973311519> **Alt-Detect AI**: \`${altPercent}% Accurate\``,
                                          thumbnail: {
                                            url: `${GameDisplayPicRaw}`,
                                          }, 
                                          timestamp: new Date().toISOString(),
                                          footer: {
                                            text: `${process.env.FOOTER}`,
                                            icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                                          },
                                        };
                                        await interaction.editReply({ content: `✅ Operation Successful!`, ephemeral: true });
                                        return await interaction.channel.send({ content: `Result found for **${interaction.user.tag}**!`, embeds: [finalEmbed] });
                                      })
                                      }
                                }).catch(async (error) => {
                                  const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
                                  await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Lookup Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
                                  console.log(error)
                                    return await interaction.editReply({content: `Invalid Query! I couldn't find that player!`, ephemeral: true})
                                })
                            })
                          }
                          if (interaction.options.getSubcommand() === 'realm') {
                            const query = interaction.options.getString('query')
                            let realmData = await realmProfileDB.findOne({ xuid: query })
                            if (realmData) var realmProfileID = realmData.profileID;hackerCount = realmData.hackerCount
                            if (!realmData) var realmProfileID = 'N/A';var hackerCount = 'N/A'
                            authenticate(`${process.env.EMAIL}`, `${process.env.PASSWORD}`)
                            .then(response => {
                                XboxLiveAPI.getPlayerSettings(
                                    `${query}`,
                                    {
                                        userHash: `${response.user_hash}`,
                                        XSTSToken: `${response.xsts_token}`,
                                    }, ['GameDisplayPicRaw', 'Gamerscore', 'Gamertag', 'XboxOneRep', 'Bio']
                                    ).then(async (settings) => {
                                      if (query.match(/^[0-9]+$/) != null) {
                                        XboxLiveAPI.getPlayerXUID(
                                          `${query}`, 
                                          {
                                              userHash: `${response.user_hash}`,
                                              XSTSToken: `${response.xsts_token}`,
                                          }
                                          ).then(async (xuid) => {
                                        let Gamertag = settings[2].value
                                        let GameDisplayPicRaw = settings[0].value
                                        let Gamerscore = parseInt(settings[1].value)
                                        let XboxOneRep = settings[3].value
                                        let Bio = settings[4].value
                                        Bio ? Bio = Bio : Bio = 'No Bio.'
                                        let altPercent = 0
                                        if (Gamerscore <= 1500 && Gamerscore > 600) altPercent = 5.23
                                        if (Gamerscore <= 600 && Gamerscore > 325) altPercent = 14.76
                                        if (Gamerscore <= 325 && Gamerscore > 200) altPercent = 36.98
                                        if (Gamerscore <= 200 && Gamerscore > 100) altPercent = 50.65
                                        if (Gamerscore <= 100 && Gamerscore > 50) altPercent = 87.75
                                        if (Gamerscore <= 50 && Gamerscore > 0) altPercent = 95.30
                                        if (Gamerscore === 0) altPercent = 99.99
                                      const finalEmbed = {
                                          color: 946466,
                                          title: `${Gamertag}`,
                                          description: `<:Bio:1069209492719419422> **Bio**: ${Bio}\n\n<:Gamertag:1069209163487526963> **Gamertag**: \`${Gamertag}\`\n<:Xuid:1069209594515177492> **XUID**: \`${xuid}\`\n<:Discord:1069209364386291793> **Discord ID**: \`${discordID}\`\n<:gamerscore:1069200591852683324> **Gamerscore**: \`${Gamerscore}\`\n<:hackerdatabase:1069207536395362434> **Currently In Hacker Database**: \`${s}\`\n<:Reputation:1069203712024776714> **Xbox Reputation**: \`${XboxOneRep}\`\n<:altdetect:1069203941973311519> **Alt-Detect AI**: \`${altPercent}% Accurate\``,
                                          thumbnail: {
                                            url: `${GameDisplayPicRaw}`,
                                          }, 
                                          timestamp: new Date().toISOString(),
                                          footer: {
                                            text: `${process.env.FOOTER}`,
                                            icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                                          },
                                        };
                                        await interaction.editReply({ content: `✅ Operation Successful!`, ephemeral: true });
                                        return await interaction.channel.send({ content: `Result found for **${interaction.user.tag}**!`, embeds: [finalEmbed] });
                                      })
                                      }
                                }).catch(async (error) => {
                                  console.log(error)
                                    return await interaction.editReply({content: `Invalid Query! I couldn't find that player!`, ephemeral: true})
                                })
                            })
                          }
                        // } else {
                        //     return await interaction.editReply({content: `Sorry! This is a Premium Feature!\n\n**How to get access**\nTo get access to this command you need to subscribe to the Basic Plan or higher!`, ephemeral: true})
                        // }
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Lookup Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};