const { ActivityType, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');
const crypto = require("crypto");
const userDB = require('../models/userDB')
const serverDB = require('../models/serverDB')
const mongoose = require('mongoose')
const hackerDB = require('../models/hackerDB')
const commandCooldown = new Set();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Allows for interacting with the database.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Allows for you to search the database for a query.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('report')
                .setDescription('Report a player to get them banned on RealmDB.'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('Adds a player to the database.'))
                        .addSubcommand(subcommand =>
                            subcommand
                                .setName('remove')
                                .setDescription('Removes a player to the database.')
                                .addStringOption(option => option.setName('database-id').setDescription('The player\'s Database ID.').setRequired(true))),
	async execute(interaction) {
		try {
      if (mongoose.connection.readyState != 1) return
      if (commandCooldown.has(interaction.user.id)) {
            return interaction.reply({content: `You can only run this command every 2 minutes!`, ephemeral: true});
            } else {
            const id = interaction.client.channels.cache.get(`1060345095347523644`)
            let userData = await userDB.findOne({ userID: interaction.user.id })
            if (!userData) {
              newUser = await userDB.create({userID: interaction.user.id,botBan: false,isHacker: false,isAdmin: false});newUser.save()
              userData = await userDB.findOne({ userID: interaction.user.id })
            }
            let serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            if (!serverData) {
              newServer = await serverDB.create({serverID: interaction.guild.id,botBan: false,isAdmin: false,hasPremium: false});newServer.save()
              serverData = await serverDB.findOne({ serverID: interaction.guild.id })
            }
            if (interaction.options.getSubcommand() === 'add') {
                if (!userData.isAdmin) return interaction.reply({ content: `Invalid Permission! You can not add to the database! Instead make a report with \`/database report\`.`, ephemeral: true })
                const dbid = crypto.randomBytes(12).toString('hex')
                const addModal = new ModalBuilder()
                .setCustomId('addModal')
                .setTitle('Add a hacker to the RealmDB Database');
            const gamertagInput = new TextInputBuilder()
                .setCustomId('gamertagInput')
                .setLabel("What is their gamertag?")
                .setStyle(TextInputStyle.Short)
                    .setMaxLength(20)
                    .setMinLength(1)
                    .setPlaceholder('The player\'s Microsoft Account Name')
                    .setRequired(true);
                    const xuidInput = new TextInputBuilder()
                    .setCustomId('xuidInput')
                    .setLabel("What is the user's XUID?")
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(5)
                    .setPlaceholder('Must be an Xbox User ID.')
                    .setRequired(false);
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("What is their discord ID?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('To find a discord ID right click on their profile and click Copy ID.')
                .setRequired(false);
                const realmInput = new TextInputBuilder()
                .setCustomId('realmInput')
                .setLabel("What is the realm name?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('The name of the realm the player was caught on.')
                .setRequired(false);
                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("What is the reason?")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(3)
                .setPlaceholder('What did they do to be reported? Did they crash, CBE, use fly, etc?')
                .setRequired(true);
            const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
            const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
            const actionRow4 = new ActionRowBuilder().addComponents(reasonInput);
            const actionRow5 = new ActionRowBuilder().addComponents(xuidInput);
            addModal.addComponents(actionRow1, actionRow5, actionRow2, actionRow3,actionRow4);
            await interaction.showModal(addModal);
          const filter = (interaction) => interaction.customId === 'addModal';
          interaction.awaitModalSubmit({ filter, time: 120_000 })
            .then(async interaction => 
            {
            var gamertag = interaction.fields.getTextInputValue('gamertagInput');
            var discordid = interaction.fields.getTextInputValue('discordIdInput');
            var realm = interaction.fields.getTextInputValue('realmInput');
            var reason = interaction.fields.getTextInputValue('reasonInput');
            var xuid = interaction.fields.getTextInputValue('xuidInput');
            if (!discordid) discordid = `N/A`
            if (!realm) realm = `N/A`
            if (!xuid) xuid = `N/A`
            const alreadyAdded = await hackerDB.exists({gamertag: gamertag})
            if (alreadyAdded) return interaction.reply({content: `This user is already in the database!`, ephemeral: true})
            const databaseEmbed = {
                color: 946466,
                title: 'Player added to the RealmDB Database',
                description: 'A new player was just added to the RealmDB Hacker & Player Database.',
                fields: [
                  {
                    name: 'Gamertag',
                    value: `${gamertag}`,
                    inline: true,
                  },
                  {
                    name: 'XUID',
                    value: `${xuid}`,
                    inline: true,
                  },
                  {
                    name: 'Discord ID',
                    value: `${discordid}`,
                    inline: true,
                  },
                  {
                    name: 'Database ID',
                    value: `${dbid}`,
                    inline: true,
                  },
                  {
                    name: 'Realm',
                    value: `${realm}`,
                    inline: true,
                  },
                  {
                    name: 'Reason',
                    value: `${reason}`,
                    inline: true,
                  },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                  text: `${process.env.FOOTER}`,
                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                },
              };
            const dbLog = {
                color: 946466,
                title: 'New entry in the Database',
                description: 'A RealmDB admin added a new player to the RealmDB Database.',
                fields: [
                  {
                    name: 'Author ID',
                    value: `${interaction.user.id}`,
                    inline: true,
                  },
                  {
                    name: 'Server ID',
                    value: `${interaction.guild.id}`,
                    inline: true,
                  },
                  {
                    name: 'Gamertag',
                    value: `${gamertag}`,
                    inline: true,
                  },
                  {
                    name: 'XUID',
                    value: `${xuid}`,
                    inline: true,
                  },
                  {
                    name: 'Discord ID',
                    value: `${discordid}`,
                    inline: true,
                  },
                  {
                    name: 'Database ID',
                    value: `${dbid}`,
                    inline: true,
                  },
                  {
                    name: 'Realm',
                    value: `${realm}`,
                    inline: true,
                  },
                  {
                    name: 'Reason',
                    value: `${reason}`,
                    inline: true,
                  },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                  text: `${process.env.FOOTER}`,
                  icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                },
              };
                    hackerDB.collection.insertOne({ 
                     gamertag: `${gamertag}`,
                     xuid: `${xuid}`,
                     discord: `${discordid}`,
                     dbid: `${dbid}`,
                     realm: `${realm}`,
                     reason: `${reason}`,
                     });
                     hackerDB.countDocuments({}, function (err, count) {
                      interaction.client.user.setPresence({
                        activities: [{ name: `${count} hackers`, type: ActivityType.Watching }],
                        status: 'online',
                      });
                    });
                     const id2 = interaction.client.channels.cache.get(`1059559606222856202`)
                     id2.send({ embeds: [databaseEmbed] });
                     id.send({ embeds: [dbLog] });
                      return interaction.reply({
                        content: `Successfully added **${gamertag}** to the RealmDB Database!`,
                        ephemeral: true
                      })
            }).catch(console.error);
            }
            if (interaction.options.getSubcommand() === 'report') {
                const reportModal = new ModalBuilder()
                .setCustomId('reportModal')
                .setTitle('Report a hacker to the RealmDB Database');
            const gamertagInput = new TextInputBuilder()
                .setCustomId('gamertagInput')
                .setLabel("What is their gamertag?")
                .setStyle(TextInputStyle.Short)
                    .setMaxLength(20)
                    .setMinLength(1)
                    .setPlaceholder('The player\'s Microsoft Account Name')
                    .setRequired(true);
                const discordIdInput = new TextInputBuilder()
                .setCustomId('discordIdInput')
                .setLabel("What is their discord ID?")
                .setStyle(TextInputStyle.Short)
                .setMinLength(12)
                .setPlaceholder('Their discord ID.')
                .setRequired(false);
                const realmInput = new TextInputBuilder()
                .setCustomId('realmInput')
                .setLabel("What is the realm name?")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('The name of the realm the player was caught on.')
                .setRequired(false);
                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel("What is the reason?")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(3)
                .setPlaceholder('What did they do to be reported? Did they crash, CBE, use fly, etc?')
                .setRequired(true);
                const proofInput = new TextInputBuilder()
                .setCustomId('proofInput')
                .setLabel("Please show proof.")
                .setStyle(TextInputStyle.Short)
                .setMinLength(5)
                .setPlaceholder('Must be a image/video link.')
                .setRequired(true);
            const actionRow1 = new ActionRowBuilder().addComponents(gamertagInput);
            const actionRow2 = new ActionRowBuilder().addComponents(discordIdInput);
            const actionRow3 = new ActionRowBuilder().addComponents(realmInput);
            const actionRow4 = new ActionRowBuilder().addComponents(reasonInput);
            const actionRow5 = new ActionRowBuilder().addComponents(proofInput);
            reportModal.addComponents(actionRow1, actionRow2, actionRow3,actionRow4 , actionRow5);
            await interaction.showModal(reportModal);
            const filter = (interaction) => interaction.customId === 'reportModal';
            interaction.awaitModalSubmit({ filter, time: 500_000 })
              .then(async interaction => 
              {
                    let gamertag = interaction.fields.getTextInputValue('gamertagInput');
                    let discordid = interaction.fields.getTextInputValue('discordIdInput');
                    let realm = interaction.fields.getTextInputValue('realmInput');
                    let reason = interaction.fields.getTextInputValue('reasonInput');
                    let proof = interaction.fields.getTextInputValue('proofInput');
                    const alreadyAdded = await hackerDB.exists({gamertag: gamertag})
                    if (alreadyAdded) return interaction.reply({content: `This user is already in the database!`, ephemeral: true})
                    if (!discordid) discordid = `N/A`
                    if (!realm) realm = `N/A`
                    const reportEmbed = {
                        color: 946466,
                        title: 'Report a player to be reviewed by the ARS team',
                        description: 'New RealmDB Database Report.',
                        fields: [
                          {
                            name: 'Gamertag',
                            value: `${gamertag}`,
                            inline: true,
                          },
                          {
                            name: 'Discord ID',
                            value: `${discordid}`,
                            inline: true,
                          },
                          {
                            name: 'Realm',
                            value: `${realm}`,
                            inline: true,
                          },
                          {
                            name: 'Reason',
                            value: `${reason}`,
                            inline: true,
                          },
                          {
                            name: 'Proof',
                            value: `${proof}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                    const reportLog = {
                        color: 946466,
                        title: 'New report to the Database',
                        description: 'Someone reported to the RealmDB Database.',
                        fields: [
                          {
                            name: 'Author ID',
                            value: `${interaction.user.id}`,
                            inline: true,
                          },
                          {
                            name: 'Server ID',
                            value: `${interaction.guild.id}`,
                            inline: true,
                          },
                          {
                            name: 'Gamertag',
                            value: `${gamertag}`,
                            inline: true,
                          },
                          {
                            name: 'Discord ID',
                            value: `${discordid}`,
                            inline: true,
                          },
                          {
                            name: 'Realm',
                            value: `${realm}`,
                            inline: true,
                          },
                          {
                            name: 'Reason',
                            value: `${reason}`,
                            inline: true,
                          },
                          {
                            name: 'Proof',
                            value: `${proof}`,
                            inline: true,
                          },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                          text: `${process.env.FOOTER}`,
                          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                        },
                      };
                      const id2 = interaction.client.channels.cache.get(`1061144118752989344`)
                      id2.send({ embeds: [reportEmbed] });
                      id.send({ embeds: [reportLog] });
                      return interaction.reply({
                        content: `Successfully reported **${gamertag}**! The report will be reviewed by the ARS Team shortly.`,
                        ephemeral: true
                      });
            }).catch(console.error);
            }
            if (interaction.options.getSubcommand() === 'search') {
                return await interaction.reply({ content: `This command isn't done yet! Sorry check back later!`, ephemeral: true })
            }
            if (interaction.options.getSubcommand() === 'remove') {
                if (!userData.isAdmin) return interaction.reply(`Invalid Permission! You can not remove from the database!`)
                const dbid = interaction.options.getString('database-id')
                let hackerData = await hackerDB.findOne({ dbid: dbid })
                if (!hackerData) return interaction.reply({ content: `This user isn't in the database!`, ephemeral: true })
              const removeLog = {
                  color: 946466,
                  title: 'Player removed from the database',
                  description: `${interaction.user.tag} removed a player from the RealmDB Hacker Database.`,
                  fields: [
                    {
                      name: 'Author ID',
                      value: `${interaction.user.id}`,
                      inline: true,
                    },
                    {
                      name: 'Server ID',
                      value: `${interaction.guild.id}`,
                      inline: true,
                    },
                    {
                      name: 'Gamertag',
                      value: `${hackerData.gamertag}`,
                      inline: true,
                    },
                    {
                      name: 'XUID',
                      value: `${hackerData.xuid}`,
                      inline: true,
                    },
                    {
                      name: 'Discord ID',
                      value: `${hackerData.discord}`,
                      inline: true,
                    },
                    {
                      name: 'Database ID',
                      value: `${hackerData.dbid}`,
                      inline: true,
                    },
                    {
                      name: 'Realm',
                      value: `${hackerData.realm}`,
                      inline: true,
                    },
                    {
                      name: 'Reason',
                      value: `${hackerData.reason}`,
                      inline: true,
                    },
                  ],
                  timestamp: new Date().toISOString(),
                  footer: {
                    text: `${process.env.FOOTER}`,
                    icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
                  },
                };
                id.send({ embeds: [removeLog] });
                interaction.reply({ content: `Successfully removed **${hackerData.gamertag}** from the database!`, ephemeral: true })
                return hackerDB.deleteOne({
                  dbid: dbid
                })
            }
            if (!userData.isAdmin) commandCooldown.add(interaction.user.id);
            if (!userData.isAdmin) setTimeout(() => {
              commandCooldown.delete(interaction.user.id);
            }, 120000);
        }
	} catch (error) {
		const errorChannel = interaction.client.channels.cache.get('1060347445722230867')
		await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Database Command has an error**\nError: **${error}**\n\`\`\` \`\`\``)
        console.log(error)
	}
	},
};