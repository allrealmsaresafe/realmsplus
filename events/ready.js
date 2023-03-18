const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose')
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const activities = [`${client.guilds.cache.size} servers!`, `#ARAS`, `Find hackers in your realm`, `#allrealmsaresafe`, `Best MCBE Database`]
		const updateDelay = 60
		let currentIndex = 0

		setInterval(() => {
			const activity = activities[currentIndex]
			client.user.setPresence({
				activities: [{ name: `${activity}`, type: ActivityType.Watching }],
				status: 'online',
			});
			currentIndex = currentIndex >= activities.length - 1 
			? 0
			: currentIndex + 1
		}, updateDelay * 1000)
		console.log(`Ready! Logged in as ${client.user.tag}`);
		await mongoose.connect(process.env.MONGO_URI || '', {keepAlive: true})
	},
};