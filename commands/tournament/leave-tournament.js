const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../api/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')
const LanguageManager = require('../../api/user-settings/language-manager')

class LeaveTournamentCommand extends Commando.Command {

	constructor(client) {

    super(client, {
        name: 'leave',
        group: 'tournament',
        memberName: 'leave',
        description: 'Leave a challonge tournament by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-leave BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to leave',
            type: 'string'
        }]

    	});
    	this.languageManager = new LanguageManager();
    
	}

	async run(message, args){
		const {text} = args
		var that = this;

		let prefix = that.languageManager.getI18NString("tournament-leave-prefix") + text
								+ " : "

		var authorName;
		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}
		console.log("ss" + authorName)

		var getParticipantsTask = tournamentSystem.getTournamentParticipants(text)
		getParticipantsTask.then(function(result){
			
			//Chercher si le participant est bien inscrit
			var found = result.find(function(participant){
				return participant.name == authorName
			})
			if(!found){
				throw that.languageManager.getI18NString("leave-command-already-left");
			}

			//Si le participant est bien inscrit, on peut procéder à sa désinscription
			return tournamentSystem.unregisterTournamentParticipant(text, found.id)
		}).then(function(etatValidation){
			message.reply(prefix + etatValidation)
		})
		.catch(function(errorReason){
			message.reply(prefix + errorReason)	
		})
	}



}

module.exports=LeaveTournamentCommand;