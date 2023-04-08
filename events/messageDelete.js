const {
  Events,
  ActivityType
} = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const mongoose = require('mongoose')
require('dotenv').config()
module.exports = {
  name: Events.MessageDelete,
  once: false,
  async execute(message) {
      try {
          if (mongoose.connection.readyState != 1) return
          let userData = await userDB.findOne({
              userID: message.author.id
          })
          if (!userData) {
              newUser = await userDB.create({
                  userID: message.author.id,
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
                  userID: message.author.id
              })
          }
          let serverData = await serverDB.findOne({
              serverID: message.guild.id
          })
          if (!serverData) {
              newServer = await serverDB.create({
                  serverID: message.guild.id,
                  discordBanModule: false,
                  logsChannel: '0',
              });
              newServer.save().catch((error) => {
                  return console.log(error)
              })
              serverData = await serverDB.findOne({
                  serverID: message.guild.id
              })
          }

      } catch (error) {
          const errorChannel = await message.client.channels.fetch(`${process.env.ERROR_CHANNEL}`)
          if (message.channel) await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${message.guild.name}**・**${message.guild.id}**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **messageDelete event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
          console.log(error)
      }
  },
};