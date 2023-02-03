const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Enmap = require('enmap')
require('dotenv').config()
const token = process.env.TOKEN
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });
const mongoose = require('mongoose')
const userDB = require('./models/userDB')
const eventsPath = path.join(__dirname, './events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const commandCooldown = new Set();
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.prefixcommands = new Enmap();

fs.readdir("./prefix-commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./prefix-commands/${file}`);
    let commandName = file.split(".")[0];
    client.prefixcommands.set(commandName, props);
  });
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	let userData = await userDB.findOne({ userID: interaction.user.id })
	if (!userData) {
	  newUser = await userDB.create({userID: interaction.user.id,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,botBan: false,isAdmin: false});newUser.save().catch()
	  userData = await userDB.findOne({ userID: interaction.user.id })
	}
	if (userData.botBan) return interaction.reply({ content: `Uh oh! You are banned from using Realms+!`, ephemeral: true })
	if (commandCooldown.has(interaction.user.id)) {
		return await interaction.reply({content: `You can only run a command every 5 seconds!`, ephemeral: true});
		} else {
			if (!userData.isAdmin) {
				commandCooldown.add(interaction.user.id);
				setTimeout(() => {
					commandCooldown.delete(interaction.user.id);
				  }, 5000);
			}
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		const errorChannel = client.channels.cache.get('1060347445722230867')
		errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Slash Command execute error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
		console.log(error)
	}
}
});

// const { request } = require('undici');
// const express = require('express');
// const clientId = process.env.APPCLIENTID;
// const clientSecret = process.env.CLIENTSECRET;
// const port = process.env.PORT;

// const app = express();

// app.get('/', async ({ query }, response) => {
// 	const { code } = query;

// 	if (code) {
// 		try {
// 			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
// 				method: 'POST',
// 				body: new URLSearchParams({
// 					client_id: clientId,
// 					client_secret: clientSecret,
// 					code,
// 					grant_type: 'authorization_code',
// 					redirect_uri: `http://localhost:${port}`,
// 					scope: 'identify',
// 				}).toString(),
// 				headers: {
// 					'Content-Type': 'application/x-www-form-urlencoded',
// 				},
// 			});

// 			const oauthData = await tokenResponseData.body.json();

// 			const userResult = await request('https://discord.com/api/users/@me', {
// 				headers: {
// 					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
// 				},
// 			});

// 			console.log(await userResult.body.json());
// 		} catch (error) {
// 			// NOTE: An unauthorized token will not throw an error
// 			// tokenResponseData.statusCode will be 401
// 			console.error(error);
// 		}
// 	}

// 	return response.sendFile('index.html', { root: '.' });
// });

// app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

client.login(token);