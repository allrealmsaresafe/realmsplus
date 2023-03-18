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
			if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false, databasePerms: false});newUser.save().catch((error) => {
                        return console.log(error)
                      })
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
			  icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
			},
		  };
		  return interaction.reply({ embeds: [infoEmbed] })
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1086347050838401074')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **User Information Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};