require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!unban\` is a command that when executed on a user, unbans them from inviting and using Realms+.\n\nSyntax: !unban <user-id>`)
    if (message.author.id != '943653593548984341') return
    const user = await message.client.users.fetch(`${args.toString().replaceAll(' ', '')}`);
    if (!user) return message.reply(`User not found!`)

    let userData = await userDB.findOne({ userID: user.id })
    if (!userData) {
      newUser = await userDB.create({userID: user.id,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save()
      userData = await userDB.findOne({ userID: user.id })
    }
    if (!userData.botBan) return message.reply('This user is not banned from Realms+!')
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const reportLog = {
        color: 946466,
        title: 'New user unbanned from using Realms+',
        description: `Someone unbanned a user from using Realms+.`,
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
            name: 'Unbanned User Tag',
            value: `${user.tag}`,
            inline: true,
          },
          {
            name: 'Unbanned User ID',
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
      message.reply(`Successfully unbanned <@${args.toString().replaceAll(' ', '')}> from Realms+!`)
      await userDB.findOneAndUpdate({
        userID: user.id
    }, {
        $set: {
            botBan: false,
        }
    })
  };