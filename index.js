const createUserEntry = require("./utils/createUserEntry");
const userDB = require('./models/userDB');
const path = require('node:path');
const Enmap = require('enmap');
const fs = require('node:fs');
require('dotenv').config();

const { 
	GatewayIntentBits,
	Collection,
	Client,
	Events
} = require('discord.js');

const token = process.env.TOKEN;
const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.Guilds,
	] 
});

const eventsPath = path.join(__dirname, './events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const commandCooldown = new Set();

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else
		client.on(event.name, (...args) => event.execute(...args));
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
  	if (err) 
  		return console.error(err);

	for(const file of files) {
		if (!file.endsWith(".js")) 
			continue;

		let props = require(`./prefix-commands/${file}`);
		let commandName = file.split(".")[0];
		client.prefixcommands.set(commandName, props);
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) 
		return;

	let userData = await userDB.findOne({ userID: interaction.user.id });
	if (userData === null) {
		newUser = await createUserEntry(interaction.user.id);

	  	userData = await userDB.findOne({ userID: interaction.user.id });
	}

	if (userData.botBan) 
		return interaction.reply({ content: `Uh oh! You are banned from using Realms+!`, ephemeral: true });

	if (commandCooldown.has(interaction.user.id))
		return await interaction.reply({content: `You can only run a command every 5 seconds!`, ephemeral: true});
	else {
		if (!userData.isAdmin) {
			commandCooldown.add(interaction.user.id);
			setTimeout(() => commandCooldown.delete(interaction.user.id), 5000);
		}

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.log(error)
			const errorChannel = client.channels.cache.get('1086347050838401074');
			errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Slash Command execute error**\nError: **${error.stack}**\n\`\`\` \`\`\``);
		}
	}
});
const activities = ['${client.guilds.cache.size} servers!', 'join the ARAS movement', 'Cheater/crasher DataBase'];

client.on('ready', () => {
  	const updateDelay = 5; // in seconds
  	let currentIndex = 0;

  	setInterval(() => {
  	  const activity = activities[currentIndex];
  	  client.user.setActivity(activity);

  	  // update currentIndex
  	  // if it's the last one, get back to 0
  	  currentIndex = currentIndex >= activities.length - 1 
  	    ? 0
  	    : currentIndex + 1;
  	}, updateDelay * 1000);
});

client.login(token);