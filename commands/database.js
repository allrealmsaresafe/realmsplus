const { ActivityType, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const crypto = require("crypto");
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const mongoose = require('mongoose')
const hackerDB = require('../models/hackerDB')
const discordDB = require('../models/discordDB')
const realmProfileDB = require('../models/realmProfileDB')
const reportDB = require('../models/reportDB')
const reportDBDiscord = require('../models/reportDBDiscord')
const profileIDGenerator = crypto.randomBytes(7).toString('hex')
const dbid = crypto.randomBytes(15).toString('hex')
const discordDbidGen = crypto.randomBytes(20).toString('hex')
require('dotenv').config()
const { authenticate } = require('@xboxreplay/xboxlive-auth')
const XboxLiveAPI = require('@xboxreplay/xboxlive-api')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Allows for interacting with the database.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Search the database.')
                .addStringOption(option => option.setName('database').setDescription('The database you want to search.').addChoices(
                  { name: 'Realm Hacker Database', value: 'realm' },
                  { name: 'Discord User Database', value: 'discord' },
                ).setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
          .setName('report')
          .setDescription('Report a player.')
          .addAttachmentOption(option => option.setName('proof').setDescription('The proof for this report.').setRequired(true))
          .addStringOption(option => option.setName('database').setDescription('The database you want to report to.').addChoices(
            { name: 'Realm Hacker Database', value: 'realm' },
            { name: 'Discord User Database', value: 'discord' },
          ).setRequired(true)))
          .addSubcommand(subcommand =>
          subcommand
        .setName('add')
        .setDescription('Add a player.')
        .addStringOption(option => option.setName('database').setDescription('The database you want to add to.').addChoices(
          { name: 'Realm Hacker Database', value: 'realm' },
          { name: 'Discord User Database', value: 'discord' },
        ).setRequired(true)))
        .addSubcommand(subcommand =>
        subcommand
          .setName('remove')
          .setDescription('Remove a player.')
          .addStringOption(option => option.setName('database-id').setDescription('The Database ID.').setRequired(true))
          .addStringOption(option => option.setName('database').setDescription('The database you want to remove from.').addChoices(
            { name: 'Realm Hacker Database', value: 'realm' },
            { name: 'Discord User Database', value: 'discord' },
          ).setRequired(true)))
          .addSubcommand(subcommand =>
            subcommand
          .setName('leaderboard')
          .setDescription('Display the leaderboard.')
          .addStringOption(option => option.setName('type').setDescription('The type of leaderboard you want to display.').addChoices(
            { name: 'Realm Leaderboard', value: 'realm' },
            { name: 'Report Leaderboard', value: 'user' },
            { name: 'Admin Leaderboard', value: 'admin' },
            // { name: 'Server Leaderboard', value: 'server' },
            // { name: 'Most Recent Added Hackers', value: 'recent' },
          ).setRequired(true))),
	async execute(interaction) {
        try {
            // return await interaction.reply(`This command is undergoing development! Try again later!`)
            if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
            const id = interaction.client.channels.cache.get(`1060345095347523644`)
            let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(error => {
              return console.log(error)
            })
            userData = await userDB.findOne({ userID: interaction.user.id })
            }
            let serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            if (!serverData) {
              newServer = await serverDB.create({serverID: interaction.guild.id,whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch(error => {
              return console.log(error)
            })
            serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            }
            if (interaction.options.getSubcommand() === 'add') {
                // return await interaction.reply(`This command is undergoing development! Try again later!`)
                if (!userData.databasePerms) return await interaction.reply({ content: `Invalid Permission! You can not add to the database!\nInstead make a report with \`/database report\`.`, ephemeral: true })
                const databaseType = interaction.options.getString('database')
                if (databaseType === 'realm') {
                  const addModal = new ModalBuilder()
                  .setCustomId('addModal')
                  .setTitle('Add a player to the Hacker Database')
                  const gamertagInput = new TextInputBuilder()
                  .setCustomId('gamertagInput')
                  .setLabel("The player's gamertag")
                  .setStyle(TextInputStyle.Short)
                  .setMaxLength(17)
                  .setMinLength(1)
                  .setPlaceholder('Example: MinteeMilk')
                  .setRequired(true)
                  const discordIdInput = new TextInputBuilder()
                  .setCustomId('discordIdInput')
                  .setLabel("The player's Discord ID")
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(10)
                  .setPlaceholder('Example: 1038878247519277066')
                  .setRequired(false);
                  const realmInput = new TextInputBuilder()
                  .setCustomId('realmInput')
                  .setLabel("The realm")
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder('Example: Rebirth Vanilla Anarchy')
                  .setRequired(false)
                  const reasonInput = new TextInputBuilder()
                  .setCustomId('reasonInput')
                  .setLabel("The reason")
                  .setStyle(TextInputStyle.Paragraph)
                  .setMinLength(3)
                  .setPlaceholder('Example: CBE, Crashing, Illegal Items')
                  .setRequired(true)
              const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
              const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
              const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
              const actionRow4 = new ActionRowBuilder().addComponents(reasonInput);
              addModal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4);
              await interaction.showModal(addModal).catch((error) => {return console.log(error)})
              const submitted = await interaction.awaitModalSubmit({
                                time: 99999,
                                filter: i => i.user.id === interaction.user.id && i.customId === 'addModal',
                              }).catch(error => {
                                console.error(error)
                                return null
                              })
                              if (submitted) {
                                const gamertag = submitted.fields.getTextInputValue('gamertagInput');
                                let discordid = submitted.fields.getTextInputValue('discordIdInput');
                                let realm = submitted.fields.getTextInputValue('realmInput');
                                const reason = submitted.fields.getTextInputValue('reasonInput');
                                if (discordid) {
                                  let discordUser = await discordDB.findOne({ userID: discordid })
                                  if (!discordUser) {
                                    newUser = await discordDB.create({userID: discordid,dbid: discordDbidGen,reason: `Realm Hacking [${reason}]`});newUser.save().catch((error) => {return console.log(error)})
                                    discordUser = await discordDB.findOne({ userID: discordid })
                                  }

                                } else {
                                  discordid = `N/A`
                                }
                                if (!realm) realm = `N/A`
                                authenticate(`${process.env.EMAIL}`, `${process.env.PASSWORD}`)
                                .then(response => {
                                  XboxLiveAPI.getPlayerXUID(
                                    `${gamertag}`, 
                                    {
                                        userHash: `${response.user_hash}`,
                                        XSTSToken: `${response.xsts_token}`,
                                    }
                                    ).then(async (xuid) => {
                                      if (realm) {
                                        var realmProfile = await realmProfileDB.findOne({ name: realm })
                                        if (!realmProfile) {
                                          let newProfile = await realmProfileDB.create({profileID: profileIDGenerator, name: realm, hackerCount: 0})
                                          newProfile.save().catch((error) => {
                                          return console.log(error)
                                        })
                                      }
                                        realmProfile = await realmProfileDB.findOne({ name: realm })
                                      }
                                      if (!xuid) xuid = 'N/A'
                                      const inDB = await hackerDB.findOne({gamertag: gamertag})
                                      if (inDB) return await submitted.reply({content: `The user with the gamertag: **${gamertag}** is already in the database!`, ephemeral: true})
                                      const databaseEmbed = {
                                        color: 946466,
                                        title: 'Player added to the Hacker Database',
                                        description: 'A new player was just added to the Hacker Database.',
                                        fields: [
                                          {
                                            name: 'Gamertag',
                                            value: `\`${gamertag}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'XUID',
                                            value: `\`${xuid}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Discord ID',
                                            value: `\`${discordid}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Database ID',
                                            value: `\`${dbid}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Realm',
                                            value: `\`${realm}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Realm Profile ID',
                                            value: `\`${realmProfile.profileID}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Reason',
                                            value: `\`${reason}\``,
                                            inline: true,
                                          },
                                        ],
                                        timestamp: new Date().toISOString(),
                                        footer: {
                                          text: `${process.env.FOOTER}`,
                                          icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                                        },
                                      };
                                    const dbLog = {
                                        color: 946466,
                                        title: 'New entry in the Database',
                                        description: 'A Realms+ admin added a new player to the Hacker Database.',
                                        fields: [
                                          {
                                            name: 'Author ID',
                                            value: `\`${interaction.user.id}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Server ID',
                                            value: `\`${interaction.guild.id}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Gamertag',
                                            value: `\`${gamertag}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'XUID',
                                            value: `\`${xuid}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Discord ID',
                                            value: `\`${discordid}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Database ID',
                                            value: `\`${dbid}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Realm',
                                            value: `\`${realm}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Realm Profile ID',
                                            value: `\`${realmProfile.profileID}\``,
                                            inline: true,
                                          },
                                          {
                                            name: 'Reason',
                                            value: `\`${reason}\``,
                                            inline: true,
                                          },
                                        ],
                                        timestamp: new Date().toISOString(),
                                        footer: {
                                          text: `${process.env.FOOTER}`,
                                          icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                                        },
                                      };
                                      await hackerDB.collection.insertOne({
                                        gamertag: `${gamertag}`,
                                        xuid: `${xuid}`,
                                        discord: `${discordid}`,
                                        dbid: `${dbid}`,
                                        realm: `${realm}`,
                                        reason: `${reason}`,
                                        }).catch((error) => {
                                          return console.log(error)
                                        })
                                          await realmProfileDB.collection.updateOne({profileID: realmProfile.profileID},{ 
                                             $inc: {
                                               hackerCount: 1
                                             }
                                             }).catch((error) => {
                                              return console.log(error)
                                            })
                                             await userData.collection.updateOne({userID: interaction.user.id},{ 
                                               $inc: {
                                                 addCount: 1
                                               }
                                               }).catch((error) => {
                                                return console.log(error)
                                              })
                                          const id2 = interaction.client.channels.cache.get(`1059559606222856202`)
                                          id2.send({ embeds: [databaseEmbed] }).catch((error) => {
                                             return console.log(error)
                                           })
                                          id.send({ embeds: [dbLog] }).catch((error) => {
                                           return console.log(error)
                                         })
                                    })
                                  })
                                  return await submitted.reply({
                                    content: `<:yes:1070502230203039744> Successfully added **${gamertag}** to the Hacker Database!`,
                                    ephemeral: true
                                  }).catch((error) => {
                                   return console.log(error)
                                 })
                              }
                }
                if (databaseType === 'discord') {
                  if (!userData.databasePerms) return await interaction.followUp({ content: `Invalid Permission! You can not add to the Realms+ Discord User Database (RDUD)!`, ephemeral: true})
                    const discordAddModal = new ModalBuilder()
                    .setCustomId('discordAddModal')
                    .setTitle('Add a user to the Discord User Database');
                    const discordIdInput = new TextInputBuilder()
                    .setCustomId('discordIdInput')
                    .setLabel("The user's Discord ID")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(7)
                    .setPlaceholder('Example: 482303014128844800')
                    .setRequired(false);
                    const reasonInput = new TextInputBuilder()
                    .setCustomId('reasonInput')
                    .setLabel("The reason")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(3)
                    .setPlaceholder('Example: Racial Slurs')
                    .setRequired(true);
                const actionRow1 = new ActionRowBuilder().addComponents(discordIdInput);
                const actionRow2 = new ActionRowBuilder().addComponents(reasonInput);
                discordAddModal.addComponents(actionRow1, actionRow2);
                await interaction.showModal(discordAddModal);
                const submitted = await interaction.awaitModalSubmit({
                  time: 99999,
                  filter: i => i.user.id === interaction.user.id && i.customId === 'discordAddModal'
                }).catch(error => {
                  console.error(error)
                  return null
                })
                if (submitted) {
                  const discordID = submitted.fields.getTextInputValue('discordIdInput');
                  const reason = submitted.fields.getTextInputValue('reasonInput');
                  if (discordID) {
                    var user = await interaction.client.users.fetch(`${discordID}`).catch(async (error) => {
                    return await submitted.reply({content: `Couldn't find a user with the Discord ID of: **${discordID}**!`, ephemeral: true})
                  })
                }
                let discordData = await discordDB.findOne({ userID: discordID })
                let discordIDCheck = await discordDB.findOne({ dbid: discordDbidGen })
                if (discordIDCheck) discordDbidGen = crypto.randomBytes(21).toString('hex')
                if (discordData) return await submitted.reply({ content: `This user is already in the Discord User Database!`, ephemeral: true })
                const databaseEmbed = {
                  color: 946466,
                  title: 'User added to the Discord User Database',
                  description: 'A new user was just added to the Discord User Database.',
                  fields: [
                    {
                      name: 'Discord Tag',
                      value: `\`${user.tag}\``,
                      inline: true,
                    },
                    {
                      name: 'Discord ID',
                      value: `\`${discordID}\``,
                      inline: true,
                    },
                    {
                      name: 'Database ID',
                      value: `\`${discordDbidGen}\``,
                      inline: true,
                    },
                    {
                      name: 'Reason',
                      value: `\`${reason}\``,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                const databaseAdd = {
                  color: 946466,
                  title: 'User added to the Discord User Database',
                  description: `${interaction.user.tag} added a user from the Discord User Database.`,
                  fields: [
                    {
                      name: 'Author ID',
                      value: `\`${interaction.user.id}\``,
                      inline: true,
                    },
                    {
                      name: 'Server ID',
                      value: `\`${interaction.guild.id}\``,
                      inline: true,
                    },
                    {
                      name: 'Discord Tag',
                      value: `\`${user.tag}\``,
                      inline: true,
                    },
                    {
                      name: 'Discord ID',
                      value: `\`${discordID}\``,
                      inline: true,
                    },
                    {
                      name: 'Database ID',
                      value: `\`${discordDbidGen}\``,
                      inline: true,
                    },
                    {
                      name: 'Reason',
                      value: `\`${reason}\``,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                       const id2 = interaction.client.channels.cache.get(`1066483648343330816`)
                       id2.send({ embeds: [databaseEmbed] }).catch((error) => {
                        return console.log(error)
                      })
                       id.send({ embeds: [databaseAdd] }).catch((error) => {
                        return console.log(error)
                      })
                       await discordDB.collection.insertOne({
                        userID: `${discordID}`,
                        dbid: `${discordDbidGen}`,
                        reason: `${reason}`,
                        }).catch((error) => {
                          return console.log(error)
                        })
                        return await submitted.reply({ content: `<:yes:1070502230203039744> Successfully added **${user.tag}・${discordID}** to the Discord User Database!`, ephemeral: true })
                }
                }
            }
            if (interaction.options.getSubcommand() === 'search') {
                // return await interaction.reply(`This command is undergoing development! Try again later!`)
                const databaseType = interaction.options.getString('database')
                if (databaseType === 'realm') {
                  const searchModal = new ModalBuilder()
                .setCustomId('searchModal')
                .setTitle('Search the database');
            const gamertagInput = new TextInputBuilder()
                .setCustomId('gamertagInput')
                .setLabel("Their gamertag")
                .setStyle(TextInputStyle.Short)
                    .setMaxLength(16)
                    .setMinLength(1)
                    .setPlaceholder('Example: Optic SpiderAnt')
                    .setRequired(false);
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("Their Discord ID")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Example: 1010616280547594240')
                .setRequired(false);
                const realmInput = new TextInputBuilder()
                .setCustomId('realmInput')
                .setLabel("The realm")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Example: Arkham Prisons')
                .setRequired(false);
                const profileInput = new TextInputBuilder()
                .setCustomId('profileInput')
                .setLabel("The Realm Profile ID")
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setPlaceholder('Example: cf2eceb75e')
                .setRequired(false);
            const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
            const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
            const actionRow4 = new ActionRowBuilder().addComponents(profileInput);
            searchModal.addComponents(actionRow1, actionRow2, actionRow3,actionRow4);
            await interaction.showModal(searchModal);
            const submitted = await interaction.awaitModalSubmit({
              time: 99999,
              filter: i => i.user.id === interaction.user.id && i.customId === 'searchModal',
            }).catch(error => {
              console.error(error)
              return null
            })
            if (submitted) {
              let gamertag = submitted.fields.getTextInputValue('gamertagInput');
              let discordid = submitted.fields.getTextInputValue('discordIdInput');
              let realm = submitted.fields.getTextInputValue('realmInput');
              let profileid = submitted.fields.getTextInputValue('profileInput');
              if (!gamertag && !discordid && !realm && !profileid) return await submitted.reply({content: `You must choose atleast one option!`, ephemeral: true})
              if (gamertag) {
                let hackerProfile = await hackerDB.findOne({gamertag: gamertag})
                realm ? realmCheck = `Banned from **${hackerProfile.realm}** for **${hackerProfile.reason}**` : realmCheck = `Banned for **${hackerProfile.reason}**`
                if (!hackerProfile) return await submitted.reply({ content: `Player not found in the database!`, ephemeral: true})
                searchEmbed = {
                  color: 946466,
                  title: `${gamertag}`,
                  description: `${realmCheck}`,
                  fields: [
                    {
                      name: '<:Gamertag:1069209163487526963> Gamertag',
                      value: `\`${hackerProfile.gamertag}\``,
                      inline: true,
                    },
                    {
                      name: '<:Xuid:1069209594515177492> XUID',
                      value: `\`${hackerProfile.xuid}\``,
                      inline: true,
                    },
                    {
                      name: '<:Discord:1069209364386291793> Discord ID',
                      value: `\`${hackerProfile.discord}\``,
                      inline: true,
                    },
                    {
                      name: '<:ID:1069848085917880362> Database ID',
                      value: `\`${hackerProfile.dbid}\``,
                      inline: true,
                    },
                    {
                      name: '<:Realms:1069217776272683048> Realm',
                      value: `\`${hackerProfile.realm}\``,
                      inline: true,
                    },
                    {
                      name: '<:reason:1069224456838455366> Reason',
                      value: `\`${hackerProfile.reason}\``,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                return await submitted.reply({ content: `Result found for **${interaction.user.tag}**!`, embeds: [searchEmbed] })
              }
              if (realm) {
                let hackerProfile = await hackerDB.findOne({realm: realm})
                if (!hackerProfile) return await submitted.reply({ content: `Realm not found in the database!`, ephemeral: true})
                let realmProfile = await realmProfileDB.findOne({name: realm})
                searchEmbed = {
                  color: 946466,
                  title: `${realm}`,
                  description: `This realm has **${realmProfile.hackerCount}** confirmed hackers added to the database`,
                  fields: [
                    {
                      name: '<:Realms:1069217776272683048> Realm',
                      value: `\`${realmProfile.name}\``,
                      inline: true,
                    },
                    {
                      name: '<:ID:1069848085917880362> Realm Profile ID',
                      value: `\`${realmProfile.profileID}\``,
                      inline: true,
                    },
                    {
                      name: '<:emoji_67:1069218112496484372> Hacker Count',
                      value: `\`${realmProfile.hackerCount}\``,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                return await submitted.reply({ content: `Result found for **${interaction.user.tag}**!`, embeds: [searchEmbed] })
              }
              if (profileid) {
                let realmProfile = await realmProfileDB.findOne({profileID: profileid})
                if (!realmProfile) return await submitted.reply({ content: `Realm not found in the database!`, ephemeral: true})
                searchEmbed = {
                  color: 946466,
                  title: `${realmProfile.name}`,
                  description: `This realm has **${realmProfile.hackerCount}** confirmed hackers added to the database`,
                  fields: [
                    {
                      name: '<:Realms:1069217776272683048> Realm',
                      value: `\`${realmProfile.name}\``,
                      inline: true,
                    },
                    {
                      name: '<:ID:1069848085917880362> Realm Profile ID',
                      value: `\`${realmProfile.profileID}\``,
                      inline: true,
                    },
                    {
                      name: '<:emoji_67:1069218112496484372> Hacker Count',
                      value: `\`${realmProfile.hackerCount}\``,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                return await submitted.reply({ content: `Result found for **${interaction.user.tag}**!`, embeds: [searchEmbed] })
              }
            }
                }
                if (databaseType === 'discord') {
                  const searchModal = new ModalBuilder()
                  .setCustomId('searchModal')
                  .setTitle('Search the database')
                  const discordIdInput = new TextInputBuilder()
                  .setCustomId('discordIdInput')
                  .setLabel("Their Discord ID")
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(10)
                  .setPlaceholder('Example: 1038878247519277066')
                  .setRequired(false);
              const actionRow = new ActionRowBuilder().addComponents(discordIdInput);
              searchModal.addComponents(actionRow);
              await interaction.showModal(searchModal).catch((error) => {return console.log(error)})
              const submitted = await interaction.awaitModalSubmit({
                                time: 99999,
                                filter: i => i.user.id === interaction.user.id && i.customId === 'searchModal',
                              }).catch(error => {
                                console.error(error)
                                return null
                              })
                              if (submitted) {
                                let discordid = submitted.fields.getTextInputValue('discordIdInput');
                  let hackerProfile = await discordDB.findOne({userID: discordid})
                  const user = await interaction.client.users.fetch(`${discordid}`).catch((error) => {
                    return console.log(error)
                  })
                  if (!user) return await interaction.reply({ content: `<:error:1086371516565950474> **IdError:** User not found!`, ephemeral: true})
                  if (!hackerProfile) return await interaction.reply({ content: `User not found in the database!`, ephemeral: true})
                  searchEmbed = {
                    color: 946466,
                    title: `${user.tag}`,
                    description: `This user was added for **${hackerProfile.reason}**`,
                    fields: [
                      {
                        name: '<:Discord:1069209364386291793> Discord Tag',
                        value: `\`${user.tag}\``,
                        inline: true,
                      },
                      {
                        name: '<:ID:1069848085917880362> Discord ID',
                        value: `\`${hackerProfile.userID}\``,
                        inline: true,
                      },
                      {
                        name: '<:ID:1069848085917880362> Database ID',
                        value: `\`${hackerProfile.dbid}\``,
                        inline: true,
                      },
                      {
                        name: '<:reason:1069224456838455366> Reason',
                        value: `\`${hackerProfile.reason}\``,
                        inline: true,
                      },
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                      text: `${process.env.FOOTER}`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                    },
                  };
                  return await submitted.reply({ content: `Result found for **${interaction.user.tag}**!`, embeds: [searchEmbed] })
                }
                }
            }
            if (interaction.options.getSubcommand() === 'report') {
                // return await interaction.reply({ content: `This command is undergoing development! Try again later!`, ephemeral: true})
                const databaseType = interaction.options.getString('database')
              if (databaseType === 'realm') {
                const reportModal = new ModalBuilder()
                .setCustomId('reportModal')
                .setTitle('Report a player');
            const gamertagInput = new TextInputBuilder()
                .setCustomId('gamertagInput')
                .setLabel("Their gamertag")
                .setStyle(TextInputStyle.Short)
                    .setMaxLength(20)
                    .setMinLength(1)
                    .setPlaceholder('Example: MinteeMilk')
                    .setRequired(true);
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("Their Discord ID")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Example: 978506954114736158')
                .setRequired(false);
                const realmInput = new TextInputBuilder()
                .setCustomId('realmInput')
                .setLabel("The Realm Name")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Example: Anarchy Haven')
                .setRequired(false);
                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("The Reason")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(3)
                .setPlaceholder('What did they do to be reported? Did they crash, CBE, use fly, etc?')
                .setRequired(true);
            const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
            const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
            const actionRow4 = new ActionRowBuilder().addComponents(reasonInput);
            reportModal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4);
            let proof = interaction.options.getAttachment('proof')
            await interaction.showModal(reportModal);
            const submitted = await interaction.awaitModalSubmit({
              // Timeout after a minute of not receiving any valid Modals
              time: 99999,
              // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
              filter: i => i.user.id === interaction.user.id && i.customId === 'reportModal',
            }).catch(error => {
              // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
              console.error(error)
              return null
            })
            if (submitted) {
              let gamertag = submitted.fields.getTextInputValue('gamertagInput');
              let discordid = submitted.fields.getTextInputValue('discordIdInput');
              let realm = submitted.fields.getTextInputValue('realmInput');
              let reason = submitted.fields.getTextInputValue('reasonInput');
              proof.url.includes('.mov' || '.mp4' || '.wmv') ? proofType = 'video' : proofType = 'image'
            if (!discordid) discordid = `N/A`
            if (!realm) realm = `N/A`
            const reportEmbed = {
              color: 946466,
              title: 'Report a player',
              description: `New Hacker Database report by ${interaction.user.tag}`,
              fields: [
                {
                  name: '<:Gamertag:1069209163487526963> Gamertag',
                  value: `\`${gamertag}\``,
                  inline: true,
                },
                {
                  name: '<:Discord:1069209364386291793> Discord ID',
                  value: `\`${discordid}\``,
                  inline: true,
                },
                {
                  name: '<:Realms:1069217776272683048> Realm',
                  value: `\`${realm}\``,
                  inline: true,
                },
                {
                  name: '<:reason:1069224456838455366> Reason',
                  value: `\`${reason}\``,
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: `${process.env.FOOTER}`,
                icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
              },
            };
          const reportLog = {
              color: 946466,
              title: 'New report to the Hacker Database',
              description: 'Someone reported to the Hacker Database.',
              fields: [
                {
                  name: 'Author ID',
                  value: `\`${interaction.user.id}\``,
                  inline: true,
                },
                {
                  name: 'Server ID',
                  value: `${interaction.guild.id}`,
                  inline: true,
                },
                {
                  name: 'Gamertag',
                  value: `${gamertag}`,
                  inline: true,
                },
                {
                  name: 'Discord ID',
                  value: `${discordid}`,
                  inline: true,
                },
                {
                  name: 'Realm',
                  value: `${realm}`,
                  inline: true,
                },
                {
                  name: 'Reason',
                  value: `${reason}`,
                  inline: true,
                },
                {
                  name: 'Proof URL',
                  value: `${proof.url}`,
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: `${process.env.FOOTER}`,
                icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
              },
            };
          const id2 = interaction.client.channels.cache.get(`1061144118752989344`)
                      const reportid = crypto.randomBytes(15).toString('hex')
                      const embed = await id2.send({ content: `Report ID: **${reportid}**`, embeds: [reportEmbed] }).catch((error) => {
                        return console.log(error)
                      })
                      const thread = await embed.startThread({
                        name: `Proof for ${gamertag}`,
                        autoArchiveDuration: 60,
                        reason: `The proof for the report of ${gamertag}`,
                      });
                      proofType === 'video' ? proofType = '.mp4' : proofType = '.png'
                      thread.send({files: [{
                        attachment: proof.url,
                        name: `proof-for-${gamertag}${proofType}`
                    }]})
                      await reportDB.collection.insertOne({ 
                        serverID: `${interaction.guild.id}`,
                        authorID: `${interaction.user.id}`,
                        gamertag: `${gamertag}`,
                        discord: `${discordid}`,
                        dbid: `${dbid}`,
                        realm: `${realm}`,
                        reason: `${reason}`,
                        proof: `${proof.url}`,
                        reportID: `${reportid}`,
                        });
                      id.send({ embeds: [reportLog] });
                      await userDB.findOneAndUpdate({
                        userDB: `${interaction.user.id}`
                    }, {
                        $inc: {
                            reportCount: 1,
                        }
                    })
                      return await submitted.reply({
                        content: `<:yes:1070502230203039744> Successfully reported **${gamertag}**! The report will be reviewed by the ARAS Team shortly.`,
                        ephemeral: true
                      });
            }
          }
          if (databaseType === 'discord') {
            const discordReportModal = new ModalBuilder()
                .setCustomId('discordReportModal')
                .setTitle('Report a user');
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("Their Discord ID")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Example: 978506954114736158')
                .setRequired(true);
                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("The Reason")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(3)
                .setPlaceholder('What did they do to be reported?')
                .setRequired(true);
            const actionRow1 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow2 = new ActionRowBuilder().addComponents(reasonInput);
            discordReportModal.addComponents(actionRow1, actionRow2);
            let proof = interaction.options.getAttachment('proof')
            await interaction.showModal(discordReportModal);
            const submitted = await interaction.awaitModalSubmit({
              // Timeout after a minute of not receiving any valid Modals
              time: 99999,
              // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
              filter: i => i.user.id === interaction.user.id && i.customId === 'discordReportModal',
            }).catch(error => {
              // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
              console.error(error)
              return null
            })
            if (submitted) {
              let discordid = submitted.fields.getTextInputValue('discordIdInput');
              const user = await interaction.client.users.fetch(`${discordid}`).catch((error) => {
                return console.log(error)
              })
              if (!user) return await submitted.reply({ content: `<:error:1086371516565950474> **IdError:** User not found!`, ephemeral: true})
              let reason = submitted.fields.getTextInputValue('reasonInput');
              proof.url.includes('.mov' || '.mp4' || '.wmv') ? proofType = 'video' : proofType = 'image'
            const reportEmbed = {
              color: 946466,
              title: 'Report a user',
              description: `New Discord Database report by ${interaction.user.tag}`,
              fields: [
                {
                  name: '<:Discord:1069209364386291793> Discord Tag',
                  value: `\`${user.tag}\``,
                  inline: true,
                },
                {
                  name: '<:Discord:1069209364386291793> Discord ID',
                  value: `\`${discordid}\``,
                  inline: true,
                },
                {
                  name: '<:reason:1069224456838455366> Reason',
                  value: `\`${reason}\``,
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: `${process.env.FOOTER}`,
                icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
              },
            };
          const reportLog = {
              color: 946466,
              title: 'New report to the Discord Database',
              description: 'Someone reported to the Discord Database.',
              fields: [
                {
                  name: 'Author ID',
                  value: `\`${interaction.user.id}\``,
                  inline: true,
                },
                {
                  name: 'Server ID',
                  value: `\`${interaction.guild.id}\``,
                  inline: true,
                },
                {
                  name: 'Discord Tag',
                  value: `\`${user.tag}\``,
                  inline: true,
                },
                {
                  name: 'Discord ID',
                  value: `\`${discordid}\``,
                  inline: true,
                },
                {
                  name: 'Reason',
                  value: `\`${reason}\``,
                  inline: true,
                },
                {
                  name: 'Proof URL',
                  value: `\`${proof.url}\``,
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: `${process.env.FOOTER}`,
                icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
              },
            };
          const id2 = interaction.client.channels.cache.get(`1061144118752989344`)
                      const reportid = crypto.randomBytes(15).toString('hex')
                      const embed = await id2.send({ content: `Report ID: **${reportid}**`, embeds: [reportEmbed] }).catch((error) => {
                        return console.log(error)
                      })
                      const thread = await embed.startThread({
                        name: `Proof for ${user.tag}`,
                        autoArchiveDuration: 60,
                        reason: `The proof for the report of ${user.tag}`,
                      });
                      proofType === 'video' ? proofType = '.mp4' : proofType = '.png'
                      thread.send({files: [{
                        attachment: proof.url,
                        name: `proof-for-${user.username}${proofType}`
                    }]})
                      await reportDBDiscord.collection.insertOne({
                        serverID: `${interaction.guild.id}`,
                        authorID: `${interaction.user.id}`,
                        discordid: `${discordid}`,
                        dbid: `${dbid}`,
                        reason: `${reason}`,
                        proof: `${proof.url}`,
                        reportID: `${reportid}`,
                        });
                      id.send({ embeds: [reportLog] });
                      await userDB.findOneAndUpdate({
                        userDB: `${interaction.user.id}`
                    }, {
                        $inc: {
                            reportCount: 1,
                        }
                    })
                      return await submitted.reply({
                        content: `<:yes:1070502230203039744> Successfully reported **${user.tag}**・**${user.id}**! The report will be reviewed by the ARAS Team shortly.`,
                        ephemeral: true
                      });
          }
          }
            }
            await interaction.deferReply({ content: `Loading <a:loading:1069385540077637742>` });
            if (interaction.options.getSubcommand() === 'leaderboard') {
                // return await interaction.editReply(`This command is undergoing development! Try again later!`)
              if (interaction.options.getString('type') === 'realm') {
                let result = await realmProfileDB.find({});
                let listSort = [];
                for (let obj of result) {
                  listSort.push(obj)
                }
                listSort = listSort.sort(function (b, a) {
                  return a.hackerCount - b.hackerCount
                })
                listSort = listSort.filter(function BigEnough(value) {
                  return value.hackerCount > 0
                })
                listSort = listSort.slice(0 , 10)
                let desc = ""
                for (let i = 0; i < listSort.length; i++) {
                  let name = listSort[i].name
                  let hackers = listSort[i].hackerCount
                  let profileID = listSort[i].profileID
                  desc += `**${i + 1}.** __${name}__\nHacker Count: **${hackers}**\nProfile ID: **${profileID}**\n\n`
                }
                const lbEmbed = {
                  color: 946466,
                  title: 'Realms+ Realm Leaderboard',
                  description: `${desc}`,
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                const lbLog = {
                  color: 946466,
                  title: 'Database leaderboard requested',
                  description: `${interaction.user.tag} requested the database leaderboard.`,
                  fields: [
                    {
                      name: 'Author ID',
                      value: `${interaction.user.id}`,
                      inline: true,
                    },
                    {
                      name: 'Server ID',
                      value: `${interaction.guild.id}`,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                await id.send({ embeds: [lbLog] });
                return await interaction.editReply({ embeds: [lbEmbed] }).catch((error) => {
                  return console.log(error)
                })
              }
              if (interaction.options.getString('type') === 'admin') {
                if (!userData.isAdmin) return await interaction.editReply({content: `Invalid Permission! You must be a Realms+ Admin to run this command!`, ephemeral: true})
                let result = await userDB.find({isAdmin: true});
                let listSort = [];
                for (let obj of result) {
                  listSort.push(obj)
                }
                listSort = listSort.sort(function (b, a) {
                  return a.addCount - b.addCount
                })
                listSort = listSort.filter(function BigEnough(value) {
                  return value.addCount > 0
                })
                listSort = listSort.slice(0 , 10)
                let desc = ""
                for (let i = 0; i < listSort.length; i++) {
                  let id = listSort[i].userID
                  let hackers = listSort[i].addCount
                  desc += `**${i + 1}.** <@${id}>・${id}\nHackers Added: **${hackers}**\n\n`
                }
                const lbEmbed = {
                  color: 946466,
                  title: 'Realms+ Admin Leaderboard',
                  description: `${desc}`,
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                const lbLog = {
                  color: 946466,
                  title: 'Admin leaderboard requested',
                  description: `${interaction.user.tag} requested the admin leaderboard.`,
                  fields: [
                    {
                      name: 'Author ID',
                      value: `${interaction.user.id}`,
                      inline: true,
                    },
                    {
                      name: 'Server ID',
                      value: `${interaction.guild.id}`,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                await id.send({ embeds: [lbLog] });
                return await interaction.editReply({ embeds: [lbEmbed] }).catch((error) => {
                  return console.log(error)
                })
              }
              if (interaction.options.getString('type') === 'user') {
                let result = await userDB.find({});
                let listSort = [];
                for (let obj of result) {
                  listSort.push(obj)
                }
                listSort = listSort.sort(function (b, a) {
                  return a.reportCount - b.reportCount
                })
                listSort = listSort.filter(function BigEnough(value) {
                  return value.reportCount > 0
                })
                listSort = listSort.slice(0 , 10)
                let desc = ""
                for (let i = 0; i < listSort.length; i++) {
                  let id = listSort[i].userID
                  const user = await interaction.client.users.fetch(`${id}`).catch((error) => {
                    return console.log(error)
                  })
                  let name = user.tag
                  let reportNumber = listSort[i].reportCount
                  desc += `**${i + 1}.** __${name}__・__${id}__\nReport Count: **${reportNumber}**\n\n`
                }
                const lbEmbed = {
                  color: 946466,
                  title: 'Realms+ Report Leaderboard',
                  description: `${desc}`,
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                const lbLog = {
                  color: 946466,
                  title: 'Database leaderboard requested',
                  description: `${interaction.user.tag} requested the database leaderboard.`,
                  fields: [
                    {
                      name: 'Author ID',
                      value: `${interaction.user.id}`,
                      inline: true,
                    },
                    {
                      name: 'Server ID',
                      value: `${interaction.guild.id}`,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
                };
                await id.send({ embeds: [lbLog] });
                return await interaction.editReply({ embeds: [lbEmbed] }).catch((error) => {
                return console.log(error)
                })
              }
            }
            if (interaction.options.getSubcommand() === 'remove') {
                // return await interaction.editReply(`This command is undergoing development! Try again later!`)
                if (!userData.databasePerms) return await interaction.editReply({ content: `Invalid Permission! You can not remove from the database!`, ephemeral: true})
                const databaseType = interaction.options.getString('database')
                if (databaseType === 'realm') {
                    const dbid = interaction.options.getString('database-id')
                    let hackerData = await hackerDB.findOne({ dbid: dbid })
                    if (!hackerData) return interaction.editReply({ content: `This player isn't in the database!`, ephemeral: true })
                    const removeLog = {
                    color: 946466,
                    title: `Successfully removed ${hackerData.gamertag}`,
                    description: `${interaction.user.tag} removed a player from the Hacker Database.`,
                    fields: [
                      {
                        name: 'Author ID',
                        value: `${interaction.user.id}`,
                        inline: true,
                      },
                      {
                        name: 'Server ID',
                        value: `${interaction.guild.id}`,
                        inline: true,
                      },
                      {
                        name: 'Gamertag',
                        value: `${hackerData.gamertag}`,
                        inline: true,
                      },
                      {
                        name: 'XUID',
                        value: `${hackerData.xuid}`,
                        inline: true,
                      },
                      {
                        name: 'Discord ID',
                        value: `${hackerData.discord}`,
                        inline: true,
                      },
                      {
                        name: 'Database ID',
                        value: `${hackerData.dbid}`,
                        inline: true,
                      },
                      {
                        name: 'Realm',
                        value: `${hackerData.realm}`,
                        inline: true,
                      },
                      {
                        name: 'Reason',
                        value: `${hackerData.reason}`,
                        inline: true,
                      },
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                      text: `${process.env.FOOTER}`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                    },
                  };
                  await realmProfileDB.collection.updateOne({name: hackerData.realm},{ 
                    $inc: {
                      hackerCount: -1
                    }
                    });
                    id.send({ embeds: [removeLog] });
                    await submitted.editReply({ content: `<:yes:1070502230203039744> Successfully removed **${hackerData.gamertag}** from the Hacker Database!`, ephemeral: true })
                    return hackerDB.deleteOne({
                    dbid: dbid
                  })
                }
                if (databaseType === 'discord') {
                const dbid = interaction.options.getString('database-id')
                let hackerData = await discordDB.findOne({ dbid: dbid })
                if (!hackerData) return interaction.editReply({ content: `This user isn't in the database!`, ephemeral: true })
                let user = await interaction.client.users.fetch(`${hackerData.userID}`).catch(error)
                const removeLog = {
                color: 946466,
                title: 'Successfully removed \`${user.tag}\`',
                description: `${interaction.user.tag} removed a player from the Realms+ Discord User Database.`,
                fields: [
                {
                    name: 'Author ID',
                    value: `${interaction.user.id}`,
                    inline: true,
                },
                {
                    name: 'Server ID',
                    value: `${interaction.guild.id}`,
                    inline: true,
                },
                {
                    name: 'Discord Tag',
                    value: `\`${user.tag}\``,
                    inline: true,
                },
                {
                    name: 'Discord ID',
                    value: `${user.id}`,
                    inline: true,
                },
                {
                    name: 'Database ID',
                    value: `${hackerData.dbid}`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: `${hackerData.reason}`,
                    inline: true,
                },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                text: `${process.env.FOOTER}`,
                icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                },
            };
            id.send({ embeds: [removeLog] });
            await submitted.editReply({ content: `<:yes:1070502230203039744> Successfully removed **${user.tag}・${user.id}** from the Realms+ Discord User Database!`, ephemeral: true })
            return discordDB.deleteOne({
                dbid: dbid
            })
            }
            }
        } catch (error) {
          const errorChannel = interaction.client.channels.cache.get('1086347050838401074')
          await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Database Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
              console.log(error)
        }
    }
}