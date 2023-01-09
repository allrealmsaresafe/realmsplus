const { Events, ActivityType } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
    try {
      if (message.author.bot) return
      message.client.user.setPresence({
        activities: [{ name: `${message.client.guilds.cache.size} realms`, type: ActivityType.Watching }],
        status: 'online',
    })
      const id = await message.client.channels.fetch(`1060345095347523644`)
      let userData = await userDB.findOne({ userID: message.author.id })
      if (!userData) {
        newUser = await userDB.create({userID: message.author.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
        userData = await userDB.findOne({ userID: message.author.id })
      }
      let serverData = await serverDB.findOne({ serverID: message.guild.id })
      if (!serverData) {
        newServer = await serverDB.create({serverID: message.guild.id,botBan: false,isAdmin: false,hasPremium: false});newServer.save()
        serverData = await serverDB.findOne({ serverID: message.guild.id })
      }
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
              text: 'RealmDB; The best database of hackers on MCBE.',
              icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
            },
          };
          
          id.send({ embeds: [logEmbed] });
          return message.channel.send(context[1])
      }
      if (message.content.toLowerCase().startsWith('!leave')) {
        const context = message.content.split('!leave')
        const guild = await message.client.guilds.fetch(`${context[1]}`)
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
            text: 'RealmDB; The best database of hackers on MCBE.',
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
              text: 'RealmDB; The best database of hackers on MCBE.',
              icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
            },
          };
          
          return id.send({ embeds: [logEmbed] });
        } else {
          return message.reply('Failed to create invite.\n\n**Reason:** Couldn\'t find a channel to make an invite on.')
        }
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
    }
  } catch (error) {
    message.reply('There has been an error! Sending to the developers!')
    const errorChannel = await message.client.channels.fetch('1060347445722230867')
    await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${message.guild.name}**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **messageCreate event has an error**\nError: **${error}**\n\`\`\` \`\`\``)
    console.log(error)}
	},
};