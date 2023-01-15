const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose')
const hackerDB = require('../models/hackerDB')
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		hackerDB.countDocuments({}, function (err, count) {
			client.user.setPresence({
				activities: [{ name: `${count} hackers`, type: ActivityType.Watching }],
				status: 'online',
			});
		});
		console.log(`Ready! Logged in as ${client.user.tag}`);
		await mongoose.connect(process.env.MONGO_URI || '', {keepAlive: true})
	},
};