// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let guild = await lib.discord.guilds['@0.2.3'].retrieve({
  guild_id: `${context.params.event.id}`,
  with_counts: true,
});
let invite = await lib.discord.guilds['@0.2.4'].invites.list({
  guild_id: context.params.event.id, // required
});
let invitelink = invite[0].code;
let id10t = `https://discord.gg/${invitelink}`;
let servers = await lib.discord.guilds['@0.1.0'].list({
  limit: 100,
});
const channelLogID = `1060345116000268428 `; //Channel ID where you want to send it
const IconURL = `https://cdn.discordapp.com/icons/${context.params.event.id}/${context.params.event.icon}.png`; //get guild icon url
try {
  let added_by = await lib.discord.guilds['@0.2.2'].auditLogs.list({
    guild_id: context.params.event.id,
    action_type: 28,
  }); //get info from audio log
  let added_by_user = await lib.discord.users['@0.1.6'].retrieve({
    user_id: `${added_by.audit_log_entries[0].user_id}`,
  }); //get info of the user who added the bot
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${channelLogID}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `New Guild Joined`,
        description: ``,
        fields: [
          {
            name: `GuildName`,
            value: `${context.params.event.name}`, //guild name
          },
          {
            name: `Added By`,
            value: `Name: ${added_by_user.username}#${added_by_user.discriminator}\nID: ${added_by.audit_log_entries[0].user_id}\n<@${added_by.audit_log_entries[0].user_id}>`, //name and stuff of the user who added it
          },
          {
            name: `Member Count`,
            value: `${guild.approximate_member_count} members!`, //member count
          },
          {
            name: `Server Count`,
            value: `Amazing Now - I am on ${
              servers.length === 100 ? servers.length + '+' : servers.length
            } servers `, //server count
          },
          {
            name: `invite link`,
            value: id10t, //server count
          },
        ],
        thumbnail: {
          url: `${IconURL}`, //guild icon
          height: 0,
          width: 0,
        },
      },
    ],
  });
} catch (e) {
  //if there is an error
  await lib.discord.channels['@0.2.0'].messages.create({
    //create a message
    channel_id: `${channelLogID}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Bot joined a new Guild`,
        description: ``,
        fields: [
          {
            name: `GuildName`,
            value: `${context.params.event.name}`, //Guild name
          },
          {
            name: `Added By`,
            value: `**There was an Error Retrieving who Invited the Bot. Check Logs for more info.**`,
          },
        ],
        thumbnail: {
          url: `${IconURL}`, //Guild icon url
          height: 0,
          width: 0,
        },
      },
    ],
  });
}
