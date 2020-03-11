const Commando = require('discord.js-commando');
import {LanguageManager} from '../../api/user-settings/language-manager';
import { TournamentSystem, Participant } from '../../api/tournament-system/tournament-system';
import { UserSettingsManager } from '../../api/user-settings/user-settings-manager';
import { ConfigurationSingleton } from '../../configuration-singleton';

export class NextMatchTournamentCommand extends Commando.Command {

	tournamentSystem: TournamentSystem;
	userSettingsManager: UserSettingsManager;
	languageManager: LanguageManager;

	constructor(client: any) {

    super(client, {
        name: 'next-match',
        group: 'tournament',
        memberName: 'next-match',
        description: 'Shows the next match a challonge tournament partcipant will do by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-next-match BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to see your future match',
            type: 'string'
        }]

    	});
		this.languageManager = ConfigurationSingleton.getInstance().getLanguageManager();
		this.userSettingsManager = ConfigurationSingleton.getInstance().getUserSettingsManager();
		this.tournamentSystem = this.userSettingsManager.getCurrentTournamentSystem();
    
	}

	async run(message: any, args: any){
		
		
		const {text} = args
		var participantId = ""
		let participantIds: object = {};
		var that = this
		let prefix = that.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.tournament_next_match_prefix) + text
								+ " : "

		let authorName: string;
		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}


		var getParticipantsTask = this.tournamentSystem.getTournamentParticipants(text);
		getParticipantsTask.then(function(result: Participant[]){

			var participantAuthor = this.tournamentSystem.checkParticipantRegistration(authorName, result)
			participantId = participantAuthor.id

			participantIds = result.reduce(function(prev: {[key: string]: string}, curr: Participant){
				prev[curr.id]=curr.name
				return prev
			}, {});

			//Rechercher les prochains matchs qui auront lieu
			return this.tournamentSystem.getTournamentMatches(text, participantIds)
			
		}).then(function(matches){
			console.log("Matches : " + JSON.stringify(matches))
			var openedMatches = this.tournamentSystem.getOpenedMatches(matches)
			console.log("AllPlayerMatches : " + JSON.stringify(openedMatches))
			var found = this.tournamentSystem.getOwnMatches(participantId, openedMatches)

			if(found.length != 1){
				throw("Erreur pas encore gérée ;)")
			}

			var nextMatchSummary = that.buildMatchSummary(found[0])
			message.reply(nextMatchSummary)
		})
		.catch(function(errorReason){
			message.reply(prefix + errorReason)
		})
		
	}

	//TODO : Utiliser un peu de Markdown - s'inspirer de google avec le foot
	buildMatchSummary(matchData: any){
		console.log('Haha');
		var msgToBuild = ""
		var opponentId = ""

		if(opponentId == null){
			msgToBuild += "L'adversaire de votre match (round " + matchData.round + ") est encore inconnu."
		} else {
			msgToBuild += "Votre prochain match (round " + matchData.round + ") vous opposera à : " + matchData.opponentName + ". "
		}

		//2 - Find Scheduled time
		if(matchData.scheduledTime == null){
			msgToBuild += "L'heure n'a pas encore été définie, ou regarder le reglement du tournoi associé."
		} else  {
			msgToBuild += "Le match sera prévu à ce moment : " + matchData.scheduledTime + ". Bonne chance! "
		}

		return msgToBuild;
	}

	



}