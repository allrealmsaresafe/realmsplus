const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose')
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const hackerDB = require('../models/hackerDB')
const realmProfileDB = require('../models/realmProfileDB')
require('dotenv').config()
const { live } = require('@xboxreplay/xboxlive-auth')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('realm')
		.setDescription('Interact with your minecraft realm.')

    //ban
    .addSubcommand(subcommand =>
      subcommand
      .setName('ban')
      .setDescription('Bans a player from your realm.')
      .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
        { name: 'All', value: 'all' },
        { name: 'Realm Example', value: 'r1' },
        { name: 'Realm Example', value: 'r2' },
      ).setRequired(true))
      .addStringOption(option => option.setName('player').setDescription('The player to ban, gamertag or xuid.').setRequired(true))
      .addStringOption(option => option.setName('reason').setDescription('The reason for this ban.'))
      .addAttachmentOption(option => option.setName('proof').setDescription('The proof for this ban.'))
      .addStringOption(option => option.setName('database-report').setDescription('Do you want to report this to the Hacker Database?').addChoices(
        { name: 'Yes', value: 'y' },
        { name: 'No', value: 'n' },
      )
      ))

          //kick
          .addSubcommand(subcommand =>
            subcommand
            .setName('kick')
            .setDescription('Kicks a player from your realm.')
            .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
              { name: 'Realm Example', value: 'r1' },
              { name: 'Realm Example', value: 'r2' },
            ).setRequired(true))
            .addStringOption(option => option.setName('player').setDescription('The player to kick, gamertag or xuid.').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('The reason for this kick.')))

                //status
                .addSubcommand(subcommand =>
                  subcommand
                  .setName('status')
                  .setDescription('Lists all of the players online on your realm.')
                  .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                    { name: 'All', value: 'all' },
                    { name: 'Realm Example', value: 'r1' },
                    { name: 'Realm Example', value: 'r2' },
                  ).setRequired(true))
                  .addStringOption(option => option.setName('type').setDescription('The status you want to change your realm to.').addChoices(
                    { name: 'Open', value: 'o' },
                    { name: 'Close', value: 'c' },
                  ).setRequired(true)))

                  //players
                  .addSubcommand(subcommand =>
                    subcommand
                    .setName('players')
                    .setDescription('Lists all of the players online on your realm.')
                    .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                      { name: 'All', value: 'all' },
                      { name: 'Realm Example', value: 'r1' },
                      { name: 'Realm Example', value: 'r2' },
                    ).setRequired(true))
                    .addStringOption(option => option.setName('type').setDescription('The type of players command you want to run.').addChoices(
                      { name: 'Recent Players', value: 'r' },
                      { name: 'Current Players Online', value: 'o' },
                    ).setRequired(true)))

                    //edit
                    .addSubcommand(subcommand =>
                      subcommand
                      .setName('edit')
                      .setDescription('Edits your realm settings.')
                      .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                        { name: 'Realm Example', value: 'r1' },
                        { name: 'Realm Example', value: 'r2' },
                      ).setRequired(true))
                      .addStringOption(option => option.setName('type').setDescription('The type of edit command you want to run.').addChoices(
                        { name: 'Rename Realm', value: '1' },
                      ).setRequired(true)))

                      //world
                      .addSubcommand(subcommand =>
                        subcommand
                        .setName('world')
                        .setDescription('Lists all of the players online on your realm.')
                        .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                          { name: 'Realm Example', value: 'r1' },
                          { name: 'Realm Example', value: 'r2' },
                        ).setRequired(true))
                        .addStringOption(option => option.setName('type').setDescription('The type of world command you want to run.').addChoices(
                          { name: 'Backup Realm', value: '1' },
                          { name: 'Upload World to Realm', value: '2' },
                        ).setRequired(true)))

                        //realm module
                        .addSubcommand(subcommand =>
                          subcommand
                          .setName('module')
                          .setDescription('Allows you to configure the Realms+ Realm Modules.')
                          .addStringOption(option => option.setName('module').setDescription('The module you want to configure.').addChoices(
                            { name: 'Realm → Discord Chatting', value: '1' },
                            { name: 'Discord → Realm Chatting', value: '2' },
                            { name: 'Autoban Players in the Hacker Database', value: '3' },
                          ).setRequired(true)))

                        //permissions
                        .addSubcommand(subcommand =>
                          subcommand
                          .setName('permissions')
                          .setDescription('Changes the permissions for a user on your realm.')
                          .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                            { name: 'Realm Example', value: 'r1' },
                            { name: 'Realm Example', value: 'r2' },
                          ).setRequired(true))
                          .addStringOption(option => option.setName('player').setDescription('The player to give the permission, gamertag or xuid.').setRequired(true))
                          .addStringOption(option => option.setName('permission').setDescription('The permission to give the player.').addChoices(
                            { name: 'Operator (DANGEROUS)', value: '1' },
                            { name: 'Member (Default)', value: '2' },
                            { name: 'Visitor', value: '2' },
                          ).setRequired(true)))

                          //console
                          .addSubcommand(subcommand =>
                            subcommand
                            .setName('console')
                            .setDescription('Allows you to execute commands on your realm.')
                            .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                              { name: 'Realm Example', value: 'r1' },
                              { name: 'Realm Example', value: 'r2' },
                            ).setRequired(true))
                            .addStringOption(option => option.setName('command').setDescription('The command to run on the realm.').setRequired(true)))

                            //automod
                            .addSubcommand(subcommand =>
                              subcommand
                              .setName('automod')
                              .setDescription('Allows you to configure your Automod Settings.')
                              .addStringOption(option => option.setName('logic').setDescription('The automod logic.').setRequired(true))
                              .addStringOption(option => option.setName('presets').setDescription('Preset automod logic.').setRequired(true).addChoices(
                                { name: 'Ban Windows Players', value: '1' },
                                { name: 'Ban Android Players', value: '2' },
                                { name: 'Ban IoS/iPhone Players', value: '3' },
                                { name: 'Ban Playstation Players', value: '4' },
                                { name: 'Ban Nintendo Switch Players', value: '5' },
                                { name: 'Ban Players Under 1000 Gamerscore', value: '6' },
                                { name: 'Ban Players Under 500 Gamerscore', value: '7' },
                                { name: 'Ban Players Under 100 Gamerscore', value: '8' },
                                { name: 'Ban Players With 0 Gamerscore', value: '9' },
                                { name: 'Ban Players Detected By the Alt-Detect AI', value: '10' },
                                { name: 'Ban Players With Under 3 Games', value: '11' },
                                { name: 'Ban Players With Under 4 Games', value: '12' },
                                { name: 'Ban Players With Under 5 Games', value: '13' },
                                { name: 'Ban Players With Private Title History', value: '14' },
                                { name: 'Ban Players Appearing Offline', value: '15' },
                              ).setRequired(true)))

                              //bot
                              .addSubcommand(subcommand =>
                                subcommand
                                .setName('bot')
                                .setDescription('Manage the bot that joins your realm.')
                                .addStringOption(option => option.setName('realm').setDescription('The realm to run the command on.').addChoices(
                                  { name: 'Realm Example', value: 'r1' },
                                  { name: 'Realm Example', value: 'r2' },
                                ).setRequired(true))
                                .addStringOption(option => option.setName('type').setDescription('What you want to do with the bot account').addChoices(
                                  { name: 'Join Realm', value: '1' },
                                  { name: 'Leave Realm', value: '2' },
                                ).setRequired(true))),
	async execute(interaction) {
    return await interaction.reply({ content: `This command is not released yet! Try again later!\n\nEstimated Release Date: <t:1677654987:D>`, ephemeral: true})
    const { request } = require('undici');
const { authenticate } = require('@xboxreplay/xboxlive-auth')
const XboxLiveAPI = require('@xboxreplay/xboxlive-api')
		try {
      if (mongoose.connection.readyState != 1) return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true})
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
    } catch (error) {
      const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
      await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Realm Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)
          console.log(error)
    }
  }
}