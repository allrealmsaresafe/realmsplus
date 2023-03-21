const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const clientId = process.env.CLIENTID;
const token = process.env.TOKEN;
    
const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.applicationCommands(clientId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });