const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../api/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')
const LanguageManager = require('../../api/user-settings/language-manager')

class JoinTournamentCommand extends Commando.Command {

	constructor(client) {

    super(client, {
        name: 'join',
        group: 'tournament',
        memberName: 'join',
        description: 'Join a challonge tournament by specifying its code (code is precised in the tournament',
        examples: ["Example: tr-join TournamentExample1"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to join',
            type: 'string'
        }]

    	});
    	this.languageManager = new LanguageManager();

	}

	async run(message, args){
		const {text} = args
		var that = this;
		let prefix = that.languageManager.getI18NString("tournament-join-prefix") + text
								+ " : "

		var authorName;
		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}

		var getParticipantsTask = tournamentSystem.getTournamentParticipants(text)
		getParticipantsTask.then(function(result){

			//Chercher si le participant est inscrit
			var found = result.find(function(participant){
				return participant.name == authorName
			})
			if(found){
				throw that.languageManager.getI18NString("join-command-already-registered")
			}
			
			//Si le participant n'a pas été trouvé, on procède à l'inscription
			return tournamentSystem.registerTournamentParticipant(text, authorName)
		}).then(function(etatValidation){
			message.reply(prefix + etatValidation)
		})
		.catch(function(errorReason){
			message.reply(prefix + errorReason)	
		})

	}



}

module.exports=JoinTournamentCommand;