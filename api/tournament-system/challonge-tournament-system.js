const challonge = require('challonge')
const TournamentSystem = require('./tournament-system')
const client = challonge.createClient({
	apiKey: process.env.CHALLONGE_USER_TOKEN
});


//Faut bien convertir ce format tout pourri avant de faire autre chose :D
var convert = function(challongeJson, objectKey){
	var array = []
	for(var i=0;i<Object.keys(challongeJson).length;i++){
		var tournamentJson = challongeJson["" + i][objectKey]
		if(tournamentJson)
			array.push(tournamentJson)
	}
  //console.log('First elem : ' + JSON.stringify(array[0]))
  return array
}

class ChallongeTournamentSystem extends TournamentSystem {
	
	constructor() {
		super('challonge')
	}

	// ------------------------------------------------------
	// PARTICIPANTS
	// ------------------------------------------------------


	getTournamentParticipants(tournamentCode){
		var that = this;
		return new Promise(function(resolve, reject){
			
			client.participants.index({
				id:tournamentCode,
				callback: (err, data) => {
					//console.log("err : " + JSON.stringify(err) + " / data : " + JSON.stringify(data))
					if(err == null){
						console.log('getTrParticipants - Success')
						
						//Si pas de participants, on résout tout de suite :)
						if(!data["0"]){
							return resolve([])
						}
						var array = convert(data, "participant")
						var arrayM = array.map(function(participant){
							return {
								name : participant.name,
								id : participant.id,
								specific_username: participant.challonge_username,
								rank : participant.final_rank,
								waiting_list : participant.on_waiting_list
							}
						})
						return resolve(arrayM)
					} else {
						console.log('getTrParticipants - Error')
						var reason = that.languageManager.getI18NString("tournament-system-tournament-not-found-error")
						return reject(reason)
					}
				}
			})
		})

	}

	registerTournamentParticipant(tournamentCode, participantName){
		var that = this
		return new Promise(function(resolve, reject){
			
			console.log("Entrée dans la méthode registerTournamentParticipant")
			let reason = ""

			client.participants.create({
				id:tournamentCode,
				participant: {
					name: encodeURI("" + participantName)
				},
				callback: (err, data) => {
					console.error("registerTournamentParticipant - Erreur rencontrée lors de l'inscription" + JSON.stringify(err))
					
					if(err) {
						
						switch (err.statusCode) {
							case 401:
							reason += that.languageManager.getI18NString("tournament-system-unauthorized-access")
							break;
							case 422:
							reason += that.languageManager.getI18NString("tournament-system-registration-closed")
							break;
							default:
							reason += "Erreur technique lors de l'inscription au tournoi : demander à l'admin"
							break;
						}
						return reject(reason)

					} else {
						
						console.log("registerTournamentParticipant - Succès lors de l inscription")

						if(data.participant.onWaitingList){
							reason += that.languageManager.getI18NString("tournament-system-join-success-waiting-list")
						} else {
							reason += that.languageManager.getI18NString("tournament-system-join-success")
						}
						return resolve(reason)
					}

				}
			})

		})
	}

	unregisterTournamentParticipant(tournamentCode, participantId){
		var that = this;
		console.log("Entrée dans la fonction unregisterTournamentParticipant params : " + tournamentCode + "," + participantId)

		return new Promise(function(resolve, reject){
			client.participants.destroy({
				id:tournamentCode,
				participantId: participantId,
				callback: (err, data) => {
					if(err) {
						console.error("unregisterTournamentParticipant - Erreur rencontrée lors de l'inscription" + JSON.stringify(err))
						var reason = that.languageManager.getI18NString("tournament-system-leave-error")
						return reject(reason)
					} else {
						console.log("Received data" + JSON.stringify(data))
						let reason = that.languageManager.getI18NString("tournament-system-leave-error")
						if (data.participant != null) 
						{
							if(data.participant.active == false || data.participant.reactivable == true){
								reason = that.languageManager.getI18NString("tournament-system-participant-disactivated")
							} else {
								//Le tournoi n'était pas commencé, le participant est directement disparu du tournoi
								reason = that.languageManager.getI18NString("tournament-system-leave-success")
							}
							return resolve(reason)
						}

					}

				}
			})

		})
	}

	//--------------------------------------------------------
	// -- MATCHES
	//--------------------------------------------------------

	//Index
	getTournamentMatches(tournamentCode, tournamentParticipants){
		console.log("on est là?")
		return new Promise(function(resolve, reject){
			client.matches.index({
				id:tournamentCode,
				callback: (err, data) => {
					//console.log("err : " + JSON.stringify(err) + " / data : " + JSON.stringify(data))
					if(err == null){
						console.log('getTrMatches - Success')
						
						//Si pas de matchs, on résout tout de suite :)
						if(!data["0"]){
							return resolve([])
						}
						var array = convert(data, "match")
						var arrayM = array.map(function(match){
							return {
								id : match.id,
								round : match.round, 
								state : match.state,
								scheduled_time : match.scheduledTime,
								player1Id : match.player1Id, 
								player2Id : match.player2Id, 
								player1Name : (match.player1Id != null) ? tournamentParticipants[match.player1Id] : "TBD",
								player2Name : (match.player2Id != null) ? tournamentParticipants[match.player2Id] : "TBD"
							}
						})
						return resolve(arrayM)
					} else {
						//TODO : Faut vérifier ce bout de code!! 
						console.log('getTrMatches - Error')
						var reason = "Le tirage au sort n'a pas encore été effectué. Votre prochain match est donc encore inconnu."
						return reject(reason)
					}
				}
			})
		})

	}

	declareMatchWinner(tournamentCode, matchId, winnerId, score='0-0'){
		console.log("on est là?")
		return new Promise(function(resolve, reject){
			client.matches.update({
				id: tournamentCode,
				matchId: matchId,
				match : {
					scoresCsv: score,
					winnerId: winnerId
				},
				callback: (err, data) => {
					console.log("err : " + JSON.stringify(err) + " / data : " + JSON.stringify(data))
					if(err){
						var reason = "Il y a eu une erreur lors de la déclaration du vainqueur. Voir avec l'admin"
						return reject(reason)
					} else {
						return resolve("ok")
					}

				}
			})

		})
	}

	//Submit score

}

module.exports=ChallongeTournamentSystem