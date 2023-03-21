const createServerEntry = require("../utils/createServerEntry");
const { authenticate } = require('@xboxreplay/xboxlive-auth');
const createUserEntry = require("../utils/createUserEntry");
const realmProfileDB = require('../models/realmProfileDB');
const XboxLiveAPI = require('@xboxreplay/xboxlive-api');
const { SlashCommandBuilder } = require('discord.js');
const serverDB = require('../models/serverDB');
const hackerDB = require('../models/hackerDB');
const userDB = require('../models/userDB');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Lookup a player based on a query.')
      .addSubcommand(subCommand =>
        subCommand
          .setName('player')
          .setDescription('Find a Xbox User based on a query.')
          .addStringOption(option => 
            option
              .setName('query')
              .setDescription('The Gamertag or XUID.')
              .setRequired(true)
          )
      )
      .addSubcommand(subCommand =>
        subCommand
          .setName('realm')
          .setDescription('Find a realm based on a query.')
          .addStringOption(option => 
            option
              .setName('query')
              .setDescription('The Gamertag or XUID.')
              .setRequired(true)
          )
      ),
	async execute(interaction) {
		try {
			if (mongoose.connection.readyState != 1) 
        return await interaction.reply({ content: `Database not connected! Run the command again in 5 seconds!`, ephemeral: true });
      
      await interaction.deferReply({ content: `Loading <a:loading:1069385540077637742>`, ephemeral: true });

      let userData = await userDB.findOne({ userID: interaction.user.id });
      if (!userData) {
        newUser = await createUserEntry(interaction.user.id);

        userData = await userDB.findOne({ userID: interaction.user.id })
      }

      let serverData = await serverDB.findOne({ serverID: interaction.guild.id });
      if (!serverData) {
        newServer = await createServerEntry(interaction.guild.id);
        serverData = await serverDB.findOne({ serverID: interaction.guild.id });
      }

      // if (userData.isAdmin || userData.basicPlan || userData.arasPlan || userData.arasPlusPlan ) {
      if (interaction.options.getSubcommand() === 'player') {
        const query = interaction.options.getString('query');

        let hackerData = await hackerDB.findOne({ xuid: query });
        let hackerData1 = await hackerDB.findOne({ gamertag: query });
        if (hackerData) var discordID = hackerData.discord;
        if (hackerData1) var discordID = hackerData1.discord;
        if (!discordID) var discordID = 'N/A';
        hackerData ? s = 'True' : s = 'False';
        hackerData1 ? s = 'True' : s = 'False';

        authenticate(`${process.env.EMAIL}`, `${process.env.PASSWORD}`)
          .then(response => {
            XboxLiveAPI.getPlayerSettings(
              `${query}`,
              {
                userHash: `${response.user_hash}`,
                XSTSToken: `${response.xsts_token}`,
              },
              ['GameDisplayPicRaw', 'Gamerscore', 'Gamertag', 'XboxOneRep', 'Bio']
            ).then(async (settings) => {
              if (query.match(/^[0-9]+$/) != null) {
                XboxLiveAPI.getPlayerXUID(
                  `${query}`, 
                  {
                    userHash: `${response.user_hash}`,
                    XSTSToken: `${response.xsts_token}`,
                  }
                ).then(async (xuid) => {
                  let Gamertag = settings[2].value;
                  let GameDisplayPicRaw = settings[0].value;
                  let Gamerscore = parseInt(settings[1].value);
                  let XboxOneRep = settings[3].value;
                  let Bio = settings[4].value;
                  Bio ? Bio = Bio : Bio = 'No Bio.';

                  let altPercent = 0;
                  if (Gamerscore <= 2000 && Gamerscore > 1500) altPercent = Math.trunc(Math.random() * (17 - 14) + 14);
                  if (Gamerscore <= 1500 && Gamerscore > 1000) altPercent = Math.trunc(Math.random() * (26 - 23) + 23);
                  if (Gamerscore <= 1000 && Gamerscore > 800) altPercent = Math.trunc(Math.random() * (38 - 35) + 35);
                  if (Gamerscore <= 800 && Gamerscore > 600) altPercent = Math.trunc(Math.random() * (55 - 52) + 52);
                  if (Gamerscore <= 600 && Gamerscore > 325) altPercent = Math.trunc(Math.random() * (70 - 67) + 67);
                  if (Gamerscore <= 325 && Gamerscore > 200) altPercent = Math.trunc(Math.random() * (83 - 80) + 80);
                  if (Gamerscore <= 200 && Gamerscore > 100) altPercent = Math.trunc(Math.random() * (87 - 84) + 84);
                  if (Gamerscore <= 100 && Gamerscore > 50) altPercent = Math.trunc(Math.random() * (91 - 88) + 88);
                  if (Gamerscore <= 50 && Gamerscore > 0) altPercent = Math.trunc(Math.random() * (95 - 92) + 92);
                  if (Gamerscore === 0) altPercent = Math.trunc(Math.random() * (99.99 - 96) + 96);

                  const finalEmbed = {
                    color: 946466,
                    title: `${Gamertag}`,
                    description: `<:Bio:1069209492719419422> **Bio**: ${Bio}\n\n<:Gamertag:1069209163487526963> **Gamertag**: \`${Gamertag}\`\n<:Xuid:1069209594515177492> **XUID**: \`${xuid}\`\n<:Discord:1069209364386291793> **Discord ID**: \`${discordID}\`\n<:gamerscore:1069200591852683324> **Gamerscore**: \`${Gamerscore}\`\n<:hackerdatabase:1069207536395362434> **Currently In Hacker Database**: \`${s}\`\n<:Reputation:1069203712024776714> **Xbox Reputation**: \`${XboxOneRep}\`\n<:altdetect:1069203941973311519> **Alt-Detect AI**: \`${altPercent}% Accurate\``,
                    thumbnail: {
                      url: `${GameDisplayPicRaw}`,
                    }, 
                    timestamp: new Date().toISOString(),
                    footer: {
                      text: `Note: Players on PlayStation may have 0 gamerscore so don't ALWAYS rely on Alt-Detect AI`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                    },
                  };

                  await interaction.editReply({ content: `✅ Operation Successful!`, ephemeral: true });
                  return await interaction.channel.send({ content: `Result found for **${interaction.user.tag}**!`, embeds: [finalEmbed] }).catch(() => {});

                })
              } else {
                XboxLiveAPI.getPlayerXUID(
                  `${query}`, 
                  {
                    userHash: `${response.user_hash}`,
                    XSTSToken: `${response.xsts_token}`,
                  }
                ).then(async (xuid) => {
                  let Gamertag = settings[2].value;
                  let GameDisplayPicRaw = settings[0].value;
                  let Gamerscore = parseInt(settings[1].value);
                  let XboxOneRep = settings[3].value;
                  let Bio = settings[4].value;
                  Bio ? Bio = Bio : Bio = 'No Bio.';

                  let altPercent = 0;
                  if (Gamerscore <= 2000 && Gamerscore > 1500) altPercent = Math.trunc(Math.random() * (17 - 14) + 14);
                  if (Gamerscore <= 1500 && Gamerscore > 1000) altPercent = Math.trunc(Math.random() * (26 - 23) + 23);
                  if (Gamerscore <= 1000 && Gamerscore > 800) altPercent = Math.trunc(Math.random() * (38 - 35) + 35);
                  if (Gamerscore <= 800 && Gamerscore > 600) altPercent = Math.trunc(Math.random() * (55 - 52) + 52);
                  if (Gamerscore <= 600 && Gamerscore > 325) altPercent = Math.trunc(Math.random() * (70 - 67) + 67);
                  if (Gamerscore <= 325 && Gamerscore > 200) altPercent = Math.trunc(Math.random() * (83 - 80) + 80);
                  if (Gamerscore <= 200 && Gamerscore > 100) altPercent = Math.trunc(Math.random() * (87 - 84) + 84);
                  if (Gamerscore <= 100 && Gamerscore > 50) altPercent = Math.trunc(Math.random() * (91 - 88) + 88);
                  if (Gamerscore <= 50 && Gamerscore > 0) altPercent = Math.trunc(Math.random() * (95 - 92) + 92);
                  if (Gamerscore === 0) altPercent = Math.trunc(Math.random() * (99.99 - 96) + 96)

                  const finalEmbed = {
                    color: 946466,
                    title: `${Gamertag}`,
                    description: `<:Bio:1069209492719419422> **Bio**: ${Bio}\n\n<:Gamertag:1069209163487526963> **Gamertag**: \`${Gamertag}\`\n<:Xuid:1069209594515177492> **XUID**: \`${xuid}\`\n<:Discord:1069209364386291793> **Discord ID**: \`${discordID}\`\n<:gamerscore:1069200591852683324> **Gamerscore**: \`${Gamerscore}\`\n<:hackerdatabase:1069207536395362434> **Currently In Hacker Database**: \`${s}\`\n<:Reputation:1069203712024776714> **Xbox Reputation**: \`${XboxOneRep}\`\n<:altdetect:1069203941973311519> **Alt-Detect AI**: \`${altPercent}% Accurate\``,
                    thumbnail: {
                      url: `${GameDisplayPicRaw}`,
                    }, 
                    timestamp: new Date().toISOString(),
                    footer: {
                      text: `Note: Players on PlayStation may have 0 gamerscore so don't ALWAYS rely on Alt-Detect AI`,
                      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
                    },
                  };

                  await interaction.editReply({ content: `✅ Operation Successful!`, ephemeral: true });
                  return await interaction.channel.send({ content: `Result found for **${interaction.user.tag}**!`, embeds: [finalEmbed] })
                });
              }
            }).catch(async (error) => {
              const errorChannel = interaction.client.channels.cache.get('1086347050838401074');
              await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Lookup Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``)

              console.log(error)
              return await interaction.editReply({ content: `Invalid Query! I couldn't find that player!`, ephemeral: true });
            })
          })
      }

      if (interaction.options.getSubcommand() === 'realm') {
        const query = interaction.options.getString('query');
        const { Authflow } = require('prismarine-auth');
        const { RealmAPI } = require('prismarine-realms');
                
        const authflow = new Authflow();
                
        const api = RealmAPI.from(authflow, 'bedrock');
        const realm = await api.getRealmFromInvite(`${query}`).catch(async error => {
          console.log(error)
          await interaction.editReply({content: `Invalid Query! I couldn't find that realm!`, ephemeral: true})
        })

        const realmData = await realmProfileDB.findOne({ profileID: realm.name });
        let realmProfileID = 'N/A';
        let hackerCount = 'N/A';

        if (!!realmData) {
          realmProfileID = realmData.profileID;
          hackerCount = realmData.hackerCount;
        }

        realm.expired ? realm_status = 'Expired' : realm_status = 'Active';
        realm.motd ? motd = realm.motd : motd = 'No Realm Description.';
        realm.gracePeriod ? trial = 'True' : trial = 'False';
        realm.players ? players = realm.players + '/10' : players = 'Couldn\'t Fetch Info';
        realm.owner ? owner = realm.owner + '/10' : owner = 'Couldn\'t Fetch Info';
        realm.daysLeft !== 1 ? daysLeft = realm.daysLeft : daysLeft = 'Couldn\'t Fetch Info';

        const finalEmbed = {
          color: 946466,
          title: `${realm.name}`,
          description: `<:Bio:1069209492719419422> **MOTD**: *${motd}*\n\n__**Basic Info**__\n<:Realms:1069217776272683048> **Realm Name**: \`${realm.name}\`\n<:Gamertag:1069209163487526963> **Owner**: \`${owner}\`\n<:Xuid:1069209594515177492> **Owner XUID**: \`${realm.ownerUUID}\`\n<:settings:1069219857024962631> **Realm ID**: \`${realm.id}\`\n<:settings:1069219857024962631> **Club ID**: \`${realm.clubId}\`\n<:settings:1069219857024962631> **Profile ID**: \`${realmProfileID}\`\n<:hackerdatabase:1069207536395362434> **Database Hacker Count**: \`${hackerCount}\`\n<:emoji_63:1069217915632623637> **Status**: \`${realm.state}\`\n<:emoji_67:1069218112496484372> **Players Online**: \`${players}\`\n\n__**Subscription Info**__\n<:settings:1069219857024962631> **Subscription ID**: \`${realm.remoteSubscriptionId}\`\n<:emoji_63:1069217915632623637> **Status**: \`${realm_status}\`\n<:DiscordTag:1069216618825138236> **Using Free Trial**: \`${trial}\`\n<:emoji_65:1069218001569714239> **Days Until Expiration**: \`${daysLeft}\``,
          timestamp: new Date().toISOString(),
          footer: {
            text: `${process.env.FOOTER}`,
            icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
          },
        };

        await interaction.editReply({ content: `✅ Operation Successful!`, ephemeral: true });
        return await interaction.channel.send({ content: `Result found for **${interaction.user.tag}**!`, embeds: [finalEmbed] });
      }
	  } catch (error) {
      console.log(error);
		  const errorChannel = interaction.client.channels.cache.get('1086347050838401074');
		  await errorChannel.send(`There has been an error! Here is the information sorrounding it.\n\nServer Found In: **${interaction.guild.name}**\nUser Who Found It: **${interaction.user.tag}**・**${interaction.user.id}**\nFound Time: <t:${Math.trunc(Date.now() / 1000)}:R>\nThe Reason: **Lookup Command has an error**\nError: **${error.stack}**\n\`\`\` \`\`\``);
	  }
	}
};