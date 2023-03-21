const serverDB = require('../models/serverDB');

/**
 * Creates a database entry for the guild.
 * @param { string } id - The guild's id
*/
async function createServerEntry(id) {
    try {
        const entry = await serverDB.create({
            serverID: id,
            whitelisted: false,
            discordBanModule: false,
            configs: [
                {
                    banLogs: '0',
                    automod: '0',
                    logsChannel: '0',
                    relayChannel: '0',
                    adminRoleID: '0',
                    moderatorRoleID: '0'
                }
            ],
            addCount: 0,
            realmChatRelay: false,
            autobanFromDB: false,
            automod: false,
            banCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            kickCommand: [
                {
                    permission: ['404'],
                    enabled: true 
                }
            ],
            statusCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            playersCommand: [
                {
                    permission: ['0'], 
                    enabled: true 
                }
            ],
            editCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            worldCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            permissionsCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            consoleCommand: [
                {
                    permission: ['404'],
                    enabled: true 
                }
            ],
            automodCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            botCommand: [
                {
                    permission: ['404'],
                    enabled: true
                }
            ],
            realmID: [
                {
                    realmID: '0',
                    name: '0'
                }
            ],
            botConnected: false,
            isOpen: [
                {
                    realmID: '0',
                    status: '0'
                }
            ],
            realmsBans: [
                {
                    realmID: '0', 
                    banCount: '0'
                }
            ], 
            realmsKicks: [
                { 
                    realmID: '0',
                    kickCount: '0'
                }
            ],
            realmOperators: [
                {
                    realmID: '0',
                    operators: ['0']
                }
            ],
            currentLogic: [
                {
                    realmID: '0',
                    logic: '0'
                }
            ]
        });
        await entry.save();

        return entry;
    } catch(err) {
        console.error(err);
    }
}

module.exports = createServerEntry;