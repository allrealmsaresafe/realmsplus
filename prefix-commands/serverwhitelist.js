const createServerEntry = require("../utils/createServerEntry");
const createUserEntry = require("../utils/createUserEntry");
require('dotenv').config()
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') return message.reply(`\`!serverwhitelist\` is a command that allows for a server to be whitelisted from the effects of the Security Measures put in place to prevent server botting.\n\nSyntax: !serverwhitelist <server-id>`)
    let userData = await userDB.findOne({ userID: message.author.id })
    if (userData === null) {
      newUser = await createUserEntry(message.author.id).catch(() => {});
      userData = await userDB.findOne({ userID: message.author.id })
    }
    if (!userData.isAdmin) return
    let serverData = await serverDB.findOne({ serverID: args.toString().replaceAll(' ', '') })
    if (serverData === null) {
      newServer = await createServerEntry(args.toString().replaceAll(' ', ''));
      serverData = await serverDB.findOne({ serverID: args.toString().replaceAll(' ', '') })
    }
    if (serverData.whitelisted) return message.reply('This server is already whitelisted!')
    const id = message.client.channels.cache.get(`1060345095347523644`)
    const whitelistLog = {
        color: 946466,
        title: 'New server whitelisted',
        description: `Someone whitelisted a guild.`,
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
            name: 'Target Guild ID',
            value: `${args.toString().replaceAll(' ', '')}`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
        },
      };
      id.send({ embeds: [whitelistLog] });
      message.reply(`<:yes:1070502230203039744> Successfully whitelisted the guild with the ID: **${args.toString().replaceAll(' ', '')}**!`)
      await serverDB.findOneAndUpdate({
        serverID: args.toString().replaceAll(' ', '')
    }, {
        $set: {
            whitelisted: true,
        }
    })
  };