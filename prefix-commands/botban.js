require('dotenv').config()
const { InteractionCollector } = require('discord.js');
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!botban\` is a command that when executed on a user, bans them from inviting and using Realms+.\n\nSyntax: !botban <user-id>`)
    const user = await message.client.users.fetch(`${args.toString().replaceAll(' ', '')}`).catch(async (error) => {
      return await message.reply('Couldn\'t find that user!')
    })
    let userData = await userDB.findOne({ userID: user.id })
    if (userData === null) {
      newUser = await userDB.create({userID: user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false});newUser.save().catch()
      userData = await userDB.findOne({ userID: user.id })
    }
    if (userData.botBan) return message.reply('This user is already banned from Realms+!')
    const id = message.client.channels.cache.get(`1060345095347523644`)
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
      id.send({ embeds: [reportLog] });
      message.reply(`<:yes:1070502230203039744> Successfully banned <@${args.toString().replaceAll(' ', '')}> from using Realms+!`)
      await userDB.findOneAndUpdate({
        userID: user.id
    }, {
        $set: {
            botBan: true,
        }
    })
    message.client.guilds.cache.forEach(guild => {
      if(guild.ownerId === `${user.id}`) guild.leave()
      })
  };