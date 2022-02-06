import * as fs from 'fs';
import Polyglot from 'node-polyglot';

import {UserSettingsManager} from './user-settings-manager';

export class BotKeys {

	setlanguage_choose: string;
	setlanguage_chosen: string;
	tournament_system_tournament_not_found_error: string;
	tournament_system_participant_not_found: string;
	tournament_join_prefix: string;
	tournament_system_unauthorized_access: string;
	tournament_system_registration_closed: string;
	tournament_system_join_error: string;
	tournament_system_join_error_reason1: string;
	tournament_system_join_success: string;
	tournament_system_join_success_waiting_list: string;
	tournament_leave_prefix: string;
	tournament_system_leave_error: string;
	tournament_system_participant_disactivated: string;
	tournament_system_leave_success: string;
	tournament_next_match_prefix: string;
	tournament_system_next_match_tournament_not_started: string;
	tournament_system_tournament_is_finished: string;
	tournament_system_winner_is_error: string;
	join_command_description: string;
	join_command_trcode_missing_arg: string;
	join_command_already_registered: string;
	leave_command_description: string;
	leave_command_trcode_missing_arg: string;
	leave_command_already_left_mdr: string;

	constructor();
	constructor(
		setlanguage_choose: string = "setlanguage-choose",
		setlanguage_chosen: string = "setlanguage-chosen",
		tournament_system_tournament_not_found_error: string = 'tournament-system-tournament-not-found-error',
		tournament_system_participant_not_found: string = 'tournament-system-participant-not-found',
		tournament_join_prefix: string = "tournament-join-prefix",
		tournament_system_unauthorized_access: string = 'tournament-system-unauthorized-access',
		tournament_system_registration_closed: string = 'tournament-system-registration-closed',
		tournament_system_join_error: string = 'tournament-system-join-error',
		tournament_system_join_error_reason1: string = 'tournament-system-join-error-reason1',
		tournament_system_join_success: string = 'tournament-system-join-success',
		tournament_system_join_success_waiting_list: string = 'tournament-system-join-success-waiting-list',
		tournament_leave_prefix: string = "tournament-leave-prefix",
		tournament_system_leave_error: string = 'tournament-system-leave-error',
		tournament_system_participant_disactivated : string = 'tournament-system-participant-disactivated',
		tournament_system_leave_success: string = 'tournament-system-leave-success',
		tournament_next_match_prefix: string = 'tournament-next-match-prefix',
		tournament_system_next_match_tournament_not_started: string = 'tournament-system-next-match-tournament-not-started',
		tournament_system_tournament_is_finished: string = 'tournament-system-tournament-is-finished',
		tournament_system_winner_is_error: string = 'tournament-system-winner-is-error',
		join_command_description: string = 'join-command-description',
		join_command_trcode_missing_arg: string = 'join-command-trcode-missing-arg',
		join_command_already_registered: string = 'join-command-already-registered',
		leave_command_description: string = 'leave-command-description',
		leave_command_trcode_missing_arg: string='leave-command-trcode-missing-arg',
		leave_command_already_left: string='leavecommand-already-left'
	)
	{
		this.setlanguage_choose = setlanguage_choose;
		this.setlanguage_chosen = setlanguage_chosen;
		this.tournament_system_tournament_not_found_error = tournament_system_tournament_not_found_error;
		this.tournament_system_participant_not_found = tournament_system_participant_not_found;
		this.tournament_join_prefix = tournament_join_prefix;
		this.tournament_system_unauthorized_access = tournament_system_unauthorized_access;
		this.tournament_system_registration_closed = tournament_system_registration_closed;
		this.tournament_system_join_error = tournament_system_join_error;
		this.tournament_system_join_error_reason1 = tournament_system_join_error_reason1;
		this.tournament_system_join_success = tournament_system_join_success;
		this.tournament_system_join_success_waiting_list = tournament_system_join_success_waiting_list;
		this.tournament_leave_prefix = tournament_leave_prefix;
		this.tournament_system_leave_error = tournament_system_leave_error;
		this.tournament_system_participant_disactivated = tournament_system_participant_disactivated;
		this.tournament_system_leave_success = tournament_system_leave_success;
		this.tournament_next_match_prefix = tournament_next_match_prefix;
		this.tournament_system_next_match_tournament_not_started = tournament_system_next_match_tournament_not_started;
		this.tournament_system_tournament_is_finished = tournament_system_tournament_is_finished;
		this.tournament_system_winner_is_error = tournament_system_winner_is_error;
		this.join_command_description = join_command_description;
		this.join_command_trcode_missing_arg = join_command_trcode_missing_arg;
		this.join_command_already_registered = join_command_already_registered;
		this.leave_command_description = leave_command_description;
		this.leave_command_trcode_missing_arg = leave_command_trcode_missing_arg;
		this.leave_command_already_left_mdr = leave_command_already_left;
	}
}

export interface LanguageItem {
	key: string,
	name: string,
	icon: string,
	description?: string
}

export class LanguageManager {

	static I18NKeys: BotKeys = new BotKeys();

	polyglot = new Polyglot();
	availableLanguages: LanguageItem[];
	languageDictionary : Map<string, BotKeys> = new Map();

	constructor(private userSettingsManager: UserSettingsManager) {
		this.loadLanguagesFile();
		this.userSettingsManager = userSettingsManager;
		this.loadLocale();
	}

	loadLanguagesFile() {
		const jsonFile: any = fs.readFileSync('languages.json');
		const languagesJSON = JSON.parse(jsonFile);
		this.availableLanguages = languagesJSON["languages"];
		this.availableLanguages.forEach((language) => {
			const languageDic: BotKeys = languagesJSON["dictionary"][language.key] as BotKeys;
			this.languageDictionary.set(language.key, languageDic);
		});
	}

	loadLocale(): void {
		let localeInDb = this.userSettingsManager.getCurrentLanguage();
		let localePhrases: BotKeys = this.languageDictionary.get(localeInDb);
		if(!localePhrases) throw "Locale not found";
		this.polyglot.replace(localePhrases);
	}

	getAvailableLanguages(): LanguageItem[] {
		return this.availableLanguages;
	}

	getPolyglotInstance(): Polyglot {
		return this.polyglot;
	}

}