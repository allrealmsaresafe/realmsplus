const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userDB = require('../models/userDB')
const mongoose = require('mongoose')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Information about a user.')
        .addUserOption(option => option.setName('user').setDescription('The user you want information on.')),
	async execute(interaction) {
		try {
			if (mongoose.connection.readyState != 1) return await interaction.reply(`Database not connected! Run the command again in 5 seconds!`)
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,hasPremium: false,reportCount: 0,botBan: false,isHacker: false,isAdmin: false});newUser.save()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
            let user = interaction.options.getMember('user')
            let user1 = interaction.options.getUser('user')
            if (!user) {
                user = interaction.member
                user1 = interaction.user
            }
            const roles = user.roles.cache.map(role => role)
            if (user.bot) return interaction.reply({ content: `You can not run this command on bots!`, ephemeral: true})
            let roleSize = ``
            if (user.roles.cache.length > 15) roleSize = `.. and ${user.roles.cache.length - 15} more.`
			const infoEmbed = {
			color: 946466,
			title: `Information about ${user1.tag}`,
            setThumbnail: `${user.displayAvatarURL()}`,
			fields: [
			  {
				name: 'Account Tag',
				value: `${user1.tag}`,
				inline: true,
			  },
			  {
				name: 'Account ID',
				value: `${user.id}`,
				inline: true,
			  },
			  {
				name: 'Account Register Date',
				value: `<t:${Math.trunc(user1.createdTimestamp / 1000)}:R>`,
				inline: true,
			  },
			  {
				name: 'Server Join Date',
				value: `<t:${Math.trunc(user.joinedTimestamp / 1000)}:R>`,
				inline: true,
			  },
			  {
				name: `Roles [${roles.length}]`,
				value: `${roles}`,
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
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **User Information Command has an error**\nError: **${error}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};