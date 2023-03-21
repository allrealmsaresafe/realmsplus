require('dotenv').config();

exports.run = async (message, args) => {
  let user = await message.client.users.fetch(`${args.toString(' ', '')}`);
  message.client.guilds.cache.forEach(guild => {
    if(guild.ownerId === `${user.id}`) guild.leave()
  });

  const id = message.client.channels.cache.get(`1060345095347523644`);
  const logEmbed = {
    color: 946466,
    title: 'I just mass left multiple guilds.',
    description: 'A Realms+ admin just made me mass leave guilds owned by a specific user! Here is the information regarding it.',
    fields: [
      {
        name: 'Author ID',
        value: `${message.author.id}`,
        inline: true,
      },
      {
        name: 'Server ID',
        value: `${message.guild.id}`,
        inline: true,
      },
      {
        name: 'Target Guild Owner Tag',
        value: `${user.tag}`,
        inline: true,
      },
      {
        name: 'Target Guild Owner ID',
        value: `${user.id}`,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: `${process.env.FOOTER}`,
      icon_url: 'https://cdn.discordapp.com/attachments/981774405812224011/1084919697868328960/image_4.png',
    },
  };

  id.send({ embeds: [logEmbed] });
  return message.reply(`Left all guilds that <@${user.id}> owns!`);
}