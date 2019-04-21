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