const challonge = require('challonge')
const TournamentSystem = require('./tournament-system')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

//Faut bien convertir ce format tout pourri avant de faire autre chose :D
var convert = function(challongeJson, objectKey){
  var array = []
  console.log("aa" + Object.keys(challongeJson).length)
  for(var i=0;i<Object.keys(challongeJson).length;i++){
    var tournamentJson = challongeJson["" + i][objectKey]
    if(tournamentJson)
      array.push(tournamentJson)
  }
  //console.log('First elem : ' + JSON.stringify(array[0]))
  return array
}

class ChallongeTournamentSystem extends TournamentSystem {
	
	constructor(){
		super('challonge')
	}

	// ------------------------------------------------------
	// PARTICIPANTS
	// ------------------------------------------------------


	getTournamentParticipants(tournamentCode){
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
						var reason = "Le code du tournoi a t il été bien saisi?"
						return reject(reason)
					}
				}
			})
		})

	}

	registerTournamentParticipant(tournamentCode, participantName){
		return new Promise(function(resolve, reject){
			client.participants.create({
				id:tournamentCode,
				participant: {
		 			name: encodeURI("" + participantName)
		 		},
				callback: (err, data) => {
					//console.log("err : " + JSON.stringify(err) + " / data : " + JSON.stringify(data))
					if(err){
						var reason = "Erreur lors de l'inscription : le tournoi est complet :("
						return reject(reason)
					} else {
						console.log(data)
						if(data.participant.onWaitingList){
		 					return resolve("Le tournoi est complet : vous avez été placé sur liste d'attente")
		 				} else {
							return resolve("Votre inscription au tournoi" + tournamentCode + " a bien été prise en compte")
						}
					}

				}
			})

		})
	}

	unregisterTournamentParticipant(tournamentCode, participantId){
		console.log("on est là?")
		return new Promise(function(resolve, reject){
			client.participants.destroy({
				id:tournamentCode,
				participantId: participantId,
				callback: (err, data) => {
					//console.log("err : " + JSON.stringify(err) + " / data : " + JSON.stringify(data))
					if(err){
						var reason = "Désinscription impossible? Voir avec l'admin du tournoi"
						return reject(reason)
					} else {
						return resolve("Votre désinscription au tournoi " + tournamentCode + " a bien été prise en compte")
					}

				}
			})

		})
	}

	//--------------------------------------------------------
	// -- MATCHES
	//--------------------------------------------------------

	//Index
	getTournamentMatches(tournamentCode){
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
				        		player2Id : match.player2Id

				      		}
				    	})
				    	return resolve(arrayM)
			    	} else {
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
					//console.log("err : " + JSON.stringify(err) + " / data : " + JSON.stringify(data))
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