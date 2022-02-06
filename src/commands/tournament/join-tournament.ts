const Commando = require('discord.js-commando');

import {LanguageManager} from '../../api/user-settings/language-manager';
import { TournamentSystem, Participant } from '../../api/tournament-system/tournament-system';
import { UserSettingsManager } from '../../api/user-settings/user-settings-manager';
import { ConfigurationSingleton } from '../../configuration-singleton';

export class JoinTournamentCommand extends Commando.Command {

	tournamentSystem: TournamentSystem;
	userSettingsManager: UserSettingsManager;
	languageManager: LanguageManager;


	constructor(client: any) {

    super(client, {
        name: 'join',
        group: 'tournament',
        memberName: 'join',
        description: 'Join a challonge tournament by specifying its code (code is precised in the tournament',
        examples: ["Example: tr-join TournamentExample1"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to join',
            type: 'string'
        }]

    	});
		this.languageManager = ConfigurationSingleton.getInstance().getLanguageManager();
		this.userSettingsManager = ConfigurationSingleton.getInstance().getUserSettingsManager();
		this.tournamentSystem = this.userSettingsManager.getCurrentTournamentSystem();
	}

	async run(message: any, args: any){
		const {text} = args
		let prefix = this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_join_prefix) + text
								+ " : "

		var authorName: string;
		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}

		this.tournamentSystem.getTournamentParticipants(text).then(function(result: Participant[]){

			//Chercher si le participant est inscrit
			var found = result.find(function(participant){
				return participant.name == authorName
			})
			if(found){
				throw this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.join_command_already_registered)
			}
			
			//Si le participant n'a pas été trouvé, on procède à l'inscription
			return this.tournamentSystem.registerTournamentParticipant(text, authorName);
		}).then(function(etatValidation){
			message.reply(prefix + etatValidation)
		})
		.catch(function(errorReason){
			message.reply(prefix + errorReason)	
		})

	}



}