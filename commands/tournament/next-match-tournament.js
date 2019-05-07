const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../api/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')
const LanguageManager = require('../../api/user-settings/language-manager')

class NextMatchTournamentCommand extends Commando.Command {

	constructor(client) {

    super(client, {
        name: 'next-match',
        group: 'tournament',
        memberName: 'next-match',
        description: 'Shows the next match a challonge tournament partcipant will do by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-next-match BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to see your future match',
            type: 'string'
        }]

    	});
    this.languageManager = new LanguageManager();
    
	}

	async run(message, args){
		
		
		const {text} = args
		var participantId = ""
		var participantIds = [];
		var that = this
		let prefix = that.languageManager.getI18NString("tournament-next-match-prefix") + text
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

			var participantAuthor = tournamentSystem.checkParticipantRegistration(authorName, result)
			participantId = participantAuthor.id

			participantIds=result.reduce(function(prev, curr){
				prev[curr.id]=curr.name
				return prev
			}, {});

			//Rechercher les prochains matchs qui auront lieu
			return tournamentSystem.getTournamentMatches(text, participantIds)
			
		}).then(function(matches){
			console.log("Matches : " + JSON.stringify(matches))
			var openedMatches = tournamentSystem.getOpenedMatches(matches)
			console.log("AllPlayerMatches : " + JSON.stringify(openedMatches))
			var found = tournamentSystem.getOwnMatches(participantId, openedMatches)

			if(found.length != 1){
				throw("Erreur pas encore gérée ;)")
			}

			var nextMatchSummary = that.buildMatchSummary(found[0])
			message.reply(nextMatchSummary)
		})
		.catch(function(errorReason){
			message.reply(prefix + errorReason)
		})
		
	}

	//TODO : Utiliser un peu de Markdown - s'inspirer de google avec le foot
	buildMatchSummary(matchData){
		console.log('Haha');
		var msgToBuild = ""
		var opponentId = ""

		if(opponentId == null){
			msgToBuild += "L'adversaire de votre match (round " + matchData.round + ") est encore inconnu."
		} else {
			msgToBuild += "Votre prochain match (round " + matchData.round + ") vous opposera à : " + matchData.opponentName + ". "
		}

		//2 - Find Scheduled time
		if(matchData.scheduledTime == null){
			msgToBuild += "L'heure n'a pas encore été définie, ou regarder le reglement du tournoi associé."
		} else  {
			msgToBuild += "Le match sera prévu à ce moment : " + matchData.scheduledTime + ". Bonne chance! "
		}

		return msgToBuild;
	}

	



}

module.exports=NextMatchTournamentCommand;