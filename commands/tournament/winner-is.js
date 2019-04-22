const Commando = require('discord.js-commando');
const TournamentSystemAccess = require('../../api/tournament-system/tournament-system-access')
const tournamentSystem = new TournamentSystemAccess('challonge')

class WinnerIsCommand extends Commando.Command {

	//Le type member ne peut pas être utilisé dans un message privé au bot
	constructor(client) {

    super(client, {
        name: 'winner-is',
        group: 'tournament',
        memberName: 'winner-is',
        description: 'Allows to register a match result for a tournament by specifying its code (code is precised in the tournament page) and winner name (you can mention winner, if its challonge pseudo id is not the same, you can add it in command',
        examples: ["Example: tr-winner-is BrawlhallaTourney01 @Brian#2789, tr-winner-is SRTest @User#XXXX ChallongeTournamentPseudo"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to see your future match',
            type: 'string'
        }, {
            key: 'winner',
            prompt: 'Mention match winner',
            type: 'member', 
        }, {
            key: 'tournamentpseudo',
            prompt: 'If match winner does not have the same tournament pseudo than his Discord pseudo, override it by this',
            type: 'string',
            default : '' 
        }]

    	});
    
	}

	async run(message, {text, winner, tournamentpseudo}){
		
		var winnername = ''
		if(tournamentpseudo != ''){
			winnername = tournamentpseudo
		} else {
			winnername = winner.displayName
		}

		var participantId = ""
		var winnerId = ""
		var participantIds = [];
		var participantMatch = {};
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

			//Chercher si le participant est inscrit - si la personne s'est inscrite directement sur le tournoi, on essaie de matcher
			var foundParticipant = tournamentSystem.checkParticipantRegistration(authorName, result)
			participantId=foundParticipant.id

			//Chercher si le nom du winner correspond à quelque chose
			var foundWinner = tournamentSystem.checkParticipantRegistration(winnername, result)
			winnerId=foundWinner.id
			
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
			participantMatch=found
			//lastroundover à gérer
			var isLastRoundOver = that.isLastRoundOver(matches, found.round)
			if(!isLastRoundOver){
				throw "Les matchs du round d'avant ne sont pas encore terminés. Veuillez attendre la fin des matchs d'avant pour commencer votre match/déclarer votre résultat"
			}
			return tournamentSystem.declareMatchWinner(text, found.id, winnerId)
		}).then(function(result){
			var confirmationMessage = that.whoIsTheWinner(participantId, winnerId, participantMatch, participantIds)
			message.reply(confirmationMessage)
		})
		.catch(function(errorReason){
			message.reply(errorReason)	
		})		
	}

	isLastRoundOver(matches, currentRound){

		//These are the first rounds, no need to wait
		if(currentRound == 1) return true;


		var matchesByRound = matches.reduce(function(prev, curr){
			if(!prev["" + curr.round]){
				prev["" + curr.round]=[]
			}
			prev[""+curr.round].push(curr)
			return prev
		}, {})
		
		var lastRound = currentRound - 1
		var allRoundMatches = matchesByRound[lastRound + ""]
		
		for(var j=0; j < allRoundMatches.length; j++){
			var match = allRoundMatches[j]
			if(match.state != "complete"){
				return false
			}
		}

		return true
	}

	whoIsTheWinner(participantId, winnerId, matchData, participantsData){

		var msgToBuild = ""
		var opponentId = ""

		//1 - Write winner
		if(matchData.player1Id == participantId) opponentId = matchData.player2Id
		else opponentId = matchData.player1Id

		//Should not be the case! 
		if(opponentId == null){
			msgToBuild += "L'adversaire de votre match (round " + matchData.round + ") est encore inconnu."
		} else {
			msgToBuild += "A l'issue du match (round " + matchData.round + ") contre " + participantsData[opponentId] + ","
			msgToBuild += " le joueur " + participantsData[winnerId] + " a été déclaré vainqueur"
		}

		return msgToBuild
	}


}

module.exports=WinnerIsCommand;