require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async(message, args) => {
    let userData = await userDB.findOne({
        userID: message.author.id
    })
    if (userData === null) {
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
            isAdmin: false
        });
        newUser.save().catch((error) => {
            return console.log(error)
        }).catch((error) => {
            return console.log(error)
        })
        userData = await userDB.findOne({
            userID: message.author.id
        })
    }
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!say\` is a command that echoes your message back using the bot.\n\nSyntax: !say <context>`)
    if (!userData.isAdmin) return
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const fixedMessage1 = args.toString()
    const fixedMessage = fixedMessage1.replaceAll(',', ' ')
    if (fixedMessage.includes('@')) return message.reply(`Pings aren't allowed for this command.`)
    const messageNot = `**${message.author.tag}:** ${fixedMessage}`
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
            icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
        },
    };
    id.send({
        embeds: [logEmbed]
    });
    message.author.id === '943653593548984341' || message.author.id === '1010616280547594240' ? message.channel.send(`${fixedMessage}`) : message.channel.send(`${messageNot}`)
    return message.delete().catch((error) => {
        return console.log(error)
    })
};