const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose')
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const realmProfileDB = require('../models/realmProfileDB')
require('dotenv').config()
const { request } = require('undici');
const { authenticate } = require('@xboxreplay/xboxlive-auth')
const XboxLiveAPI = require('@xboxreplay/xboxlive-api')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('realm')
		.setDescription('Interact with your miencraft realm.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('player-list')
                .setDescription('Lists all of the players online on your realm.')
                .addStringOption(option => option.setName('realm').setDescription('The realm you want to use.').addChoices(
                  { name: 'Enable', value: 'on' },
                  { name: 'Disable', value: 'off' },
                ).setRequired(true)))
                .addSubcommand(subcommand =>
                  subcommand
                      .setName('realm')
                      .setDescription('Find a realm based on a query.')
                      .addStringOption(option => option.setName('realm').setDescription('The Gamertag or XUID.').setRequired(true))),
	async execute(interaction) {
		try {
      if (mongoose.connection.readyState != 1) return await interaction.reply(`Database not connected! Run the command again in 5 seconds!`)
			let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false,reportCount: 0,botBan: false,isAdmin: false});newUser.save()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
            let serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            if (!serverData) {
              newServer = await serverDB.create({serverID: interaction.guild.id,whitelisted: false,discordBanModule: false,logsChannel: '0',gamertag: '0',addCount: 0, basicPlan: false,arasPlan: false,arasPlusPlan: false});newServer.save()
              serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            }
            const { live, xbl } = require('@xboxreplay/xboxlive-auth')

const authorizeUrl = live.getAuthorizeUrl(
	`${process.env.AZURE_CLIENT_ID}`,
	'XboxLive.signin XboxLive.offline_access',
	'code',
	`${process.env.AZURE_REDIRECT_URI}`
);
console.log(authorizeUrl)
const code = 'RETURNED_CODE';
const exchangeCodeResponse = await live.exchangeCodeForAccessToken(code);

const rpsTicket = exchangeCodeResponse.access_token;
const refreshToken = exchangeCodeResponse.refresh_token; // May be undefined

const userTokenResponse = await xbl.exchangeRpsTicketForUserToken(
	rpsTicket,
	'd' // Required for custom Azure applications
);

const XSTSTokenResponse = await xbl.exchangeTokenForXSTSToken(
	userTokenResponse.Token
);

const hasExpired = new Date() >= new Date(XSTSTokenResponse.NotAfter);

if (hasExpired === true && !!refreshToken) {
	const refreshResponse = await live.refreshAccessToken(
		refreshToken,
		`${process.env.AZURE_CLIENT_ID}`,
		'XboxLive.signin XboxLive.offline_access',
		`${process.env.AZURE_CLIENT_SECRET}`
	);

	cosole.info(refreshResponse);
	// exchangeRpsTicketForUserToken(...)
	// exchangeTokenForXSTSToken(...)
	// etc.
}
    } catch (error) {
      const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
      await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Realm Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
          console.log(error)
    }
  }
}