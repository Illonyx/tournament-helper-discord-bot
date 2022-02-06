import { TournamentSystem, Participant, Match } from "./tournament-system";
import { LanguageManager } from "../user-settings/language-manager";

const challonge = require('challonge')
const client = challonge.createClient({
	apiKey: process.env.CHALLONGE_USER_TOKEN
});


//Faut bien convertir ce format tout pourri avant de faire autre chose :D
var convert = function(challongeJson: any, objectKey: string){
	var array = []
	for(var i=0;i<Object.keys(challongeJson).length;i++){
		var tournamentJson = challongeJson["" + i][objectKey]
		if(tournamentJson)
			array.push(tournamentJson)
	}
  //console.log('First elem : ' + JSON.stringify(array[0]))
  return array
}

export class ChallongeTournamentSystem extends TournamentSystem {
	
	constructor() {
		super('challonge')
	}

	// ------------------------------------------------------
	// PARTICIPANTS
	// ------------------------------------------------------

	getTournamentParticipants(tournamentCode: string): Promise<Participant[] | string> {
		var that = this;
		return new Promise(function(resolve, reject){
			
			client.participants.index({
				id:tournamentCode,
				callback: (err: any, data: any) => {
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
						return resolve(arrayM);
					} else {
						console.log('getTrParticipants - Error')
						var reason = that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_tournament_not_found_error);
						return reject(reason)
					}
				}
			})
		})

	}

	registerTournamentParticipant(tournamentCode: string, participantName: string): Promise<string> {
		var that = this;
		return new Promise(function(resolve, reject){
			
			console.log("Entrée dans la méthode registerTournamentParticipant")
			let reason = ""

			client.participants.create({
				id:tournamentCode,
				participant: {
					name: encodeURI("" + participantName)
				},
				callback: (err: any, data: any) => {
					console.error("registerTournamentParticipant - Erreur rencontrée lors de l'inscription" + JSON.stringify(err))
					
					if(err) {
						
						switch (err.statusCode) {
							case 401:
							reason += that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_unauthorized_access)
							break;

							case 422:
							reason += that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_registration_closed);
							break;

							default:
							reason += "Erreur technique lors de l'inscription au tournoi : demander à l'admin"
							break;
						}
						return reject(reason)

					} else {
						
						console.log("registerTournamentParticipant - Succès lors de l inscription")

						if(data.participant.onWaitingList){
							reason += that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_join_success_waiting_list)
						} else {
							reason += that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_join_success);
						}
						return resolve(reason)
					}

				}
			})

		})
	}

	unregisterTournamentParticipant(tournamentCode: string, participantId: string): Promise<string> {
		var that = this;
		console.log("Entrée dans la fonction unregisterTournamentParticipant params : " + tournamentCode + "," + participantId)

		return new Promise(function(resolve, reject){
			client.participants.destroy({
				id:tournamentCode,
				participantId: participantId,
				callback: (err: any, data: any) => {
					if(err) {
						console.error("unregisterTournamentParticipant - Erreur rencontrée lors de l'inscription" + JSON.stringify(err))
						var reason = that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_leave_error);
						return reject(reason)
					} else {
						console.log("Received data" + JSON.stringify(data))
						let reason;
						if (data.participant != null) 
						{
							if(data.participant.active == false || data.participant.reactivable == true){
								reason = that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_participant_disactivated);
							} else {
								//Le tournoi n'était pas commencé, le participant est directement disparu du tournoi
								reason = that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_leave_success);
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
	getTournamentMatches(tournamentCode: string, tournamentParticipants: {[key: string]: string}): Promise<Match[] | string> {
		return new Promise(function(resolve, reject){
			client.matches.index({
				id:tournamentCode,
				callback: (err: any, data: any) => {
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

	declareMatchWinner(tournamentCode: string, matchId: string, winnerId:string, score='0-0'): Promise<string> {
		return new Promise(function(resolve, reject){
			client.matches.update({
				id: tournamentCode,
				matchId: matchId,
				match : {
					scoresCsv: score,
					winnerId: winnerId
				},
				callback: (err:any, data:any) => {
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

}