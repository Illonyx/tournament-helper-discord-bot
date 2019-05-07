const LanguageManager = require('../user-settings/language-manager')

class TournamentSystem {

constructor(clientName){
	this.clientName = clientName
	this.languageManager = new LanguageManager()
}

//Participants
getTournamentParticipants(tournamentCode){
	
}

registerTournamentParticipant(tournamentCode, participant){
	
}

unregisterTournamentParticipant(tournamentCode, participantId){
	
}

//If participant is correctly registered, returns participant matching with given Name. Else, it throws exception.
checkParticipantRegistration(participantName, tournamentParticipants){
	
	var found = tournamentParticipants.find(function(participant){
		return (participant.name == participantName) || (participant.specific_username == participantName)
	})
	if(!found){
		throw this.languageManager.getI18NString("tournament-system-participant-not-found") + participantName
	} else return found
}

//Matches

getTournamentMatches(tournamentCode){

}

declareMatchWinner(tournamentCode, matchId, winnerId, score='0-0'){
	
}

getOwnMatches(participantId, matches){
	if(matches.length == 0){
		//Tournament has not started, matches have not been generated yet
		throw this.languageManager.getI18NString("tournament-system-next-match-tournament-not-started")
	}
	var foundMatches = matches.filter(function(match){
		match.opponentId = (match.player1Id == participantId) ? match.player2Id : match.player1Id
		match.opponentName = (match.player1Id == participantId) ? match.player2Name : match.player1Name
		return (match.player1Id == participantId || match.player2Id == participantId)
	})
	if(foundMatches.length == 0){
		//TODO : Mettre le dernier match joué et le résultat
		throw this.languageManager.getI18NString("next-match-match-not-found-error")
	}
	return foundMatches
}

getOpenedMatches(matches){
	if(matches.length == 0){
		//Tournament has not started, matches have not been generated yet
		throw this.languageManager.getI18NString("tournament-system-next-match-tournament-not-started")
	}
	var found = matches.filter(function(match){
		return (match.state == 'open' || match.state == 'pending')
	})
	if(found.length == 0){
		//Tournament is finished, there is no opened or pending matches! 
		throw this.languageManager.getI18NString("tournament-system-tournament-is-finished")
	}
	return found
}

getMatchesByRound(matches){
	return matches.reduce(function(prev, curr){
			if(!prev["" + curr.round]){
				prev["" + curr.round]=[]
			}
			prev[""+curr.round].push(curr)
			return prev
		}, {})
}


getClientName(){
	return this.clientName
}

}

module.exports=TournamentSystem