const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../api/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')

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
    
	}

	async run(message, args){
		
		
		const {text} = args
		var participantId = ""
		var participantIds = [];
		var that = this

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
			return tournamentSystem.getTournamentMatches(text)
			
		}).then(function(matches){
			var found = matches.find(function(match){
				return (match.state == 'open' || match.state == 'pending') && (match.player1Id == participantId || match.player2Id == participantId)
			})
			if(!found){
				throw "Votre prochain match n'a pas été trouvé. Vous avez donc été éliminé ou n'avez plus de matchs à faire? Bonne chance pour la suite ;D"
			}
			var nextMatchSummary = that.buildMatchSummary(participantId, found, participantIds)
			message.reply(nextMatchSummary)
		})
		.catch(function(errorReason){
			message.reply(errorReason)	
		})
		
	}

	buildMatchSummary(participantId, matchData, participantsData){
		console.log('Haha');
		var msgToBuild = ""
		var opponentId = ""

		//1 - Find opponent
		if(matchData.player1Id == participantId) opponentId = matchData.player2Id
		else opponentId = matchData.player1Id

		if(opponentId == null){
			msgToBuild += "L'adversaire de votre match (round " + matchData.round + ") est encore inconnu."
		} else {
			msgToBuild += "Votre prochain match (round " + matchData.round + ") vous opposera à : " + participantsData[opponentId] + ". "
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