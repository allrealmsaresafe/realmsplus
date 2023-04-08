require('dotenv').config()
const userDB = require('../models/userDB')
const realmProfileDB = require('../models/realmProfileDB')
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
    if (!userData.isAdmin) return
    const id = message.client.channels.cache.get(`1060345095347523644`)
    let result = await realmProfileDB.find({});
    const listRaw = result.map(profile => '**' + profile.name + '**' + '\nID: ' + profile.profileID + '\nHacker Count: ' + profile.hackerCount);
    const list = listRaw.toString().replaceAll(',', '\n\n')
    const logEmbed = {
        color: 946466,
        title: 'I just got the list of realm profiles.',
        description: 'A Realms+ admin got the list of realm profiles! Here is the information regarding it.',
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
    const profileEmbed = {
        color: 946466,
        title: 'List of all Realm Profiles in Realms+',
        description: `${list}`,
        timestamp: new Date().toISOString(),
        footer: {
            text: `${process.env.FOOTER}`,
            icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
        },
    };
    return message.reply({
        embeds: [profileEmbed]
    });
};