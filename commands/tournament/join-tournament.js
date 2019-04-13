const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../api/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')

class JoinTournamentCommand extends Commando.Command {

	constructor(client) {

    super(client, {
        name: 'join',
        group: 'tournament',
        memberName: 'join',
        description: 'Join a challonge tournament by specifying its code (code is precised in the tournament',
        examples: ["Example: !join BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to join',
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
		console.log("ss" + authorName + "dd" + text)

		var getParticipantsTask = tournamentSystem.getTournamentParticipants(text)
		getParticipantsTask.then(function(result){

			//Chercher si le participant est inscrit
			var found = result.find(function(participant){
				return participant.name == authorName
			})
			if(found){
				throw "Vous êtes déjà inscrit au tournoi demandé"
			}
			
			//Si le participant n'a pas été trouvé, on procède à l'inscription
			return tournamentSystem.registerTournamentParticipant(text, authorName)
		}).then(function(etatValidation){
			message.reply(etatValidation)
		})
		.catch(function(errorReason){
			message.reply(errorReason)	
		})

	}



}

module.exports=JoinTournamentCommand;