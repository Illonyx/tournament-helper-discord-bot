const Commando = require('discord.js-commando');
const challonge = require('challonge')
const request = require('request');

var sangRoyaleApi = process.env.SR_DOMAIN_NAME + "/api/tournamentContext";
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
	.registerGroup('challonge', 'Challonge')
	.registerGroup('sangroyale', 'Sang Royale')
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(__dirname + "/commands");


client.login(token);




