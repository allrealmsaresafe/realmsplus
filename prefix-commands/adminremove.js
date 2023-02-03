require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!adminremove\` is a command that when executed on an admin, removes their Realms+ Admin\n\nSyntax: !adminremove <user-id>.`)
    const user = await message.client.users.fetch(`${args.toString().replaceAll(' ', '')}`);
    if (!user) return message.reply(`User not found!`)
    let userData = await userDB.findOne({ userID: user.id })
    if (!userData) {
      newUser = await userDB.create({userID: user.id,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save().catch()
      userData = await userDB.findOne({ userID: user.id })
    }
    if (!userData.isAdmin) return message.reply(`This user is not an admin!`)
    if (message.author.id !== '943653593548984341' && message.author.id !== '659742263399940147') return
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const logEmbed = {
      color: 946466,
      title: 'Someone was just lost their Realms+ Admin.',
      description: 'An admin just lost their Realms+ Admin! Here is the information regarding it.',
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
          name: 'Target User ID',
          value: `${user.id}`,
          inline: true,
        },
        {
            name: 'Target User Tag',
            value: `${user.tag}`,
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
    await userDB.findOneAndUpdate({
        userID: user.id
    }, {
        $set: {
            isAdmin: false,
        }
    })
    return message.reply(`Successfully removed <@${user.id}> from being an admin for Realms+!`)
  };