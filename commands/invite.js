const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const mongoose = require('mongoose')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Sends an invite link to the bot.'),
	async execute(interaction) {
		try {
						if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
			const row = new ActionRowBuilder()
			.addComponents(
        	new ButtonBuilder()
            .setEmoji(`🤖`)
          .setURL('https://discord.com/api/oauth2/authorize?client_id=978506954114736158&permissions=8&scope=bot%20applications.commands')
					.setLabel('Bot Invite')
					.setStyle(ButtonStyle.Link),
          new ButtonBuilder()
          .setEmoji(`🙌`)
          .setURL('https://discord.gg/Q2ndaxNqVy')
					.setLabel('Support Server')
					.setStyle(ButtonStyle.Link),
			);

		return await interaction.reply({ content: 'Thanks for inviting me! Protect your realm today!', components: [row] });
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1086347050838401074')
		if (interaction.channel) await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**・**${interaction.guild.id}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Invite Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};