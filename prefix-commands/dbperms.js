require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async(message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!dbperms\` is a command that when executed on a user, gives them access to add to the Realms+ Database.\n\nSyntax: !dbperms <user-id>.`)
    const user = await message.client.users.fetch(`${args.toString().replaceAll(' ', '')}`);
    if (!user) return message.reply(`<:error:1086371516565950474> **IdError:** User not found!`)
    let userData = await userDB.findOne({
        userID: user.id
    })
    let authorData = await userDB.findOne({
        userID: message.author.id
    })
    if (!userData) {
        newUser = await userDB.create({
            userID: user.id,
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
            userID: user.id
        })
    }
    if (userData.isAdmin) return message.reply(`This user already has Database Permissions!`)
    if (!authorData.isAdmin) return
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const logEmbed = {
        color: 946466,
        title: 'Someone was just given Realms+ Database Permissions.',
        description: 'A user was just given Realms+ Database Permissions! Here is the information regarding it.',
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
            icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
        },
    };
    id.send({
        embeds: [logEmbed]
    })
    await userDB.findOneAndUpdate({
        userID: user.id
    }, {
        $set: {
            databasePerms: true,
        }
    })
    return message.reply(`<:yes:1070502230203039744> Successfully gave <@${user.id}> Realms+ Database Permissions!`)
};