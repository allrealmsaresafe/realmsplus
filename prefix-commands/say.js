require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
    let userData = await userDB.findOne({ userID: message.author.id })
    if (!userData) {
      newUser = await userDB.create({userID: message.author.id,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save()
      userData = await userDB.findOne({ userID: message.author.id })
    }
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!say\` is a command that echoes your message back using the bot.\n\nSyntax: !say <context>`)
    if (!userData.isAdmin) return message.reply(`You must be an official Realms+ Admin to run this command!`)
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const fixedMessage1 = args.toString()
    const fixedMessage = fixedMessage1.replaceAll(',', ' ')
    const logEmbed = {
      color: 946466,
      title: 'I just said something at the request of a user.',
      description: 'A Realms+ admin used the say prefix command! Here is the information regarding it.',
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
          value: `${fixedMessage}`,
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
    message.channel.send(`${fixedMessage}`)
    return message.delete().catch(() => {
      return
    })
  };