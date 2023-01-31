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
        newUser = await userDB.create({userID: message.author.id,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save()
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
      const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd = message.client.prefixcommands.get(command);
      if (!cmd) return;
      cmd.run(message, args);
      return
      if (userData.isAdmin) {
          if (message.content.toLowerCase().startsWith('!invite')) {
        const context = message.content.split('!invite')
        const guild = await message.client.guilds.fetch(`${context[1]}`)
        if (guild.systemChannel) {
          guild.systemChannel.createInvite().then(inv => message.reply(`Here is the invite to **${guild.name}**!\n\n${inv.url}`))
          const logEmbed = {
            color: 946466,
            title: 'Invite prefix command',
            description: 'A Realms+ admin used the invite prefix command! Here is the information regarding it.',
            fields: [
              {
                name: 'Author ID',
                value: `${message.author.id}`,
                inline: true,
              },
              {
                name: 'Server ID',
                value: `${message.guild.id}`,
                inline: true,
              },
              {
                name: 'Target Guild ID',
                value: `${guild.id}`,
                inline: true,
              },
              {
                name: 'Target Guild Name',
                value: `${guild.name}`,
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: `${process.env.FOOTER}`,
              icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
            },
          };
          
          return id.send({ embeds: [logEmbed] });
        } else {
          return message.reply('Failed to create invite.\n\n**Reason:** Couldn\'t find a channel to make an invite on.')
        }
      }
      if (message.content.toLowerCase().startsWith('!massleave')) {
        const context = message.content.split('!massleave')
        let user = await message.client.users.fetch(`${context[1].replaceAll(' ', '')}`);
        message.client.guilds.cache.forEach(guild => {
          if(guild.ownerId === `${user.id}`) guild.leave()
          })
          return message.reply(`Left all guilds that <@${user.id}> owns!`)
      }
    }
    if (message.author.id === "943653593548984341") {
      if (message.content.toLowerCase().startsWith('!admin')) {
        const context = message.content.split('!admin')
        let user = await message.client.users.fetch(`${context[1].replaceAll(' ', '')}`);
        let userData = await userDB.findOne({ userID: user.id })
        if (!userData) {
          newUser = await userDB.create({userID: user.id,botBan: false,isAdmin: false});newUser.save()
          userData = await userDB.findOne({ userID: user.id })
        }
        if (userData.isAdmin) return message.reply('This user is already an admin!')
        message.reply(`Successfully made <@${context[1].replaceAll(' ', '')}> an admin for Realms+!`)
        await userDB.findOneAndUpdate({
          userID: user.id
      }, {
          $set: {
              isAdmin: true,
          }
      })
      }
      if (message.content.toLowerCase().startsWith('!serverwhitelist')) {
        const context = message.content.split('!botban')
        let user = await message.client.users.fetch(`${context[1].replaceAll(' ', '')}`);
        if (userData.botBan) return message.reply('This user is already banned from Realms+!')
        const reportLog = {
          color: 946466,
          title: 'New user banned from using Realms+',
          description: `Someone banned a user from using Realms+.`,
          fields: [
            {
              name: 'Author ID',
              value: `${message.author.id}`,
              inline: true,
            },
            {
              name: 'Server ID',
              value: `${message.guild.id}`,
              inline: true,
            },
            {
              name: 'Banned User Tag',
              value: `${user.tag}`,
              inline: true,
            },
            {
              name: 'Banned User ID',
              value: `${user.id}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: `${process.env.FOOTER}`,
            icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
          },
        };
        const id = message.client.channels.cache.get(`1060345095347523644`)
        id.send({ embeds: [reportLog] });
        message.reply(`Successfully banned <@${context[1].replaceAll(' ', '')}> from using Realms+!`)
        await userDB.findOneAndUpdate({
          userID: user.id
      }, {
          $set: {
              botBan: true,
          }
      })
      }
    }
  } catch (error) {
    const errorChannel = await message.client.channels.fetch('1060347445722230867')
    await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **Can't get Guild Name**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **messageCreate event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
    console.log(error)
  }
	},
};