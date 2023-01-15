const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userDB = require('../models/userDB')
const mongoose = require('mongoose')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot-info')
		.setDescription('Information about RealmDB.'),
	async execute(interaction) {
		try {
			if (mongoose.connection.readyState != 1) return
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
			const infoEmbed = {
			color: 946466,
			title: 'Information about RealmDB',
			fields: [
			  {
				name: 'Server Count',
				value: `${interaction.client.guilds.cache.size}`,
				inline: true,
			  },
			  {
				name: 'User Count',
				value: `${interaction.client.users.cache.size}`,
				inline: true,
			  },
			  {
				name: 'Developers',
				value: `Point`,
				inline: true,
			  },
			  {
				name: 'Version',
				value: `${process.env.VERSION}`,
				inline: true,
			  },
			  {
				name: 'Ping',
				value: `${Math.round(client.ws.ping)}`,
				inline: true,
			  },
			  {
				name: 'Birthday',
				value: `January 4th, 2023`,
				inline: true,
			  },
			],
			timestamp: new Date().toISOString(),
			footer: {
			  text: `${process.env.FOOTER}`,
			  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
			},
		  };
		return interaction.reply({ embeds: [infoEmbed] });
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Bot Information Command has an error**\nError: **${error}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};