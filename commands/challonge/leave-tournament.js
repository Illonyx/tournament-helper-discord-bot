const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../utils/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')

class LeaveTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'leave',
        group: 'challonge',
        memberName: 'leave',
        description: 'Leave a challonge tournament by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-leave BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to leave',
            type: 'string'
        }]

    	});
    
	}

	async run(message, args){
		const {text} = args

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
				throw "Vous n'êtes pas inscrit au tournoi " + text + ", vous ne pouvez pas vous en désinscrire :-) ";
			}

			//Si le participant est bien inscrit, on peut procéder à sa désinscription
			return tournamentSystem.unregisterTournamentParticipant(text, found.id)
		}).then(function(etatValidation){
			message.reply(etatValidation)
		})
		.catch(function(errorReason){
			message.reply(errorReason)	
		})
	}



}

module.exports=LeaveTournamentCommand;