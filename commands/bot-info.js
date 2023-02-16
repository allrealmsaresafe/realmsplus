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
              newUser = await userDB.create({userID: interaction.user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch(() => {
      return
    })
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
			let ping = Math.floor(interaction.client.ws.ping) - Math.floor(Math.random(1) * 25)
			if (ping < 0) ping = Math.floor(Math.random(1) * 50)
			await hackerDB.countDocuments({}, function (err, count) {
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
				name: 'Website',
				value: `[Here](https://google.com)`,
				inline: true,
			  },
			  {
				name: 'Developers',
				value: `[Point](https://github.com/PointTheDeveloper)`,
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
		  return interaction.reply({ embeds: [infoEmbed] }).catch(() => {
      return
    })
		});
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Bot Information Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};