const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userDB = require('../models/userDB')
const mongoose = require('mongoose')
const hackerDB = require('../models/hackerDB')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot-info')
		.setDescription('Information about Realms+.'),
	async execute(interaction) {
		try {
						if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,botBan: false,isAdmin: false});newUser.save().catch()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
			let ping = Math.floor(interaction.client.ws.ping) - 50 < 0
			if (ping < 0) ping = 34
			hackerDB.countDocuments({}, function (err, count) {
			const infoEmbed = {
			color: 946466,
			title: 'Information about Realms+',
			fields: [
			  {
				name: 'Server Count',
				value: `${interaction.client.guilds.cache.size}`,
				inline: true,
			  },
			  {
				name: 'Hacker Count',
				value: `${count}`,
				inline: true,
			  },
			  {
				name: 'Support Server',
				value: `[Here](https://discord.gg/aras)`,
				inline: true,
			  },
			  {
				name: 'Developers',
				value: `[Point](https://github.com/PointTheDeveloper)・[Shadowsniper784](https://github.com/Shadowsniper784)`,
				inline: true,
			  },
			  {
				name: 'Version',
				value: `v${process.env.VERSION}`,
				inline: true,
			  },
			  {
				name: 'Ping',
				value: `${ping}`,
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
		});
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Bot Information Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};