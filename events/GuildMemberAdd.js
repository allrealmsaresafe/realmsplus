const createServerEntry = require("../utils/createServerEntry");
const createUserEntry = require("../utils/createUserEntry");
const { Events } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const discordDB = require('../models/discordDB')
const mongoose = require('mongoose')

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(guildMember) {
    try {
    if (mongoose.connection.readyState != 1) return
    let userData = await userDB.findOne({ userID: guildMember.id })
    if (!userData) {
      newUser = await createUserEntry(guildMember.id);
      userData = await userDB.findOne({ userID: guildMember.id })
    }
    let discordUser = await discordDB.findOne({ userID: guildMember.id })
    let serverData = await serverDB.findOne({ serverID: guildMember.guild.id })
    if (!serverData) {
      newServer = await createServerEntry(guildMember.guild.id);
      serverData = await serverDB.findOne({ serverID: guildMember.guild.id })
    }
    
    if (serverData.discordBanModule && discordUser) {
      let user = await guildMember.client.users.fetch(`${guildMember.id}`)
        if (serverData.logsChannel) {
            const banLog = {
                color: 946466,
                title: `New user banned from ${guildMember.guild.name}!`,
                description: `The user \`${user.tag}\`・\`${guildMember.id}\` was found in the Realms+ Discord User Database and has been automatically banned from this server.\nmore infromation regarding it will be below.`,
                fields: [
                  {
                    name: 'User Tag',
                    value: `${user.tag}`,
                    inline: true,
                  },
                  {
                    name: 'User ID',
                    value: `${guildMember.id}`,
                    inline: true,
                  },
                  {
                    name: 'Database ID',
                    value: `${discordUser.dbid}`,
                    inline: true,
                  },
                  {
                    name: 'Reason',
                    value: `Found in Realms+ Discord User Database. For [${discordUser.reason}]`,
                    inline: true,
                  },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                  text: `${process.env.FOOTER}`,
                  icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                },
              };
              const channel = guildMember.client.channels.cache.get(`${serverData.logsChannel}`)
              channel.send({ embeds: [banLog] })
        }
        return guildMember.guild.members.ban(guildMember);
    }
  } catch (error) {
    console.log(error)
  }
	},
};