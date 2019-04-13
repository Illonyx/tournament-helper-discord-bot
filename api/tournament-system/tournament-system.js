class TournamentSystem {

constructor(clientName){
	this.clientName=clientName
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