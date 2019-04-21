const Commando = require('discord.js-commando');
const challonge = require('challonge')

var token = process.env.DISCORD_BOT_TOKEN;
challonge.api_key = process.env.CHALLONGE_USER_TOKEN;

var botCommandPrefix = "tr-"
if(!process.env.IS_PRODUCTION){
	botCommandPrefix = "trx-"
}

var client = new Commando.Client({
	commandPrefix : botCommandPrefix
});

client.registry
	.registerDefaultTypes()
	.registerGroup('tournament', 'Commandes tournoi')
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(__dirname + "/commands");


client.login(token);
console.log("Tournament Bot is ready")




