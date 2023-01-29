const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose')
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
			client.user.setPresence({
				activities: [{ name: `${client.guilds.cache.size} servers!`, type: ActivityType.Watching }],
				status: 'online',
			});
		console.log(`Ready! Logged in as ${client.user.tag}`);
		await mongoose.connect(process.env.MONGO_URI || '', {keepAlive: true})
	},
};