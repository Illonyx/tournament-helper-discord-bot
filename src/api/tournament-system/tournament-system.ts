import { ConfigurationSingleton } from "../../configuration-singleton";
import { LanguageManager } from "../user-settings/language-manager";

export interface Participant {
	id : string,
	name : string,
	specific_username: string,
	rank : number,
	waiting_list : boolean
}

// Pas génial cette duplication de player1/2
export interface Match {
	id : string,
	round : number, 
	state : string,
	scheduled_time : any,
	player1Id : string, 
	player2Id : string, 
	player1Name : string,
	player2Name : string,
	opponentId?: string,
	opponentName?: string
}

export abstract class TournamentSystem {

	private clientName: string;
	protected languageManager: LanguageManager;

	constructor(clientName: string) {
		this.clientName = clientName;
		this.languageManager = ConfigurationSingleton.getInstance().getLanguageManager();
	}

	//Participants
	abstract getTournamentParticipants(tournamentCode: string): Promise<Participant[] | string>;
	abstract registerTournamentParticipant(tournamentCode: string, participantName : string): Promise<string>;
	abstract unregisterTournamentParticipant(tournamentCode: string, participantId: string): Promise<string>;

	//If participant is correctly registered, returns participant matching with given Name. Else, it throws exception.
	checkParticipantRegistration(participantName: string, tournamentParticipants: Participant[]) {

		var found = tournamentParticipants.find(function (participant) {
			return (participant.name == participantName) || (participant.specific_username == participantName)
		})
		if (!found) {
			throw this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_participant_not_found) + participantName
		} else return found
	}

	//Matches

	abstract getTournamentMatches(tournamentCode: string, tournamentParticipantIds: {[key: string]: string}): Promise<Match[] | string>
	abstract declareMatchWinner(tournamentCode: string, matchId: string, winnerId: string, score?: string): Promise<string>

	getOwnMatches(participantId: string, matches: Match[]) {
		if (matches.length == 0) {
			//Tournament has not started, matches have not been generated yet
			throw this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_next_match_tournament_not_started);
		}
		var foundMatches = matches.filter(function (match) {
			match.opponentId = (match.player1Id == participantId) ? match.player2Id : match.player1Id
			match.opponentName = (match.player1Id == participantId) ? match.player2Name : match.player1Name
			return (match.player1Id == participantId || match.player2Id == participantId)
		})
		if (foundMatches.length == 0) {
			//TODO : Mettre le dernier match joué et le résultat
			throw this.languageManager.getPolyglotInstance().t("next-match-match-not-found-error")
		}
		return foundMatches
	}

	getOpenedMatches(matches: any[]) {
		if (matches.length == 0) {
			//Tournament has not started, matches have not been generated yet
			throw this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_next_match_tournament_not_started);
		}
		var found = matches.filter(function (match) {
			return (match.state == 'open' || match.state == 'pending')
		})
		if (found.length == 0) {
			//Tournament is finished, there is no opened or pending matches! 
			throw this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_system_tournament_is_finished);
		}
		return found
	}

	getMatchesByRound(matches: Match[]): any {
		return matches.reduce(function (prev: {[key: string]: Match[]}, curr: Match) {
			let key: string = "" + curr.round;
			if (!prev[key]) {
				prev["" + curr.round] = []
			}
			prev["" + curr.round].push(curr)
			return prev
		}, {})
	}


	getClientName() {
		return this.clientName
	}

}