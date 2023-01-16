const { Events, ActivityType } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const mongoose = require('mongoose')
module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
    try {
      if (message.author.bot) return
      if (mongoose.connection.readyState != 1) return
      const id = await message.client.channels.fetch(`1060345095347523644`)
      let userData = await userDB.findOne({ userID: message.author.id })
      if (!userData) {
        newUser = await userDB.create({userID: message.author.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
        userData = await userDB.findOne({ userID: message.author.id })
      }
      if (userData.botBan) return
      let serverData = await serverDB.findOne({ serverID: message.guild.id })
      if (!serverData) {
        newServer = await serverDB.create({serverID: message.guild.id,botBan: false,isAdmin: false,hasPremium: false});newServer.save()
        serverData = await serverDB.findOne({ serverID: message.guild.id })
      }
      hackerDB.countDocuments({}, function (err, count) {
        message.client.user.setPresence({
          activities: [{ name: `${count} hackers`, type: ActivityType.Watching }],
          status: 'online',
        });
      });
      if (userData.isAdmin) {
      if (message.content.toLowerCase().startsWith('!say')) {
            const context = message.content.split('!say')
          message.delete()
          const logEmbed = {
            color: 946466,
            title: 'Say prefix command',
            description: 'A RealmDB admin used the say prefix command! Here is the information regarding it.',
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
                name: 'Contents',
                value: `${context[1]}`,
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: `${process.env.FOOTER}`,
              icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
            },
          };
          
          id.send({ embeds: [logEmbed] });
          return message.channel.send(context[1])
          // const logEmbed = {
          //   color: 946466,
          //   title: 'About All Realms are Safe (ARS)',
          //   description: 'All Realms Are Safe is a community of realm owners, minecraft enthusiasts and wannabe vigilantes who have one goal in mind, try to solve the growing hacker problem on Minecraft: Bedrock Edition. We mainly take down big hacker groups and try to make ways to protect your realm more known to the public.',
          //   image: { url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png' },
          //   timestamp: new Date().toISOString(),
          //   footer: {
          //     text: `${process.env.FOOTER}`,
          //     icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
          //   },
          // };
          
          // return message.channel.send({ embeds: [logEmbed] });
      }
      if (message.content.toLowerCase().startsWith('!leave')) {
        const context = message.content.split('!leave')
        const guild = await message.client.guilds.fetch(`${context[1]}`).catch(error => console.log(error))
        if (!guild) return message.reply(`Couldn't find that guild!`)
        guild.leave()
        const logEmbed = {
          color: 946466,
          title: 'Leave prefix command',
          description: 'A RealmDB admin used the leave prefix command! Here is the information regarding it.',
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
        
        id.send({ embeds: [logEmbed] });
        return message.reply(`Successfully left **${guild.name}**!`)
      }
          if (message.content.toLowerCase().startsWith('!invite')) {
        const context = message.content.split('!invite')
        const guild = await message.client.guilds.fetch(`${context[1]}`)
        if (guild.systemChannel) {
          guild.systemChannel.createInvite().then(inv => message.reply(`Here is the invite to **${guild.name}**!\n\n${inv.url}`))
          const logEmbed = {
            color: 946466,
            title: 'Invite prefix command',
            description: 'A RealmDB admin used the invite prefix command! Here is the information regarding it.',
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
        let userData = await userDB.findOne({ userID: message.author.id })
        if (!userData) {
          newUser = await userDB.create({userID: message.author.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
          userData = await userDB.findOne({ userID: message.author.id })
        }
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
          newUser = await userDB.create({userID: user.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
          userData = await userDB.findOne({ userID: user.id })
        }
        if (userData.isAdmin) return message.reply('This user is already an admin!')
        message.reply(`Successfully made <@${context[1].replaceAll(' ', '')}> an admin for RealmDB!`)
        await userDB.findOneAndUpdate({
          userID: user.id
      }, {
          $set: {
              isAdmin: true,
          }
      })
      }
      if (message.content.toLowerCase().startsWith('!botban')) {
        const context = message.content.split('!botban')
        let user = await message.client.users.fetch(`${context[1].replaceAll(' ', '')}`);
        let userData = await userDB.findOne({ userID: user.id })
        if (!userData) {
          newUser = await userDB.create({userID: user.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
          userData = await userDB.findOne({ userID: user.id })
        }
        if (userData.botBan) return message.reply('This user is already banned from RealmDB!')
        message.reply(`Successfully banned <@${context[1].replaceAll(' ', '')}> from using RealmDB!`)
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
    await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${message.guild.name}**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **messageCreate event has an error**\nError: **${error}**\n\`\`\` \`\`\``)
    console.log(error)
  }
	},
};