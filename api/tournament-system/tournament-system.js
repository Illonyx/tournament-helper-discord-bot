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


getClientName(){
	return this.clientName
}

}

module.exports=TournamentSystem