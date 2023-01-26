require('dotenv').config()
const userDB = require('../models/userDB')
const realmProfileDB = require('../models/realmProfileDB')
exports.run = async (message, args) => {
    let userData = await userDB.findOne({ userID: message.author.id })
    if (!userData) {
      newUser = await userDB.create({userID: message.author.id,botBan: false,hasPremium: false,reportCount: 0,isHacker: false,isAdmin: false});newUser.save()
      userData = await userDB.findOne({ userID: message.author.id })
    }
    if (!userData.isAdmin) return message.reply(`You must be an official RealmDB Admin to run this command!`)
    const id = message.client.channels.cache.get(`1060345095347523644`)
    let result = await realmProfileDB.find({});
    const listRaw = result.map(profile => '**' + profile.name + '**' + '\nID: ' + profile.profileID + '\nHacker Count: ' + profile.hackerCount);
    const list = listRaw.toString().replaceAll(',', '\n\n')
    const logEmbed = {
      color: 946466,
      title: 'I just got the list of realm profiles.',
      description: 'A RealmDB admin got the list of realm profiles! Here is the information regarding it.',
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
        icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
      },
    };
    id.send({ embeds: [logEmbed] });
    const profileEmbed = {
        color: 946466,
        title: 'List of all Realm Profiles in RealmDB',
        description: `${list}`,
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
        },
      };
      return message.reply({ embeds: [profileEmbed] });
  };