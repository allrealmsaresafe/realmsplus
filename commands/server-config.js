const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const createServerEntry = require("../utils/createServerEntry");
const createUserEntry = require("../utils/createUserEntry");
const serverDB = require('../models/serverDB');
const userDB = require('../models/userDB');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-config')
		.setDescription('Allows you to configure your server.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban-module')
        .setDescription('Allows you to configure the Discord Ban Module.')
        .addStringOption(option => 
          option
            .setName('toggle')
            .setDescription('Toggle the Discord Ban Module.')
            .addChoices(
              { name: 'Enable', value: 'on' },
              { name: 'Disable', value: 'off' },
              )
        )
    )
    .addSubcommand(subCommand =>
      subCommand
        .setName('logs-channel')
        .setDescription('Allows you to configure the Logs Channel.')
        .addChannelOption(option => 
          option
            .setName('channel')
            .setDescription('Set the Logs Channel.')
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
	async execute(interaction) {
		try {
			if (mongoose.connection.readyState != 1) 
        return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true });

			let userData = await userDB.findOne({ userID: interaction.user.id });
      if (!userData) {
        newUser = await createUserEntry(interaction.user.id);
        userData = await userDB.findOne({ userID: interaction.user.id });
      }

      let serverData = await serverDB.findOne({ serverID: interaction.guild.id });
      if (!serverData) {
        newServer = await createServerEntry(interaction.guild.id);
        serverData = await serverDB.findOne({ serverID: interaction.guild.id })
      }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Invalid permission! You need the \`Administrator\` permission to run this command!`, ephemeral: true})
            if (interaction.options.getSubcommand() === 'ban-module') {
              let toggleType = interaction.options.getString('toggle')
              if (!toggleType) {
                if (serverData.discordBanModule) e = 'enabled'
                if (!serverData.discordBanModule) e = 'disabled'
                return await interaction.reply({ content: `The **Discord Ban Module** is currently ${e}!`, ephemeral: true})
              }
              if (toggleType === 'on' && serverData.discordBanModule) return await interaction.reply({ content: `Can't enable module! This module is already enabled!`, ephemeral: true})
              if (toggleType === 'off' && !serverData.discordBanModule) return await interaction.reply({ content: `Can't disable module! This module is not enabled!`, ephemeral: true})
                  var infoEmbed = {
                      color: 946466,
                      title: `<:yes:1070502230203039744> Successfully turned the Discord Ban Module ${toggleType}!`,
                      description: `Anyone who is in the Realms+ Discord User Database will be instantly banned from this server!`,
                      timestamp: new Date().toISOString(),
                      footer: {
                        text: `${process.env.FOOTER}`,
                        icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                      },
                    };
                    await serverDB.findOneAndUpdate({
                      serverID: interaction.guild.id
                  }, {
                      $set: {
                          discordBanModule: true,
                      }
                  })
            }
            if (interaction.options.getSubcommand() === 'logs-channel') {
              const channel = interaction.options.getChannel('channel')
              if (!channel) {
                if (serverData.logsChannel) e = `set to <#${serverData.logsChannel}>`
                if (!serverData.logsChannel) e = 'disabled'
                return await interaction.reply({ content: `The **Logs Channel** is currently ${e}!`, ephemeral: true})
              }
              if (serverData.logsChannel === channel.id) return await interaction.reply({ content: `The channel <#${channel.id}>・[Jump to channel](https://discord.com/channels/${interaction.guild.id}/${channel.id}) is already the Logs Channel!`, ephemeral: true})
              var infoEmbed = {
                      color: 946466,
                      title: `<:yes:1070502230203039744> Successfully set the Logs Channel in ${interaction.guild.name}!`,
                      description: `Any time Realms+ needs to send a log, it will send to <#${channel.id}>・[Jump to channel](https://discord.com/channels/${interaction.guild.id}/${channel.id})`,
                      timestamp: new Date().toISOString(),
                      footer: {
                        text: `${process.env.FOOTER}`,
                        icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                      },
                    };
                    await serverDB.findOneAndUpdate({
                      serverID: interaction.guild.id
                  }, {
                      $set: {
                          logsChannel: `${channel.id}`,
                      }
                  })
          }
          return interaction.reply({ embeds: [infoEmbed], ephemeral: true });
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1086347050838401074')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Module Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};