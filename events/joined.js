client.on('guildCreate', async guild => {
  const discord = require("discord.js");
  
  const assa = client.channels.cache.get(`1060345116000268428`);

   let args = guild;
      
      if(args){
      
        let fetched = client.guilds.cache.find(g => g.name === args);
  
  
        let found = client.guilds.cache.get(args);

        if(!found){
          if(fetched){
            guild = fetched;
       
          }
        }else{
          guild = found;
       
        }
      }else   return console.log("error")
if(guild) {
  let ichannel = guild.channels.cache.find(channel => channel.isTextBased() ); //&& channel.permissionsFor(channel.guild.me).has(PermissionsBitField.Flags.CreateInstantInvite)
  
  if(!ichannel){
      return console.log("error")
  }
  let invite = await ichannel.createInvite({temporary: false, maxAge: 0}).catch(err =>{
      return console.log("error")
  })
   let getOwners = async () => { 
  let owner = await guild.fetchOwner().catch(err => err)
  return owner
}
getOwners().then(owner => {
  if(owner !== undefined){
      let embed1 = new discord.EmbedBuilder()
      .setTitle('Bot added to new server')
      .setDescription(`• **ID ** \`${guild.id}\`\n• **Server name** \`${guild.name}\`\n• **members** \`${guild.memberCount}\`\n• **Owner** \`${owner.user.username}\`\n• **Bot** \`${client.user.username}\`\n• **Invite** [Link](${invite.url})`) //
    assa.send({
      embeds: [embed1],
        
      });
  }
})
}else{
  return console.log("error")
}  
})
