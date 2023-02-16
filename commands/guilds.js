const { SlashCommandBuilder } = require('discord.js');
const userDB = require('../models/userDB');
const mongoose = require('mongoose');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guilds')
    .setDescription('Gets all of the guilds I am in.'),
  async execute(interaction) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return await interaction.reply({
          content: 'Database not connected! Run the command again in 5 seconds!',
          ephemeral: true,
        });
      }

      const userData = await userDB.findOne({ userID: interaction.user.id });
      if (!userData) {
        await userDB.create({
          userID: interaction.user.id,
          botBan: false,
          xuid: '0',
          accessToken: '0',
          email: '0',
          ownedRealms: [{ realmID: '0', realmName: '0' }],
          addCount: 0,
          reportCount: 0,
          isAdmin: false,
          databasePerms: false,
        });
        userData = await userDB.findOne({ userID: interaction.user.id });
      }
      if (!userData.isAdmin) {
        return interaction.reply({
          content: 'Invalid Permission! You do not have permission to run this command!',
          ephemeral: true,
        });
      }

      const guilds = interaction.client.guilds.cache.map(guild => `${guild.name}\nID: ${guild.id}`);
      const exampleEmbed = {
        color: 946466,
        title: `Here are all of the guilds that I am in! [${interaction.client.guilds.cache.size}]`,
        description: guilds.join('\n\n')
	  }
      return interaction.reply({ embeds: [exampleEmbed] });
    } catch (error) {
      const errorChannel = interaction.client.channels.cache.get('1060347445722230867');
      await errorChannel.send(`There has been an error! Here is the information surrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Guilds Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``);
      console.log(error);
    }
  },
};