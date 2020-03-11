import { TournamentSystem } from "../tournament-system/tournament-system";
import { ChallongeTournamentSystem } from "../tournament-system/challonge-tournament-system";

//Classe qui sera chargée d'aller consulter la base de données sqlite

//https://anidiots.guide/coding-guides/sqlite-based-points-system
export class UserSettingsManager {

	constructor() {

	}

	getCurrentLanguage(): string {
		return "fr"
	}

	getCurrentTournamentSystem(): TournamentSystem {
		return new ChallongeTournamentSystem();
	}

}