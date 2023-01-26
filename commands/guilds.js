const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userDB = require('../models/userDB')
const mongoose = require('mongoose')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('guilds')
		.setDescription('Gets all of the guilds im in.'),
	async execute(interaction) {
		try {
						if (mongoose.connection.readyState != 1) return await interaction.reply(`Database not connected! Run the command again in 5 seconds!`)
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,hasPremium: false,reportCount: 0,botBan: false,isHacker: false,isAdmin: false});newUser.save()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
			if (!userData.isAdmin) return interaction.reply({ content: `Invalid Permission! You do not have permission to run this command!`, ephemeral: true })
    const Guilds = interaction.client.guilds.cache.map(guild => guild.name + '\nID: ' + guild.id);
    const guildList = Guilds.toString().replaceAll(',', '\n\n')
    const exampleEmbed = new EmbedBuilder()
	.setColor('0e7122')
	.setTitle(`Here are all of the guilds that I am in! [${interaction.client.guilds.cache.size}]`)
	.setDescription(`**${guildList}**`)

return interaction.reply({ embeds: [exampleEmbed] });
		// return await interaction.reply(Guilds);
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Guilds Command has an error**\nError: **${error}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};