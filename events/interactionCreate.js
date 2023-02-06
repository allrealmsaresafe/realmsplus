// const { Events } = require('discord.js');
// const userDB = require('../models/userDB')
// const serverDB = require('../models/serverDB')
// const mongoose = require('mongoose')
// const reportDB = require('../models/reportDB')
// const hackerDB = require('../models/hackerDB')
// const realmProfileDB = require('../models/realmProfileDB')
// module.exports = {
// 	name: Events.InteractionCreate,
// 	once: false,
// 	async execute(interaction) {
//     			if (mongoose.connection.readyState != 1) return
//     let userData = await userDB.findOne({ userID: interaction.user.id })
//     if (!userData) {
//       newUser = await userDB.create({userID: interaction.user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(() => {
//       return
//     })
//       userData = await userDB.findOne({ userID: interaction.user.id })
//     }
//     let serverData = await serverDB.findOne({ serverID: interaction.guild.id })
//     if (!serverData) {
//       newServer = await serverDB.create({serverID: interaction.guild.id,whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch(() => {
//       return
//     })
//       serverData = await serverDB.findOne({ serverID: interaction.guild.id })
//     }
//     if (interaction.isButton()) {
//       if (interaction.customId === 'yes') {
//         const fixedID = interaction.message.content.toLowerCase().split('Report ID: ')
//         let reportData = await reportDB.findOne({ userID: fixedID[1].replaceAll('*', '') })
//         var realmProfile = await realmProfileDB.findOne({ name: reportData.realm })
//         if (!realmProfile) {
//         newProfile = await realmProfileDB.create({profileID: crypto.randomBytes(5).toString('hex'), name: reportData.realm, hackerCount: 0});newProfile.save().catch(() => {
//           return
//         })
//         }
//         const dbLog = {
//           color: 946466,
//           title: 'New entry in the Database',
//           description: 'A Realms+ admin added a new player to the Realms+ Hacker Database (RHD).',
//           fields: [
//             {
//               name: 'Author ID',
//               value: `${reportData.authorID}`,
//               inline: true,
//             },
//             {
//               name: 'Server ID',
//               value: `${reportData.serverID}`,
//               inline: true,
//             },
//             {
//               name: 'Gamertag',
//               value: `${reportData.gamertag}`,
//               inline: true,
//             },
//             {
//               name: 'XUID',
//               value: `${reportData.xuid}`,
//               inline: true,
//             },
//             {
//               name: 'Discord ID',
//               value: `${reportData.discordid}`,
//               inline: true,
//             },
//             {
//               name: 'Database ID',
//               value: `${reportData.dbid}`,
//               inline: true,
//             },
//             {
//               name: 'Realm',
//               value: `${reportData.realm}`,
//               inline: true,
//             },
//             {
//               name: 'Realm Profile ID',
//               value: `${realmProfile.profileID}`,
//               inline: true,
//             },
//             {
//               name: 'Reason',
//               value: `${reason}`,
//               inline: true,
//             },
//           ],
//           timestamp: new Date().toISOString(),
//           footer: {
//             text: `${process.env.FOOTER}`,
//             icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
//           },
//         };
//           await hackerDB.collection.insertOne({ 
//             gamertag: `${reportData.gamertag}`,
//             xuid: `${reportData.xuid}`,
//             discord: `${reportData.discordid}`,
//             dbid: `${reportData.dbid}`,
//             realm: `${reportData.realm}`,
//             reason: `${reportData.reason}`,
//             });
//             await realmProfileDB.collection.updateOne({profileID: realmProfile.profileID},{ 
//                $inc: {
//                  hackerCount: 1
//                }
//                });
//                await userData.collection.updateOne({userID: interaction.user.id},{ 
//                  $inc: {
//                    addCount: 1
//                  }
//                  });
//           const id2 = interaction.client.channels.cache.get(`1059559606222856202`)
//           const id = interaction.client.channels.cache.get(`1060345095347523644`)
//           id2.send({ embeds: [dbLog] }).catch(() => {
//             return
//           })
//           id.send({ embeds: [dbLog] }).catch(() => {
//             return
//           })
//           return await interaction.reply({ content: `<:yes:1070502230203039744> Successfully added **${reportData.gamertag}** to the Realms+ Hacker Database!`})
//     }
//     if (interaction.customId === 'no') {
//       interaction.message.delete().catch(() => {
//         return
//       })
//       return await interaction.reply({
//         content: `<:yes:1070502230203039744> Successfully declined the report!`,
//         ephemeral: true,
//       });
//     }
//     }
// 	},
// };