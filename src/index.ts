import { UserSettingsManager } from "./api/user-settings/user-settings-manager";
import { LanguageManager } from "./api/user-settings/language-manager";

const Commando = require('discord.js-commando');
const challonge = require('challonge')

// S'inspirer de ça!!
// https://github.com/discordjs/Commando/tree/master/test
// Y a meme une partie Test Unitaire

// ----------------------------------------------------------------
// Définition des variables d'environnement et du préfixe du bot
// ----------------------------------------------------------------

const botToken = process.env.DISCORD_BOT_TOKEN;
challonge.api_key = process.env.CHALLONGE_USER_TOKEN;

var botCommandPrefix = "tr-"
if(!process.env.IS_PRODUCTION){
	botCommandPrefix = "trx-"
}

var client = new Commando.Client({
	commandPrefix : botCommandPrefix
});

console.log("dir :" + __dirname);

// ------------------------------------------------------------
// Configuration du client
// ------------------------------------------------------------

client.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerGroup('tournament', 'Commandes tournoi')
	.registerCommandsIn(__dirname + "/commands/tournament");
	
// -------------------------------------------
// Lancement du bot
// -------------------------------------------

client.login(botToken).then(function(result: any){
	console.log("Tournament Bot is ready")
}).catch(function(err: any){
	console.log("Erreur lors du lancement du client Discord : " + err)
});





