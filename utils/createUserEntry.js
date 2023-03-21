const userDB = require('./models/userDB');

/**
 * Creates a database entry for a user.
 * @param { string } id - The user's id
*/
async function createUserEntry(id) {
    try {
        const entry = await userDB.create({
			userID: id,
			botBan: false,
			xuid: '0',
			accessToken: '0',
			email: '0',
			ownedRealms: [
				{
					realmID: '0', 
					realmName: '0'
				}
			],
			addCount: 0,
			reportCount: 0,
			isAdmin: false, 
			databasePerms: false
		});
        await entry.save();

        return entry;
    } catch(err) {
        console.error(err);
    }
}

module.exports = createUserEntry;