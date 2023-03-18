require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!dm\` is a command that when executed on a user, DMs them a certain query.\n\nSyntax: !dm <user-id> <query>.`)
    const argsFixed = args.toString().split(',')
    const user = await message.client.users.fetch(`${argsFixed[0]}`);
    const context = `${argsFixed.toString().replace(argsFixed[0], '').replaceAll(',', ' ').replaceAll('  ', ', ')}`
    if (!user) return message.reply(`<:error:1086371516565950474> **IdError:** User not found!`)
    let userData = await userDB.findOne({ userID: user.id })
    if (userData === null) {
      newUser = await userDB.create({userID: user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false});newUser.save().catch((error) => {
                        return console.log(error)
                      }).catch()
      userData = await userDB.findOne({ userID: user.id })
    }
    if (message.author.id !== '943653593548984341' && message.author.id !== '659742263399940147') return
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const logEmbed = {
      color: 946466,
      title: 'Someone was DMed by a Realms+ Admin.',
      description: 'A user was just DMed by a Realms+ Admin! Here is the information regarding it.',
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
          {
            name: 'DM Contents',
            value: `${context}`,
            inline: true,
          },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
      },
    };
    id.send({ embeds: [logEmbed] });
    user.send(`${context}`).catch(error => {
      return message.reply('Error! This usually occurs when the user has DMs off!')
    })
    return message.reply(`<:yes:1070502230203039744> Successfully sent \`${context}\` to **${user.tag}・${user.id}**!`)
  };