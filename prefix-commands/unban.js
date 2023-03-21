const createUserEntry = require("../utils/createUserEntry");
const userDB = require('../models/userDB');
require('dotenv').config();

exports.run = async (message, args) => {
    if (args.toString().replaceAll(' ', '') === '') 
      return message.reply(`\`!unban\` is a command that when executed on a user, unbans them from inviting and using Realms+.\n\nSyntax: !unban <user-id>`);

    if (message.author.id != '943653593548984341') 
      return;

    const user = await message.client.users.fetch(`${args.toString().replaceAll(' ', '')}`);
    if (!user) 
      return message.reply(`<:error:1086371516565950474> **IdError:** User not found!`);

    let userData = await userDB.findOne({ userID: user.id });
    if (userData === null) {
      newUser = await createUserEntry(user.id);
      userData = await userDB.findOne({ userID: user.id });
    }

    if (!userData.botBan) 
      return message.reply('This user is not banned from Realms+!');

    const id = message.client.channels.cache.get(`1060345095347523644`)
    const reportLog = {
      color: 946466,
      title: 'New user unbanned from using Realms+',
      description: `Someone unbanned a user from using Realms+.`,
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
          name: 'Unbanned User Tag',
          value: `${user.tag}`,
          inline: true,
        },
        {
          name: 'Unbanned User ID',
          value: `${user.id}`,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `${process.env.FOOTER}`,
        icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
      },
    };

    id.send({ embeds: [reportLog] });
    message.reply(`<:yes:1070502230203039744> Successfully unbanned <@${args.toString().replaceAll(' ', '')}> from Realms+!`)
    await userDB.findOneAndUpdate({
      userID: user.id
    }, {
      $set: {
        botBan: false,
      }
    })
  };