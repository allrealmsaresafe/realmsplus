require('dotenv').config()
const userDB = require('../models/userDB')
exports.run = async (message, args) => {
    let userData = await userDB.findOne({ userID: message.author.id })
    if (userData === null) {
      newUser = await userDB.create({userID: message.author.id,botBan: false,xuid: '0',accessToken: '0',email: '0',ownedRealms: [{realmID: '0', realmName: '0'}],addCount: 0,reportCount: 0,isAdmin: false});newUser.save().catch()
      userData = await userDB.findOne({ userID: user.id })
    }
    const helpEmbed = {
        color: 946466,
        title: 'Realms+ Admin & Developer Commands',
        description: 'Do not send this command anywhere outside of staff channels and don\'t share it with anyone who isnt staff.\n\n__**Administration Commands**__\n\`!admin\` - When executed on a user id, gives them Realms+ Admin.\n\nSyntax: \`!admin <user-id>\`\n--------------\n\`!removeadmin\` - When executed on a user id, removes their Realms+ Admin.\n\nSyntax: \`!removeadmin <user-id>\`\n--------------\n\`!botban\` - When executed on a user id, bans them from inviting or using Realms+.\n\nSyntax: \`!botban <user-id>\`\n--------------\n\`!leave\` - When executed on a guild id, leaves it.\n\nSyntax: \`!leave <guild-id>\`\n--------------\n\`!serverwhitelist\` - When executed on a guild id, whitelists it from the join security measures.\n\nSyntax: \`!serverwhitelist <guild-id>\`\n--------------\n\`!unban\` - When executed on a user id, unbans them from using and inviting Realms+.\n\nSyntax: \`!unban <user-id>\`\n\n__**Developer Commands**__\n\`!dm\` - When executed on a user id, direct messages them a specific message.\n\nSyntax: \`!dm <user id> <context>\`\n--------------\n\`!say\` - When executed, echoes back the message.\n\nSyntax: \`!say <context>\`\n',
        timestamp: new Date().toISOString(),
        footer: {
          text: `${process.env.FOOTER}`,
          icon_url: 'https://cdn.discordapp.com/attachments/1053080642386153583/1060304303518142544/rdb.png',
        },
      };
    return message.reply({embeds: [helpEmbed]})
  };