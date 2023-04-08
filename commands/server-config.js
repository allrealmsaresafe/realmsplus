const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType
} = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const discordDB = require('../models/discordDB')
const mongoose = require('mongoose')
module.exports = {
  data: new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Setup your server.')
      .addSubcommand(subcommand =>
          subcommand
          .setName('ban-module')
          .setDescription('Allows you to set the Discord Ban Module.')
          .addStringOption(option => option.setName('toggle').setDescription('Toggle the Discord Ban Module.').addChoices({
              name: 'Enable',
              value: 'on'
          }, {
              name: 'Disable',
              value: 'off'
          }, )))
      .addSubcommand(subcommand =>
          subcommand
          .setName('logs-channel')
          .setDescription('Allows you to set your server\'s Logs Channel.')
          .addChannelOption(option => option.setName('channel').setDescription('Set the Logs Channel.').addChannelTypes(ChannelType.GuildText)))
      .addSubcommand(subcommand =>
          subcommand
          .setName('notifications')
          .setDescription('Allows you to set your server\'s notifications.')
          .addStringOption(option => option.setName('type').setDescription('Type of channel you want to follow.').addChoices({
              name: 'Hacker Database Additions',
              value: 'Hacker Database Channel'
          }, {
              name: 'Discord Database Additions',
              value: 'Discord Database Channel'
          }, {
              name: 'Alts Additions',
              value: 'Alts Channel'
          }, {
              name: 'Crash Account Additions',
              value: 'Crash Account Channel'
          }, {
              name: 'News',
              value: 'News Channel'
          }, {
              name: 'ARAS Announcements',
              value: 'ARAS Announcements Channel'
          }, ).setRequired(true))),
  async execute(interaction) {
      try {
          if (mongoose.connection.readyState != 1) return await interaction.reply({
              content: `Database not connected! Run the command again in 5 seconds!`,
              ephemeral: true
          })
          let userData = await userDB.findOne({
              userID: interaction.user.id
          })
          if (!userData) {
              newUser = await userDB.create({
                  userID: interaction.user.id,
                  botBan: false,
                  xuid: '0',
                  accessToken: '0',
                  email: '0',
                  ownedRealms: [{
                      realmID: '0',
                      realmName: '0'
                  }],
                  addCount: 0,
                  reportCount: 0,
                  isAdmin: false,
                  databasePerms: false
              });
              newUser.save().catch((error) => {
                  return console.log(error)
              })
              userData = await userDB.findOne({
                  userID: interaction.user.id
              })
          }
          let serverData = await serverDB.findOne({
              serverID: interaction.guild.id
          })
          if (!serverData) {
              newServer = await serverDB.create({
                  serverID: interaction.guild.id,
                  discordBanModule: false,
                  logsChannel: '0',
              });
              newServer.save().catch((error) => {
                  return console.log(error)
              })
              serverData = await serverDB.findOne({
                  serverID: interaction.guild.id
              })
          }
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({
              content: `Invalid permission! You need the \`Administrator\` permission to run this command!`,
              ephemeral: true
          })
          if (interaction.options.getSubcommand() === 'ban-module') {
              let toggleType = interaction.options.getString('toggle')
              if (serverData.discordBanModule) e = true
              if (!serverData.discordBanModule) e = false
              if (!toggleType) {
                  if (e) return await interaction.reply({
                      content: `The **Discord Ban Module** is currently enabled!`,
                      ephemeral: true
                  })
                  if (!e) return await interaction.reply({
                      content: `The **Discord Ban Module** is currently disabled!`,
                      ephemeral: true
                  })
              }
              if (toggleType === 'on' && e) return await interaction.reply({
                  content: `Can't enable module! This module is already enabled!`,
                  ephemeral: true
              })
              if (toggleType === 'off' && !e) return await interaction.reply({
                  content: `Can't disable module! This module is not enabled!`,
                  ephemeral: true
              })
              var infoEmbed = {
                  color: 946466,
                  title: `<:yes:1070502230203039744> Successfully turned the Discord Ban Module ${toggleType}!`,
                  description: `Anyone who is in the Realms+ Discord User Database will be instantly banned from this server!`,
                  timestamp: new Date().toISOString(),
                  footer: {
                      text: `${process.env.FOOTER}`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
              };
              await serverDB.findOneAndUpdate({
                  serverID: interaction.guild.id
              }, {
                  $set: {
                      discordBanModule: e,
                  }
              })
              const serverMembers = interaction.guild.members.fetch()
              serverMembers.forEach(async member => {
                  const memberData = await discordDB.findOne({
                      userID: member.id
                  })
                  if (memberData) {
                      interaction.guild.members.ban(member);
                      if (serverData.logsChannel) {
                          const banLog = {
                              color: 946466,
                              title: `New user banned from ${interaction.guild.name}!`,
                              description: `The user \`${member.tag}\`・\`${member.id}\` was found in the Realms+ Discord User Database and has been automatically banned from this server.\nmore infromation regarding it will be below.`,
                              fields: [
                                  {
                                      name: 'User Tag',
                                      value: `${member.tag}`,
                                      inline: true,
                            },
                                  {
                                      name: 'User ID',
                                      value: `${member.id}`,
                                      inline: true,
                            },
                                  {
                                      name: 'Database ID',
                                      value: `${memberData.dbid}`,
                                      inline: true,
                            },
                                  {
                                      name: 'Reason',
                                      value: `Found in Realms+ Discord User Database. For [${memberData.reason}]`,
                                      inline: true,
                            },
                          ],
                              timestamp: new Date().toISOString(),
                              footer: {
                                  text: `${process.env.FOOTER}`,
                                  icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                              },
                          };
                          const channel = interaction.client.channels.cache.get(`${serverData.logsChannel}`)
                          channel.send({
                              embeds: [banLog]
                          })
                      }
                  }
              })
          }
          if (interaction.options.getSubcommand() === 'logs-channel') {
              const channel = interaction.options.getChannel('channel')
              if (!channel) {
                  if (serverData.logsChannel) e = `set to <#${serverData.logsChannel}>`
                  if (!serverData.logsChannel) e = 'disabled'
                  return await interaction.reply({
                      content: `The **Logs Channel** is currently ${e}!`,
                      ephemeral: true
                  })
              }
              if (serverData.logsChannel === channel.id) return await interaction.reply({
                  content: `The channel <#${channel.id}>・[Jump to channel](https://discord.com/channels/${interaction.guild.id}/${channel.id}) is already the Logs Channel!`,
                  ephemeral: true
              })
              var infoEmbed = {
                  color: 946466,
                  title: `<:yes:1070502230203039744> Successfully set the Logs Channel in ${interaction.guild.name}!`,
                  description: `Any time Realms+ needs to send a log, it will send to <#${channel.id}>・[Jump to channel](https://discord.com/channels/${interaction.guild.id}/${channel.id})`,
                  timestamp: new Date().toISOString(),
                  footer: {
                      text: `${process.env.FOOTER}`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
              };
              await serverDB.findOneAndUpdate({
                  serverID: interaction.guild.id
              }, {
                  $set: {
                      logsChannel: `${channel.id}`,
                  }
              })
          }
          if (interaction.options.getSubcommand() === 'notifications') {
              if (!interaction.channel) return interaction.reply(`**ChannelError:** You must run this command in a server channel.`)
              const type = interaction.options.getString('type')
              if (type === 'Hacker Database Channel') notiChannel = interaction.client.channels.cache.get(`${process.env.HACKERDB_CHANNEL}`)
              if (type === 'Discord Database Channel') notiChannel = interaction.client.channels.cache.get(`${process.env.DISCORDDB_CHANNEL}`)
              if (type === 'Alts Channel') notiChannel = interaction.client.channels.cache.get(`${process.env.ALTS_CHANNEL}`)
              if (type === 'Crash Account Channel') notiChannel = interaction.client.channels.cache.get(`${process.env.CRASHDB_CHANNEL}`)
              if (type === 'News Channel') notiChannel = interaction.client.channels.cache.get(`${process.env.NEWS_CHANNEL}`)
              if (type === 'ARAS Announcements Channel') notiChannel = interaction.client.channels.cache.get(`${process.env.ARAS_ANNOUNCEMENT_CHANNEL}`)
              var infoEmbed = {
                  color: 946466,
                  title: `<:yes:1070502230203039744> Successfully followed the ${type}!`,
                  description: `Any time there is a new message or announcement sent to the \`${type}\` it will send to \`${interaction.channel.name}\`!`,
                  timestamp: new Date().toISOString(),
                  footer: {
                      text: `${process.env.FOOTER}`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                  },
              };
              notiChannel.addFollower(interaction.channel.id, `${interaction.user.tag} set this notification config.`).catch((error) => {
                  return console.log(error)
              })
          }
          return interaction.reply({
              embeds: [infoEmbed],
              ephemeral: true
          });
      } catch (error) {
          const errorChannel = interaction.client.channels.cache.get(`${process.env.ERROR_CHANNEL}`)
          if (interaction.channel) await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**・**${interaction.guild.id}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Server Config Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
          console.log(error)
      }
  },
};