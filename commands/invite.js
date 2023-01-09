const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Sends an invite link to the bot.'),
	async execute(interaction) {
		try {
			const row = new ActionRowBuilder()
			.addComponents(
        	new ButtonBuilder()
          .setURL('https://discord.com/api/oauth2/authorize?client_id=978506954114736158&permissions=8&scope=bot%20applications.commands')
					.setLabel('Invite Me!')
					.setStyle(ButtonStyle.Link),
          new ButtonBuilder()
          .setURL('https://discord.gg/Q2ndaxNqVy')
					.setLabel('Support Server')
					.setStyle(ButtonStyle.Link),
			);

		return await interaction.reply({ content: 'Thanks for inviting me! Find hackers in your realm today!', components: [row] });
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Invite Command has an error**\nError: **${error}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};