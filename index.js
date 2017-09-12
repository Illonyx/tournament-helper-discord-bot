const Commando = require('discord.js-commando');
const challonge = require('challonge')
const request = require('request');
var sangRoyaleApi = process.env.SR_DOMAIN_NAME + "/api/tournamentContext";

challonge.api_key = process.env.CHALLONGE_USER_TOKEN;

function checkRole(message,rolename){
	var authorRoles = message.member.roles.array()
	var roleNames = []
	for (var i = authorRoles.length - 1; i >= 0; i--) {
		roleNames.push(authorRoles[i].name)
	}
	var manager = roleNames.indexOf(rolename) != -1;
	return manager
}

var client = new Commando.Client({
	commandPrefix : "tr-"
});
client.registry
	.registerDefaultTypes()
	.registerGroup('challonge', 'Challonge')
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(__dirname + "/commands");

var token = process.env.DISCORD_BOT_TOKEN;
client.login(token);




