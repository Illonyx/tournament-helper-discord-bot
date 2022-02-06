import {LanguageManager} from '../../api/user-settings/language-manager';
import { TournamentSystem, Participant } from '../../api/tournament-system/tournament-system';
import { UserSettingsManager } from '../../api/user-settings/user-settings-manager';
import { ConfigurationSingleton } from '../../configuration-singleton';

const Commando = require('discord.js-commando');

export class LeaveTournamentCommand extends Commando.Command {

	tournamentSystem: TournamentSystem;
	userSettingsManager: UserSettingsManager;
	languageManager: LanguageManager;

	constructor(client: any) {

    super(client, {
        name: 'leave',
        group: 'tournament',
        memberName: 'leave',
        description: 'Leave a challonge tournament by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-leave BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to leave',
            type: 'string'
        }]

    	});
    	this.languageManager = ConfigurationSingleton.getInstance().getLanguageManager();
		this.userSettingsManager = ConfigurationSingleton.getInstance().getUserSettingsManager();
		this.tournamentSystem = this.userSettingsManager.getCurrentTournamentSystem();
    
	}

	async run(message: any, args: any){
		const {text} = args
		var that = this;

		let prefix = that.languageManager.getPolyglotInstance().t("tournament-leave-prefix") + text + " : ";
		let authorName: string;

		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}

		this.tournamentSystem.getTournamentParticipants(text).then(function(result: Participant[]){
			
			//Si le participant est bien inscrit, on peut procéder à sa désinscription
			var found = this.tournamentSystem.checkParticipantRegistration(authorName, result)
			return this.tournamentSystem.unregisterTournamentParticipant(text, found.id)

		}).then((etatValidation: string): void => message.reply(prefix + etatValidation))
		.catch(function(errorReason){
			message.reply(prefix + errorReason)	
		})
	}

}