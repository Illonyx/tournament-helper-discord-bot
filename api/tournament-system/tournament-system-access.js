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

checkParticipantRegistration(participantName, tournamentParticipants){
	return this.tournamentSystem.checkParticipantRegistration(participantName, tournamentParticipants)
}

//Matches

getTournamentMatches(tournamentCode, tournamentParticipants){
	return this.tournamentSystem.getTournamentMatches(tournamentCode, tournamentParticipants)
}

getOwnMatches(participantId, matches){
	return this.tournamentSystem.getOwnMatches(participantId, matches)
}

declareMatchWinner(tournamentCode, matchId, winnerId, score='0-0'){
	return this.tournamentSystem.declareMatchWinner(tournamentCode, matchId, winnerId, score)
}

getParticipantMatches(participantId, matches){
	return this.tournamentSystem.getOwnMatches(participantId, matches)
}

getOpenedMatches(matches){
	return this.tournamentSystem.getOpenedMatches(matches)
}

getMatchesByRound(matches){
	return this.tournamentSystem.getMatchesByRound(matches)
}


getTournamentSystemName(){
	return this.tournamentSystemName
}

}

module.exports=TournamentSystemAccess