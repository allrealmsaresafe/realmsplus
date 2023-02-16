const { SlashCommandBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const mongoose = require('mongoose')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides helpful information to help you out.'),
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
          .setEmoji(`🏢`)
          .setURL('https://discord.gg/Q2ndaxNqVy')
					.setLabel('Support Server')
					.setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                    .setEmoji(`📕`)
                    .setURL('https://youtu.be/v_qcr58lXDQ')
                  .setLabel('Documentation')
                  .setStyle(ButtonStyle.Link),
                  new ButtonBuilder()
                  .setEmoji(`🙏`)
                  .setURL('https://youtu.be/KmtzQCSh6xk')
                .setLabel('Tutorial')
                .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                .setEmoji(`⚙️`)
              .setLabel('Command List')
              .setCustomId(`cmdlist`)
              .setStyle(ButtonStyle.Secondary),
              );
              const row2 = new ActionRowBuilder()
			.addComponents(
            new ButtonBuilder()
            .setEmoji(`❓`)
            .setCustomId(`faq`)
          .setLabel('FAQ')
          .setStyle(ButtonStyle.Secondary),
            )
            const helpEmbed = {
                color: 946466,
                title: 'Realms+ |A Minecraft: Bedrock Edition Realm Manager.',
                description: `Realms+ is A Minecraft: Bedrock Edition Realm Manager which allows users to manage their realm directly from discord!\nWe also have a database of realm hackers and malicious discord users to stop them from joining your realm or discord server.`,
                timestamp: new Date().toISOString(),
                footer: {
                  text: `${process.env.FOOTER}`,
                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                },
              };
              await interaction.reply({ embeds: [helpEmbed], components: [row, row2] });
                const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

                collector.on('collect', async i => {
                    if (i.user.id === interaction.user.id) {
                        if (i.customId === 'cmdlist') {
                            const cmdList = {
                                color: 946466,
                                title: 'Realms+ Commands',
                                description: `**Database Commands:**\n\`/database search <type realm|discord>\` - Allows a user to search the Realms+ hacker database for a gamertag, discord id, realm name, or realm profile id.\n\`/database report <type realm|discord>\` - Allows a user to report a hacker to the Realms+ team with a chance that they get added to the hacker database if enough proof is given.\n\`/database leaderboard <type realm|discord> <type realm|user>\` - Allows a user to display the Realm Profile Leaderboard.\n\`/help\` - Provides helpful information about Realms+.\n\`/bot-info\` - Provides stats/information about Realms+.\n\`/server-info\` Provides stats/information about the server you're in.\n\`/user-info <user>\` - Provides stats/information about a specific user.\n\`/lookup <gamertag|xuid>\` - Allows users to lookup an Xbox User based on their Gamertag or XUID.`,
                                timestamp: new Date().toISOString(),
                                footer: {
                                  text: `${process.env.FOOTER}`,
                                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                                },
                              };
                              return await interaction.editReply({ embeds: [cmdList], components: []})
                        }
                        if (i.customId === 'faq') {
                            const faq = {
                                color: 946466,
                                title: 'Realms+ Frequently Asked Questions',
                                description: `**Frequently Asked Questions:**\n\`𝗤\` **How are false database bans prevented?**\n\`𝗔\` *When a report is submitted, it goes through a system of review in which the Realms+ Team analyzes the proof before making a decision.*\n\`𝗤\` **What is the purpose of Realms+?**\n\`𝗔\` *Realms+ is a bot that allows realm owners to manage their realm directly from discord and search the database of hackers and malicious discord users so they can protect their realm even more!*`,
                                timestamp: new Date().toISOString(),
                                footer: {
                                  text: `${process.env.FOOTER}`,
                                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                                },
                              };
                              return await interaction.editReply({ embeds: [faq], components: []})
                        } 
                    } else {
                        i.reply({ content: `This button is not for you!`, ephemeral: true });
                    }
                });
                collector.on('end', () => {
                });
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Help Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
	},
};