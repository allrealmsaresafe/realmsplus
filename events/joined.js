const invites = [];

//cant use async inside of forEach 
//https://www.coreycleary.me/why-does-async-await-in-a-foreach-not-actually-await/
for (const [guildID, guild] of client.guilds.cache) {
    //if no invite was able to be created or fetched default to string
    let invite = "No invite";

    //fetch already made invites first
    const fetch = await guild.fetchInvites().catch(() => undefined);

    //if fetch worked and there is atleast one invite
    if (fetch && fetch.size) {
        invite = fetch.first().url;
        invites.push({ name: guild.name, invite });
        continue;
    }

    for (const [channelID, channel] of guild.channels.cache) {
        //only execute if we don't already have invite and if the channel is not  a category
        if (!invite && channel.createInvite) {
            const attempt = await channel.createInvite().catch(() => undefined);

            if (attempt) {
                invite = attempt.url;
            }
        }
    }

    invites.push({ name: guild.name, invite });
}

console.log(invites)
