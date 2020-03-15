import { TournamentSystem } from "../tournament-system/tournament-system";
import { ChallongeTournamentSystem } from "../tournament-system/challonge-tournament-system";
import Database from "better-sqlite3";

//Classe qui sera chargée d'aller consulter la base de données sqlite

interface Setting {
	id: string,
	key: string,
	value: string
}

//https://anidiots.guide/coding-guides/sqlite-based-points-system
export class UserSettingsManager {

	sql: any;

	constructor() {
		this.sql = new Database('./db.sqlite');
		this.initDefaultSettings();
	}

	initDefaultSettings(): void {
		// Check if the table "settings" exists.
		const table = this.sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'settings';").get();
		if (!table['count(*)']) {

			// If the table isn't there, create it and setup the database correctly.
			this.sql.prepare("CREATE TABLE settings (id TEXT PRIMARY KEY, key TEXT, value TEXT);").run();

			// Ensure that the "id" row is always unique and indexed.
			this.sql.prepare("CREATE UNIQUE INDEX idx_settings_id ON settings (id);").run();
			this.sql.pragma("synchronous = 1");
			this.sql.pragma("journal_mode = wal");

			//Put default settings
			this.setUserSetting('tb-server-locale', 'bot-locale', 'fr');
			this.setUserSetting('tb-server-tournament-system', 'tournament-system', 'challonge');
		}
	}

	getUserSetting(key: string) : Setting {
		let command = this.sql.prepare("SELECT * FROM settings WHERE key = ?");
		return command.get(key);
	}

	setUserSetting(id: string, key: string, label: string){
		let command = this.sql.prepare("INSERT OR REPLACE INTO settings (id,key,value) VALUES (@id, @key, @value);");
		command.run({
			id : id,
			key : key,
			value: label
		});
	}

	setLocale(locale: string){
		this.setUserSetting('tb-server-locale', 'bot-locale', locale);
	}

	getCurrentLanguage(): string {
		return this.getUserSetting('bot-locale').value;
	}

	getCurrentTournamentSystem(): TournamentSystem {
		let dbTournamentSystem: string = this.getUserSetting('tournament-system').value;
		let tournamentSystemToReturn : TournamentSystem;
		switch(dbTournamentSystem){
			case 'challonge':
				tournamentSystemToReturn = new ChallongeTournamentSystem();
				break;

			case 'toornament':
				console.log('In developement');
				break;

			default:
				tournamentSystemToReturn = new ChallongeTournamentSystem();
				break;
		}
		return tournamentSystemToReturn;
	}

}