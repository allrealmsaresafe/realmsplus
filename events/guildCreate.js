const createServerEntry = require("../utils/createServerEntry");
const createUserEntry = require("../utils/createUserEntry");
const serverDB = require('../models/serverDB');
const userDB = require('../models/userDB');
const { Events } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute(guild) {
    try {
    	if (mongoose.connection.readyState != 1) 
        return;

      const id = await guild.client.channels.fetch(`1060345116000268428`);
      let userData = await userDB.findOne({ userID: guild.ownerId });
      
      if (!userData) {
        newUser = await createUserEntry(guild.ownerId);
        userData = await userDB.findOne({ userID: guild.ownerId });
      }

      let serverData = await serverDB.findOne({ serverID: guild.id });

      if (!serverData) {
        newServer = await createServerEntry(guild.id);
        serverData = await serverDB.findOne({ serverID: guild.id })
      }

      if (userData.botBan || serverData.botBan) {
        const joinEmbed = {
          color: 946466,
          title: 'Unable to Join Guild',
          description: 'A blacklisted user/server just tried to invite me! Here is the information regarding it.',
          fields: [
            {
              name: 'Owner ID',
              value: `${guild.ownerId}`,
            },
            {
              name: 'Guild ID',
              value: `${guild.id}`,
              inline: false,
            },
            {
              name: 'Guild Name',
              value: `${guild.name}`,
              inline: false,
            },
            {
              name: 'Member Count',
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

        id.send({ embeds: [joinEmbed] })
        return guild.leave()
      }
      // if (guild.memberCount < 30 && !userData.isAdmin && !serverData.whitelisted) {
      //   if (guild.systemChannel) guild.systemChannel.send(`Sorry! For security reasons your server must have over 30 members to use Realms+!`)
      //   const joinEmbed = {
      //     color: 946466,
      //     title: 'Unable to Join Guild',
      //     description: 'A server with less than 30 members just tried to invite me! Here is the information regarding it.',
      //     fields: [
      //       {
      //         name: 'Owner ID',
      //         value: `${guild.ownerId}`,
      //       },
      //       {
      //         name: 'Guild ID',
      //         value: `${guild.id}`,
      //         inline: false,
      //       },
      //       {
      //         name: 'Guild Name',
      //         value: `${guild.name}`,
      //         inline: false,
      //       },
      //       {
      //         name: 'Member Count',
      //         value: `${guild.memberCount}`,
      //         inline: true,
      //       },
      //     ],
      //     timestamp: new Date().toISOString(),
      //     footer: {
      //       text: `${process.env.FOOTER}`,
      //       icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
      //     },
      //   };

      //   id.send({ embeds: [joinEmbed] })
      //   return guild.leave()
      // }
      const joinEmbed = {
        color: 946466,
        title: 'Thanks for inviting Realms+!',
        description: 'Please run `/help` if you need help!\nPlease make sure to also join our Support Server if you need more help:\nhttps://discord.gg/Q2ndaxNqVy',
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
        },
      }

      if (guild.systemChannel) 
        guild.systemChannel.send({ embeds: [joinEmbed] });

      const joinLogEmbed = {
        color: 946466,
        title: 'Joined a new server!',
        description: `I was just invited to **${guild.name}**・**${guild.id}** <t:${Math.trunc(Date.now() / 1000)}:R>! The owner of the server is **<@${guild.ownerId}>** and their id is **${guild.ownerId}**! The server has **${guild.memberCount}** members!`,
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
        },
      };

      id.send({ embeds: [joinLogEmbed] }).catch(() => {});
    } catch (error) {
      console.log(error);
      const errorChannel = await message.client.channels.fetch('1086347050838401074');
      await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **Can't get Guild Name**\nUser Who Found It: **${message.author.tag}**・**${message.author.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **guildCreate event has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``);
    }
	},
};