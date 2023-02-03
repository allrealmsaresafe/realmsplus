const { Events } = require('discord.js');
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const discordDB = require('../models/discordDB')
const mongoose = require('mongoose')
module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(guildMember) {
    if (mongoose.connection.readyState != 1) return
    let userData = await userDB.findOne({ userID: guildMember.id })
    if (!userData) {
      newUser = await userDB.create({userID: guildMember.id,botBan: false,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,isAdmin: false});newUser.save().catch()
      userData = await userDB.findOne({ userID: guildMember.id })
    }
    let discordUser = await discordDB.findOne({ userID: guildMember.id })
    let serverData = await serverDB.findOne({ serverID: guildMember.guild.id })
    if (!serverData) {
      newServer = await serverDB.create({serverID: guildMember.guild.id,whitelisted: false,discordBanModule: false,logsChannel: '0',gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false});newServer.save()
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
                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                },
              };
              const channel = guildMember.client.channels.cache.get(`${serverData.logsChannel}`)
              channel.send({ embeds: [banLog] })
        }
        return guildMember.guild.members.ban(guildMember);
    }
	},
};