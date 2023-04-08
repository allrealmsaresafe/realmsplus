const {
    Events,
    ActivityType
} = require('discord.js');
const mongoose = require('mongoose')
const hackerDB = require('../models/hackerDB')
const discordDB = require('../models/discordDB')
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const activities = [`${client.guilds.cache.size} servers!`, `#ARAS`, `Find hackers in your realm`, `#allrealmsaresafe`, `Best MCBE Database`, `Realms+ v2.0`]
        const updateDelay = 60
        let currentIndex = 0

        setInterval(() => {
            const activity = activities[currentIndex]
            client.user.setPresence({
                activities: [{
                    name: `${activity}`,
                    type: ActivityType.Watching
                }],
                status: 'online',
            });
            currentIndex = currentIndex >= activities.length - 1 ?
                0 :
                currentIndex + 1
        }, updateDelay * 1000)
        mongoose.connect(process.env.MONGO_URI || '', {
            keepAlive: true
        })
        await hackerDB.countDocuments({}, function (err, count) {
            discordDB.countDocuments({}, function (err, count_discord) {
                console.log(`\n\n\nRealms+ Successfully Started.\n\nRealms+ Stats:\n→ Tag: ${client.user.tag}\n→ ID: ${client.user.id}\n→ Server Count: ${client.guilds.cache.size}\n→ Hacker Database Count: ${count}\n→ Discord Database Count: ${count_discord}`);
            }).catch((error) => {
                return
            })
        }).catch((error) => {
            return
        })
    },
};