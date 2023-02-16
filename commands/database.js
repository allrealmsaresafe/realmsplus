const { ActivityType, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const crypto = require("crypto");
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const mongoose = require('mongoose')
const hackerDB = require('../models/hackerDB')
const discordDB = require('../models/discordDB')
const realmProfileDB = require('../models/realmProfileDB')
const reportDB = require('../models/reportDB')
const profileIDGenerator = crypto.randomBytes(5).toString('hex')
const dbid = crypto.randomBytes(12).toString('hex')
let realmProfile
let hackerProfile
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
                .setDescription('Allows for you to search the database for a query.')
                .addStringOption(option => option.setName('database').setDescription('The database you want to search.').addChoices(
                  { name: 'Realm Hacker Database', value: 'realm' },
                  { name: 'Discord User Database', value: 'discord' },
                ).setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
          .setName('report')
          .setDescription('Report a player to get them banned on Realms+.')
          .addStringOption(option => option.setName('database').setDescription('The database you want to report to.').addChoices(
            { name: 'Realm Hacker Database', value: 'realm' },
            { name: 'Discord User Database', value: 'discord' },
          ).setRequired(true)))
          .addSubcommand(subcommand =>
          subcommand
        .setName('add')
        .setDescription('Adds a player to the database.')
        .addStringOption(option => option.setName('database').setDescription('The database you want to add to.').addChoices(
          { name: 'Realm Hacker Database', value: 'realm' },
          { name: 'Discord User Database', value: 'discord' },
        ).setRequired(true)))
        .addSubcommand(subcommand =>
        subcommand
          .setName('remove')
          .setDescription('Removes a player to the database.')
          .addStringOption(option => option.setName('database-id').setDescription('The Database ID.').setRequired(true))
          .addStringOption(option => option.setName('database').setDescription('The database you want to remove from.').addChoices(
            { name: 'Realm Hacker Database', value: 'realm' },
            { name: 'Discord User Database', value: 'discord' },
          ).setRequired(true)))
          .addSubcommand(subcommand =>
            subcommand
          .setName('leaderboard')
          .setDescription('Displays the database leaderboard.')
          .addStringOption(option => option.setName('type').setDescription('The type of leaderboard you want to display.').addChoices(
            { name: 'Realm Leaderboard', value: 'realm' },
            { name: 'Report Leaderboard', value: 'user' },
            { name: 'Admin Leaderboard', value: 'admin' },
            // { name: 'Server Leaderboard', value: 'server' },
            // { name: 'Most Recent Added Hackers', value: 'recent' },
          ).setRequired(true))),
	async execute(interaction) {
    // return await interaction.reply(`This command is undergoing development! Try again later!`)
		try {
      			if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
            const id = interaction.client.channels.cache.get(`1060345095347523644`)
            let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(() => {
      return
    })
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
            let serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            if (!serverData) {
              newServer = await serverDB.create({serverID: interaction.guild.id,whitelisted: false,discordBanModule: false,configs: [{banLogs: '0', automod: '0', logsChannel: '0', relayChannel: '0', adminRoleID: '0', moderatorRoleID: '0'}],addCount: 0, realmChatRelay: false, autobanFromDB: false, automod: false, banCommand: [{ permission: ['404'], enabled: true }], kickCommand: [{ permission: ['404'], enabled: true }], statusCommand: [{ permission: ['404'], enabled: true }], playersCommand: [{ permission: ['0'], enabled: true }], editCommand: [{ permission: ['404'], enabled: true }], worldCommand: [{ permission: ['404'], enabled: true }], permissionsCommand: [{ permission: ['404'], enabled: true }], consoleCommand: [{ permission: ['404'], enabled: true }], automodCommand: [{ permission: ['404'], enabled: true }], botCommand: [{ permission: ['404'], enabled: true }],realmID: [{ realmID: '0', name: '0'}], botConnected: false, isOpen: [{ realmID: '0', status: '0'}], realmsBans: [{ realmID: '0', banCount: '0'}], realmsKicks: [{ realmID: '0', kickCount: '0'}],realmOperators: [{ realmID: '0', operators: ['0']}],currentLogic: [{ realmID: '0', logic: '0'}]});newServer.save().catch(() => {
      return
    })
              serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            }
            if (interaction.options.getSubcommand() === 'add') {
                if (!userData.databasePerms) return await interaction.reply({ content: `Invalid Permission! You can not add to the database! Instead make a report with \`/database report\`.`, ephemeral: true })
                const databaseType = interaction.options.getString('database')
                if (databaseType === 'realm') {
                  const addModal = new ModalBuilder()
                  .setCustomId('addModal')
                  .setTitle('Add a hacker to the Hacker Database');
              const gamertagInput = new TextInputBuilder()
                  .setCustomId('gamertagInput')
                  .setLabel("What is their gamertag?")
                  .setStyle(TextInputStyle.Short)
                      .setMaxLength(20)
                      .setMinLength(1)
                      .setPlaceholder('The player\'s Microsoft Account Name')
                      .setRequired(true);
                      const xuidInput = new TextInputBuilder()
                      .setCustomId('xuidInput')
                      .setLabel("What is the user's XUID?")
                      .setStyle(TextInputStyle.Short)
                      .setMinLength(5)
                      .setPlaceholder('Must be an Xbox User ID.')
                      .setRequired(false);
                  const discordIdInput = new TextInputBuilder()
                  .setCustomId('discordIdInput')
                  .setLabel("What is their discord ID?")
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(12)
                  .setPlaceholder('To find a discord ID right click on their profile and click Copy ID.')
                  .setRequired(false);
                  const realmInput = new TextInputBuilder()
                  .setCustomId('realmInput')
                  .setLabel("What is the realm name?")
                  .setStyle(TextInputStyle.Short)
                  .setPlaceholder('The name of the realm the player was caught on.')
                  .setRequired(false);
                  const reasonInput = new TextInputBuilder()
                  .setCustomId('reasonInput')
                  .setLabel("What is the reason?")
                  .setStyle(TextInputStyle.Paragraph)
                  .setMinLength(3)
                  .setPlaceholder('What did they do to be reported? Did they crash, CBE, use fly, etc?')
                  .setRequired(true);
              const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
              const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
              const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
              const actionRow4 = new ActionRowBuilder().addComponents(reasonInput);
              const actionRow5 = new ActionRowBuilder().addComponents(xuidInput);
              addModal.addComponents(actionRow1, actionRow5, actionRow2, actionRow3,actionRow4);
              await interaction.showModal(addModal);
              const submitted = await interaction.awaitModalSubmit({
                // Timeout after a minute of not receiving any valid Modals
                time: 99999,
                // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
                filter: i => i.user.id === interaction.user.id && i.customId === 'addModal',
              }).catch(error => {
                // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
                console.error(error)
                return null
              })
              if (submitted) {
                  var gamertag = submitted.fields.getTextInputValue('gamertagInput');
                  var discordid = submitted.fields.getTextInputValue('discordIdInput');
                  var realm = submitted.fields.getTextInputValue('realmInput');
                  var reason = submitted.fields.getTextInputValue('reasonInput');
                  if (discordid) {
                    let discordUser = await discordDB.findOne({ userID: discordid })
                    var discordDbidGen = crypto.randomBytes(15).toString('hex')
                    if (!discordUser) {
                      newUser = await discordDB.create({userID: discordid,dbid: discordDbidGen,reason: `Realm Hacking [${reason}]`});newUser.save().catch(() => {
                          return
                        })
                      discordUser = await discordDB.findOne({ userID: discordid })
                    }
                    let serversWithModule = await serverDB.find({ discordBanModule: true })
                    if (typeof Number(discordid) != Number) return await interaction.reply({ content: `There was an error with this command, try again!`, ephemeral: true})
                      let user = await interaction.client.users.fetch(`${discordid}`);
                     if (user) {
                      // interaction.client.guilds.cache.forEach(guild => {
                      //   if(guild.members.cache.has(user.id) && serversWithModule.keys().includes(guild.id)) {
                      //     guild.members.ban(user);
                      //   }
                      //   }).then(async guild => 
                      //     {
                      //     const banLog = {
                      //       color: 946466,
                      //       title: 'New hacker banned from guilds.',
                      //       description: `A hacker was banned from ALL guilds that have the Discord Ban Module on.`,
                      //       fields: [
                      //         {
                      //           name: 'Hacker ID',
                      //           value: `${discordid}`,
                      //           inline: true,
                      //         },
                      //         {
                      //           name: 'Guilds Banned From',
                      //           value: `${serversWithModule.length}`,
                      //           inline: true,
                      //         },
                      //       ],
                      //       timestamp: new Date().toISOString(),
                      //       footer: {
                      //         text: `${process.env.FOOTER}`,
                      //         icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                      //       },
                      //     };
                      //     return await id.send({ embeds: [banLog] });
                      //   })
                    }
                  }
                  if (!discordid) discordid = `N/A`
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
                              var realmProfile = await realmProfileDB.findOne({ profileID: profileIDGenerator })
                              if (!realmProfile) {
                                newProfile = await realmProfileDB.create({profileID: profileIDGenerator, name: realm, hackerCount: 0});newProfile.save()
                                var realmProfile = await realmProfileDB.findOne({ name: realm })
                              }
                            }
                          }
                          if (!xuid) xuid = 'N/A'
                          const alreadyAdded = await hackerDB.find({gamertag: gamertag})
                          if (!alreadyAdded) return await interaction.reply({content: `The user with the gamertag: **${gamertag}** is already in the database!`, ephemeral: true})
                          const databaseEmbed = {
                              color: 946466,
                              title: 'Player added to the Realms+ Hacker Database (RHD)',
                              description: 'A new player was just added to the Realms+ Hacker & Player Database.',
                              fields: [
                                {
                                  name: 'Gamertag',
                                  value: `${gamertag}`,
                                  inline: true,
                                },
                                {
                                  name: 'XUID',
                                  value: `${xuid}`,
                                  inline: true,
                                },
                                {
                                  name: 'Discord ID',
                                  value: `${discordid}`,
                                  inline: true,
                                },
                                {
                                  name: 'Database ID',
                                  value: `${dbid}`,
                                  inline: true,
                                },
                                {
                                  name: 'Realm',
                                  value: `${realm}`,
                                  inline: true,
                                },
                                {
                                  name: 'Realm Profile ID',
                                  value: `${realmProfile.profileID}`,
                                  inline: true,
                                },
                                {
                                  name: 'Reason',
                                  value: `${reason}`,
                                  inline: true,
                                },
                              ],
                              timestamp: new Date().toISOString(),
                              footer: {
                                text: `${process.env.FOOTER}`,
                                icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                              },
                            };
                          const dbLog = {
                              color: 946466,
                              title: 'New entry in the Database',
                              description: 'A Realms+ admin added a new player to the Realms+ Hacker Database (RHD).',
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
                                  value: `${gamertag}`,
                                  inline: true,
                                },
                                {
                                  name: 'XUID',
                                  value: `${xuid}`,
                                  inline: true,
                                },
                                {
                                  name: 'Discord ID',
                                  value: `${discordid}`,
                                  inline: true,
                                },
                                {
                                  name: 'Database ID',
                                  value: `${dbid}`,
                                  inline: true,
                                },
                                {
                                  name: 'Realm',
                                  value: `${realm}`,
                                  inline: true,
                                },
                                {
                                  name: 'Realm Profile ID',
                                  value: `${realmProfile.profileID}`,
                                  inline: true,
                                },
                                {
                                  name: 'Reason',
                                  value: `${reason}`,
                                  inline: true,
                                },
                              ],
                              timestamp: new Date().toISOString(),
                              footer: {
                                text: `${process.env.FOOTER}`,
                                icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                              },
                            };
                                  await hackerDB.collection.insertOne({ 
                                   gamertag: `${gamertag}`,
                                   xuid: `${xuid}`,
                                   discord: `${discordid}`,
                                   dbid: `${dbid}`,
                                   realm: `${realm}`,
                                   reason: `${reason}`,
                                   });
                                   await realmProfileDB.collection.updateOne({profileID: realmProfile.profileID},{ 
                                      $inc: {
                                        hackerCount: 1
                                      }
                                      });
                                      await userData.collection.updateOne({userID: interaction.user.id},{ 
                                        $inc: {
                                          addCount: 1
                                        }
                                        });
                                    interaction.client.user.setPresence({
                                      activities: [{ name: `${interaction.client.guilds.cache.size} servers.`, type: ActivityType.Watching }],
                                      status: 'online',
                                    });
                                   const id2 = interaction.client.channels.cache.get(`1059559606222856202`)
                                   id2.send({ embeds: [databaseEmbed] }).catch((error) => {
                                      return console.log(error)
                                    })
                                   id.send({ embeds: [dbLog] }).catch((error) => {
                                    return console.log(error)
                                  })
                                    return await submitted.reply({
                                      content: `<:yes:1070502230203039744> Successfully added **${gamertag}** to the Realms+ Hacker Database (RHD)!`,
                                      ephemeral: true
                                    })
                        }).catch( async error => {
                          return console.log(error)
                        })
                      }).catch( async error => {
                        return console.log(error)
                      })
                     }
                } else if (databaseType === 'discord') {
                  if (!userData.databasePerms) return await interaction.reply({ content: `Invalid Permission! You can not add to the Realms+ Discord User Database (RDUD)!`, ephemeral: true})
                  var discordDbidGen = crypto.randomBytes(15).toString('hex')
                    const discordAddModal = new ModalBuilder()
                    .setCustomId('discordAddModal')
                    .setTitle('Add a user to the Discord User Database');
                    const discordIdInput = new TextInputBuilder()
                    .setCustomId('discordIdInput')
                    .setLabel("What is their discord ID?")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(7)
                    .setPlaceholder('To find a discord ID right click on their profile and click Copy ID.')
                    .setRequired(false);
                    const reasonInput = new TextInputBuilder()
                    .setCustomId('reasonInput')
                    .setLabel("What is the reason?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(3)
                    .setPlaceholder('What did they do to be reported?')
                    .setRequired(true);
                const actionRow1 = new ActionRowBuilder().addComponents(discordIdInput);
                const actionRow2 = new ActionRowBuilder().addComponents(reasonInput);
                discordAddModal.addComponents(actionRow1, actionRow2);
                await interaction.showModal(discordAddModal);
                const submitted = await interaction.awaitModalSubmit({
                  // Timeout after a minute of not receiving any valid Modals
                  time: 99999,
                  // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
                  filter: i => i.user.id === interaction.user.id && i.customId === 'discordAddModal'
                }).catch(error => {
                  // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
                  console.error(error)
                  return null
                })
                if (submitted) {
                    var discordID = submitted.fields.getTextInputValue('discordIdInput');
                    var reason = submitted.fields.getTextInputValue('reasonInput');
                    if (discordID) {
                    var user = await interaction.client.users.fetch(`${discordID}`).catch(async (error) => {
                      return await interaction.reply({content: `Couldn't find a user with the Discord ID of: **${discordID}**!`, ephemeral: true})
                    })
                  }
                    let discordData = await discordDB.findOne({ userID: discordID })
                    if (discordData !== null) return await interaction.reply({ content: `This user is already in the Realms+ Discord User Database (RDUD)!`, ephemeral: true })
                      let discordUser = await discordDB.findOne({ userID: discordID })
                      if (!discordUser) {
                        newUser = await discordDB.create({userID: discordID,dbid: discordDbidGen,reason: `${reason}`});newUser.save().catch(() => {
                        return
                      })
                        discordUser = await discordDB.findOne({ userID: discordID })
                      }
                      // let serversWithModule = await serverDB.find({ discordBanModule: true })
                      //  if (user) {
                      //   // interaction.client.guilds.cache.forEach(guild => {
                      //   //   if(guild.members.cache.has(user.id) && serversWithModule.toString().includes(guild.id)) {
                      //   //     guild.members.ban(user);
                      //   //   }
                      //   //   }).then(async guild => 
                      //   //     {
                      //   //     const banLog = {
                      //   //       color: 946466,
                      //   //       title: 'New hacker banned from guilds.',
                      //   //       description: `A hacker was banned from ALL guilds that have the Discord Ban Module on.`,
                      //   //       fields: [
                      //   //         {
                      //   //           name: 'Discord Tag',
                      //   //           value: `${user.tag}`,
                      //   //           inline: true,
                      //   //         },
                      //   //         {
                      //   //           name: 'Discord ID',
                      //   //           value: `${discordID}`,
                      //   //           inline: true,
                      //   //         },
                      //   //         {
                      //   //           name: 'Database ID',
                      //   //           value: `${discordDbidGen}`,
                      //   //           inline: true,
                      //   //         },
                      //   //         {
                      //   //           name: 'Guilds Banned From',
                      //   //           value: `${serversWithModule.length}`,
                      //   //           inline: true,
                      //   //         },
                      //   //       ],
                      //   //       timestamp: new Date().toISOString(),
                      //   //       footer: {
                      //   //         text: `${process.env.FOOTER}`,
                      //   //         icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                      //   //       },
                      //   //     };
                      //   //     return await id.send({ embeds: [banLog] });
                      //   //   })
                      // } else {
                      //   return await interaction.reply({ content: `Couldn't find a user in the database with the Discord ID of: **${discordID}**!`, ephemeral: true})
                      // }
                    const databaseEmbed = {
                        color: 946466,
                        title: 'Player added to the Realms+ Discord User Database (RDUD)',
                        description: 'A new player was just added to the Realms+ Discord User Database.',
                        fields: [
                          {
                            name: 'Discord Tag',
                            value: `\`${user.tag}\``,
                            inline: true,
                          },
                          {
                            name: 'Discord ID',
                            value: `${discordID}`,
                            inline: true,
                          },
                          {
                            name: 'Database ID',
                            value: `${discordDbidGen}`,
                            inline: true,
                          },
                          {
                            name: 'Reason',
                            value: `${reason}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                      const databaseAdd = {
                        color: 946466,
                        title: 'User added to the Realms+ Discord User Database (RDUD)',
                        description: `${interaction.user.tag} added a user from the Realms+ Discord User Database (RDUD).`,
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
                            value: `${discordID}`,
                            inline: true,
                          },
                          {
                            name: 'Database ID',
                            value: `${discordDbidGen}`,
                            inline: true,
                          },
                          {
                            name: 'Reason',
                            value: `${reason}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                             const id2 = interaction.client.channels.cache.get(`1066483648343330816`)
                             id2.send({ embeds: [databaseEmbed] }).catch(() => {
                                return interaction.reply(`Error! Try again!`)
                              })
                             id.send({ embeds: [databaseAdd] }).catch(() => {
                              return interaction.reply(`Error! Try again!`)
                            })
                             await discordDB.collection.insertOne({ 
                              userID: `${discordID}`,
                              dbid: `${discordDbidGen}`,
                              reason: `${reason}`,
                              }).catch(error)
                              return await submitted.reply({ content: `<:yes:1070502230203039744> Successfully added **${user.tag}・${discordID}** to the Realms+ Discord User Database (RDUD)!`, ephemeral: true })
                                            }
                }
            }
            if (interaction.options.getSubcommand() === 'report') {
              const databaseType = interaction.options.getString('database')
              if (databaseType === 'realm') {
                const reportModal = new ModalBuilder()
                .setCustomId('reportModal')
                .setTitle('Report a hacker to the Hacker Database');
            const gamertagInput = new TextInputBuilder()
                .setCustomId('gamertagInput')
                .setLabel("What is their gamertag?")
                .setStyle(TextInputStyle.Short)
                    .setMaxLength(20)
                    .setMinLength(1)
                    .setPlaceholder('The player\'s Microsoft Account Name')
                    .setRequired(true);
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("What is their discord ID?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Their discord ID.')
                .setRequired(false);
                const realmInput = new TextInputBuilder()
                .setCustomId('realmInput')
                .setLabel("What is the realm name?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('The name of the realm the player was caught on.')
                .setRequired(false);
                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("What is the reason?")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(3)
                .setPlaceholder('What did they do to be reported? Did they crash, CBE, use fly, etc?')
                .setRequired(true);
                const proofInput = new TextInputBuilder()
                .setCustomId('proofInput')
                .setLabel("Please show proof.")
                .setStyle(TextInputStyle.Short)
                .setMinLength(5)
                .setPlaceholder('Must be a image/video link.')
                .setRequired(true);
            const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
            const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
            const actionRow4 = new ActionRowBuilder().addComponents(reasonInput);
            const actionRow5 = new ActionRowBuilder().addComponents(proofInput);
            reportModal.addComponents(actionRow1, actionRow2, actionRow3,actionRow4 , actionRow5);
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
                    let proof = submitted.fields.getTextInputValue('proofInput');
                    const alreadyAdded = await hackerDB.find({gamertag: gamertag})
                    if (alreadyAdded === true) return await interaction.reply({content: `The user with the gamertag: **${gamertag}** is already in the database!`, ephemeral: true})
                    if (!discordid) discordid = `N/A`
                    if (!realm) realm = `N/A`
                    const reportEmbed = {
                        color: 946466,
                        title: 'Report a player to be reviewed by the ARAS team',
                        description: 'New Realms+ Hacker Database (RHD) Report.',
                        fields: [
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
                            name: 'Proof',
                            value: `${proof}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                    const reportLog = {
                        color: 946466,
                        title: 'New report to the Hacker Database',
                        description: 'Someone reported to the Realms+ Hacker Database (RHD).',
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
                            name: 'Proof',
                            value: `${proof}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                      // const row_report = new ActionRowBuilder()
                      // .addComponents(
                      //     new ButtonBuilder()
                      //     .setCustomId(`yes`)
                      //     .setEmoji(`<:yes:1070502230203039744>`)
                      //     .setLabel('Accept')
                      //     .setStyle(ButtonStyle.Success),
                      //     new ButtonBuilder()
                      //     .setCustomId(`no`)
                      //     .setEmoji(`❌`)
                      //     .setLabel('Decline')
                      //     .setStyle(ButtonStyle.Danger),
                      // )
                      const id2 = interaction.client.channels.cache.get(`1061144118752989344`)
                      const reportid = crypto.randomBytes(15).toString('hex')
                      id2.send({ content: `Report ID: **${reportid}**`, embeds: [reportEmbed] }).catch(() => {
                        return
                      })
                      await reportDB.collection.insertOne({ 
                        serverID: `${interaction.guild.id}`,
                        authorID: `${interaction.user.id}`,
                        gamertag: `${gamertag}`,
                        xuid: `${xuid}`,
                        discord: `${discordid}`,
                        dbid: `${dbid}`,
                        realm: `${realm}`,
                        reason: `${reason}`,
                        proof: `${proof}`,
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
                const reportDiscordModal = new ModalBuilder()
                .setCustomId('reportDiscordModal')
                .setTitle('Report a user to the Discord User Database');
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("What is their discord ID?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Their discord ID.')
                .setRequired(true);
                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("What is the reason?")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(3)
                .setPlaceholder('What did they do to be reported?')
                .setRequired(true);
                const proofInput = new TextInputBuilder()
                .setCustomId('proofInput')
                .setLabel("Please show proof.")
                .setStyle(TextInputStyle.Short)
                .setMinLength(5)
                .setPlaceholder('Must be a image/video link.')
                .setRequired(true);
            const actionRow1 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow2 = new ActionRowBuilder().addComponents(reasonInput);
            const actionRow3 = new ActionRowBuilder().addComponents(proofInput);
            reportDiscordModal.addComponents(actionRow1, actionRow2, actionRow3);
            await interaction.showModal(reportDiscordModal);
            const submitted = await interaction.awaitModalSubmit({
              // Timeout after a minute of not receiving any valid Modals
              time: 99999,
              // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
              filter: i => i.user.id === interaction.user.id && i.customId === 'reportDiscordModal',
            }).catch(error => {
              // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
              console.error(error)
              return null
            })
            if (submitted) {
                    let discordID = submitted.fields.getTextInputValue('discordIdInput');
                    let reason = submitted.fields.getTextInputValue('reasonInput');
                    let proof = submitted.fields.getTextInputValue('proofInput');
                    if (typeof Number(discordID) != Number) return await interaction.reply({ content: `There was an error with this command, try again!`, ephemeral: true})
                    let user = await interaction.client.users.fetch(`${discordID}`);
                    if (!user) return await interaction.reply({content: `Couldn't find a user with the Discord ID of: **${discordID}**!`, ephemeral: true})
                    const alreadyAdded = await discordDB.findOne({userID: discordID})
                    if (alreadyAdded) return await interaction.reply({content: `The user with the Discord ID: **${discordID}** is already in the database!`, ephemeral: true})
                    const reportEmbed = {
                        color: 946466,
                        title: 'Report a user to be reviewed by the ARAS team',
                        description: 'New Realms+ Discord User Database (RDUD) Report.',
                        fields: [
                          {
                            name: 'Discord Tag',
                            value: `\`${user.tag}\``,
                            inline: true,
                          },
                          {
                            name: 'Discord ID',
                            value: `${discordID}`,
                            inline: true,
                          },
                          {
                            name: 'Reason',
                            value: `${reason}`,
                            inline: true,
                          },
                          {
                            name: 'Proof',
                            value: `${proof}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                    const reportLog = {
                        color: 946466,
                        title: 'New report to the Discord User Database',
                        description: 'Someone reported to the Realms+ Hacker Database (RHD).',
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
                            value: `${discordID}`,
                            inline: true,
                          },
                          {
                            name: 'Reason',
                            value: `${reason}`,
                            inline: true,
                          },
                          {
                            name: 'Proof',
                            value: `${proof}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                      const id2 = interaction.client.channels.cache.get(`1061144118752989344`)
                      id2.send({ embeds: [reportEmbed] }).catch((error) => {
                        return console.log(error)
                      })
                      id.send({ embeds: [reportLog] }).catch((error) => {
                        return console.log(error)
                      })
                      return await submitted.reply({
                        content: `<:yes:1070502230203039744> Successfully reported **${user.tag}・${discordID}**! The report will be reviewed by the ARAS Team shortly.`,
                        ephemeral: true,
                      }).catch((error) => {
                        return console.log(error)
                      })
                  }
              }
            }
            if (interaction.options.getSubcommand() === 'search') {
              const databaseType = interaction.options.getString('database')
              if (databaseType === 'realm') {
                const searchModal = new ModalBuilder()
                .setCustomId('searchModal')
                .setTitle('Search for a hacker in the database');
            const gamertagInput = new TextInputBuilder()
                .setCustomId('gamertagInput')
                .setLabel("What is their gamertag?")
                .setStyle(TextInputStyle.Short)
                    .setMaxLength(20)
                    .setMinLength(1)
                    .setPlaceholder('The player\'s Microsoft Account Name')
                    .setRequired(false);
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("What is their discord ID?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Their discord ID.')
                .setRequired(false);
                const realmInput = new TextInputBuilder()
                .setCustomId('realmInput')
                .setLabel("What is the realm name?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('The name of the realm the player was caught on.')
                .setRequired(false);
                const profileInput = new TextInputBuilder()
                .setCustomId('profileInput')
                .setLabel("What is the realm profile ID?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setPlaceholder('If you put realm name no need for this.')
                .setRequired(false);
            const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
            const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
            const actionRow4 = new ActionRowBuilder().addComponents(profileInput);
            searchModal.addComponents(actionRow1, actionRow2, actionRow3,actionRow4);
            await interaction.showModal(searchModal);
            const submitted = await interaction.awaitModalSubmit({
              // Timeout after a minute of not receiving any valid Modals
              time: 99999,
              // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
              filter: i => i.user.id === interaction.user.id && i.customId === 'searchModal',
            }).catch(error => {
              // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
              console.error(error)
              return null
            })
            if (submitted) {
                    let gamertag = submitted.fields.getTextInputValue('gamertagInput');
                    let discordid = submitted.fields.getTextInputValue('discordIdInput');
                    let realm = submitted.fields.getTextInputValue('realmInput');
                    let profileid = submitted.fields.getTextInputValue('profileInput');
                    if (!gamertag && !discordid && !realm && !profileid) return await interaction.reply({content: `You must choose atleast one option!`, ephemeral: true})
                    if (!gamertag && !discordid && realm) {
                      realmProfile = await realmProfileDB.findOne({name: realm})
                      if (!realmProfile) return interaction.reply({ content: `Realm not found in the database!`, ephemeral: true})
                    } else if (!gamertag && !discordid && profileid) {
                      realmProfile = await realmProfileDB.findOne({profileID: profileid})
                      if (!realmProfile) return interaction.reply({ content: `Realm not found in the database!`, ephemeral: true})
                    }
                    if (gamertag && discordid) {
                      hackerProfile = await hackerDB.findOne({gamertag: gamertag, discord: discordid})
                      if (!hackerProfile) return await interaction.reply({ content: `Player not found in the database!`, ephemeral: true})
                    } 
                    if (!gamertag && discordid || !discordid && gamertag) {
                      if (!gamertag && discordid) hackerProfile = await hackerDB.findOne({discord: discordid})
                      if (!discordid && gamertag) hackerProfile = await hackerDB.findOne({gamertag: gamertag})
                      if (!hackerProfile) return await interaction.reply({ content: `Player not found in the database!`, ephemeral: true})
                    }
                        if (!gamertag && !discordid && !profileid && realm || !gamertag && !discordid && !realm && profileid) {
                          hackerDB.countDocuments({ realm: realm }, async function (count) {
                            if (!realm) {
                              realmProfile = await realmProfileDB.findOne({profileID: profileid})
                              count = realmProfile.hackerCount
                            } else {
                              realmProfile = await realmProfileDB.findOne({name: realm})
                              count = realmProfile.hackerCount
                            }
                          searchEmbed = {
                            color: 946466,
                            title: `Result found for ${interaction.user.tag}!`,
                            description: `According to your search query, here is the realm profile I found.`,
                            fields: [
                              {
                                name: 'Realm',
                                value: `${realmProfile.name}`,
                                inline: true,
                              },
                              {
                                name: 'Realm Profile ID',
                                value: `${realmProfile.profileID}`,
                                inline: true,
                              },
                              {
                                name: 'Hacker Count',
                                value: `${count}`,
                                inline: true,
                              },
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                              text: `${process.env.FOOTER}`,
                              icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                            },
                          };
                          await submitted.reply({ content: `<:yes:1070502230203039744> Successfully found the realm profile for **${realmProfile.name}**`, ephemeral: true})
                          return interaction.channel.send({ embeds: [searchEmbed] }).catch(() => {
                            return
                          })
                        });
                        } else if (gamertag || discordid) {
                          searchEmbed = {
                            color: 946466,
                            title: `Result found for ${interaction.user.tag}!`,
                            description: `According to your search query, here is the Realm Hacker that I found.`,
                            fields: [
                              {
                                name: 'Gamertag',
                                value: `${hackerProfile.gamertag}`,
                                inline: true,
                              },
                              {
                                name: 'XUID',
                                value: `${hackerProfile.xuid}`,
                                inline: true,
                              },
                              {
                                name: 'Discord ID',
                                value: `${hackerProfile.discord}`,
                                inline: true,
                              },
                              {
                                name: 'Database ID',
                                value: `${hackerProfile.dbid}`,
                                inline: true,
                              },
                              {
                                name: 'Realm',
                                value: `${hackerProfile.realm}`,
                                inline: true,
                              },
                              {
                                name: 'Reason',
                                value: `${hackerProfile.reason}`,
                                inline: true,
                              },
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                              text: `${process.env.FOOTER}`,
                              icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                            },
                          };
                          await submitted.reply({content: `<:yes:1070502230203039744> Successfully found **${hackerProfile.gamertag}** in the hacker database! They were banned for **${hackerProfile.reason}**!`, ephemeral: true})
                          return interaction.channel.send({ embeds: [searchEmbed] }).catch(() => {
                              return
                            })
                        }
                                    }
              } else if (databaseType === 'discord') {
              const discordSearchModal = new ModalBuilder()
              .setCustomId('discordSearchModal')
              .setTitle('Search for a user in the database');
              const discordIdInput = new TextInputBuilder()
              .setCustomId('discordIdInput')
              .setLabel("What is their discord ID?")
              .setStyle(TextInputStyle.Short)
              .setMinLength(7)
              .setPlaceholder('Their discord ID.')
              .setRequired(true);
          const actionRow1 = new ActionRowBuilder().addComponents(discordIdInput);
          discordSearchModal.addComponents(actionRow1);
          await interaction.showModal(discordSearchModal);
          const filter = (interaction) => interaction.customId === 'discordSearchModal';
          interaction.awaitModalSubmit({ filter, time: 999999 })
            .then(async interaction => 
            {
                  let discordID = submitted.fields.getTextInputValue('discordIdInput');
                  if (typeof Number(discordID) != Number) return await interaction.reply({ content: `There was an error with this command, try again!`, ephemeral: true})
                  let user = await interaction.client.users.fetch(`${discordID}`);
                  if (!user) return await interaction.reply({content: `Couldn't find a user with the Discord ID of: **${discordID}**!`, ephemeral: true})
                  var userProfile = await discordDB.findOne({userID: discordID})
                  if (!userProfile) return await interaction.reply({ content: `User not found in the database!`, ephemeral: true})
                        searchEmbed = {
                          color: 946466,
                          title: `Result found for ${interaction.user.tag}!`,
                          description: `According to your search query, here is the Discord User I found.`,
                          fields: [
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
                              value: `${userProfile.dbid}`,
                              inline: true,
                            },
                            {
                              name: 'Reason',
                              value: `${userProfile.reason}`,
                              inline: true,
                            },
                          ],
                          timestamp: new Date().toISOString(),
                          footer: {
                            text: `${process.env.FOOTER}`,
                            icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                          },
                        };
                        interaction.channel.send({ embeds: [searchEmbed] }).catch(() => {
      return
    })
                        return await submitted.reply({ content: `<:yes:1070502230203039744> Successfully found **${user.tag}・${user.id}**! They were added for **${userProfile.reason}**!`, ephemeral: true})
            }).catch( async submitted => {
              return
            })
          }
        }
            if (interaction.options.getSubcommand() === 'remove') {
                if (!userData.databasePerms) return await interaction.reply({ content: `Invalid Permission! You can not remove from the database!`, ephemeral: true})
                const databaseType = interaction.options.getString('database')
                if (databaseType === 'realm') {
                  const dbid = interaction.options.getString('database-id')
                  let hackerData = await hackerDB.findOne({ dbid: dbid })
                  if (!hackerData) return interaction.reply({ content: `This user isn't in the database!`, ephemeral: true })
                const removeLog = {
                    color: 946466,
                    title: 'Player removed from the RHD database',
                    description: `${interaction.user.tag} removed a player from the Realms+ Hacker Database.`,
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
                      icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                    },
                  };
                  await realmProfileDB.collection.updateOne({name: hackerData.realm},{ 
                    $inc: {
                      hackerCount: -1
                    }
                    });
                  id.send({ embeds: [removeLog] });
                  await submitted.reply({ content: `<:yes:1070502230203039744> Successfully removed **${hackerData.gamertag}** from the RHD database!`, ephemeral: true })
                  return hackerDB.deleteOne({
                    dbid: dbid
                  })
                } else if (databaseType === 'discord') {
                    const dbid = interaction.options.getString('database-id')
                    let hackerData = await discordDB.findOne({ dbid: dbid })
                    if (!hackerData) return interaction.reply({ content: `This user isn't in the database!`, ephemeral: true })
                    let user = await interaction.client.users.fetch(`${hackerData.userID}`);
                  const removeLog = {
                      color: 946466,
                      title: 'User removed from the RDUD database',
                      description: `${interaction.user.tag} removed a user from the Realms+ Discord User Database.`,
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
                        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                      },
                    };
                    id.send({ embeds: [removeLog] });
                    await submitted.reply({ content: `<:yes:1070502230203039744> Successfully removed **${user.tag}・${user.id}** from the RDUD database!`, ephemeral: true })
                    return discordDB.deleteOne({
                      dbid: dbid
                    })
                }
            }
            if (interaction.options.getSubcommand() === 'leaderboard') {
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
                  desc += `**${i + 1}.** __${name}__\nHacker Count: **${hackers}**\n\n`
                }
                const lbEmbed = {
                  color: 946466,
                  title: 'Realms+ Realm Profile Leaderboard!',
                  description: `${desc}`,
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
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
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                  },
                };
                await id.send({ embeds: [lbLog] });
                return await interaction.reply({ embeds: [lbEmbed] }).catch(() => {
      return
    })
              }
              if (interaction.options.getString('type') === 'admin') {
                if (!userData.isAdmin) return await interaction.reply({content: `Invalid Permission! You must be a Realms+ Admin to run this command!`, ephemeral: true})
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
                  title: 'Realms+ Admin Leaderboard!',
                  description: `${desc}`,
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
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
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                  },
                };
                await id.send({ embeds: [lbLog] });
                return await interaction.reply({ embeds: [lbEmbed] }).catch(() => {
      return
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
                  const user = await interaction.client.users.fetch(`${id}`).catch(() => {
      return
    })
                  let name = user.tag
                  let reportNumber = listSort[i].reportCount
                  desc += `**${i + 1}.** __${name}__・__${id}__\nReport Count: **${reportNumber}**\n\n`
                }
                const lbEmbed = {
                  color: 946466,
                  title: 'Realms+ Report Leaderboard!',
                  description: `${desc}`,
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
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
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                  },
                };
                await id.send({ embeds: [lbLog] });
                return await interaction.reply({ embeds: [lbEmbed] }).catch(() => {
      return
    })
              }
          }
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Database Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
        console.log(error)
	}
	},
};