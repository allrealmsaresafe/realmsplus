require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
const guild = await message.client.guilds.fetch(`${args.toString().replaceAll(' ', '')}`).catch(error => console.log(error))
if (!guild) return message.reply(`Couldn't find that guild!`)
guild.leave()
const id = message.client.channels.cache.get(`1060345095347523644`)
const logEmbed = {
  color: 946466,
  title: 'Leave prefix command',
  description: 'A Realms+ admin used the leave prefix command! Here is the information regarding it.',
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
      value: `${guild.id}`,
      inline: true,
    },
    {
      name: 'Target Guild Name',
      value: `${guild.name}`,
      inline: true,
    },
    {
      name: 'Target Guild Member Count',
      value: `${guild.memberCount}`,
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
return message.reply(`<:yes:1070502230203039744> Successfully left **${guild.name}**!`)
}