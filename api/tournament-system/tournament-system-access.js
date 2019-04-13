var ChallongeTournamentSystem = require('./challonge-tournament-system')

class TournamentSystemAccess {

constructor(tournamentSystemName){
	this.tournamentSystemName=tournamentSystemName
	this.tournamentSystem = new ChallongeTournamentSystem()
}

//Participants
getTournamentParticipants(tournamentCode){
	return this.tournamentSystem.getTournamentParticipants(tournamentCode)
}

registerTournamentParticipant(tournamentCode, participant){
	return this.tournamentSystem.registerTournamentParticipant(tournamentCode, participant)
}

unregisterTournamentParticipant(tournamentCode, participantId){
	return this.tournamentSystem.unregisterTournamentParticipant(tournamentCode, participantId)
}

//Matches

getTournamentMatches(tournamentCode){
	return this.tournamentSystem.getTournamentMatches(tournamentCode)
}

declareMatchWinner(tournamentCode, matchId, winnerId, score='0-0'){
	return this.tournamentSystem.declareMatchWinner(tournamentCode, matchId, winnerId, score)
}



getTournamentSystemName(){
	return this.tournamentSystemName
}

}

module.exports=TournamentSystemAccess