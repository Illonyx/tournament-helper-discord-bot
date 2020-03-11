const Commando = require('discord.js-commando');

import {LanguageManager} from '../../api/user-settings/language-manager';
import { TournamentSystem, Participant, Match } from '../../api/tournament-system/tournament-system';
import { UserSettingsManager } from '../../api/user-settings/user-settings-manager';
import { ConfigurationSingleton } from '../../configuration-singleton';

export class WinnerIsCommand extends Commando.Command {

	tournamentSystem: TournamentSystem;
	userSettingsManager: UserSettingsManager;
	languageManager: LanguageManager;

	//Le type member ne peut pas être utilisé dans un message privé au bot
	constructor(client: any) {

    super(client, {
        name: 'winner-is',
        group: 'tournament',
        memberName: 'winner-is',
        description: 'Allows to register a match result for a tournament by specifying its code (code is precised in the tournament page) and winner name (you can mention winner, if its challonge pseudo id is not the same, you can add it in command',
        examples: ["Example: tr-winner-is BrawlhallaTourney01 @Brian#2789, tr-winner-is SRTest @User#XXXX ChallongeTournamentPseudo"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to see your future match',
            type: 'string'
        }, {
            key: 'winner',
            prompt: 'Mention match winner',
            type: 'member', 
        }, {
            key: 'tournamentpseudo',
            prompt: 'If match winner does not have the same tournament pseudo than his Discord pseudo, override it by this',
            type: 'string',
            default : '' 
        }]

    	});
		this.languageManager = ConfigurationSingleton.getInstance().getLanguageManager();
		this.userSettingsManager = ConfigurationSingleton.getInstance().getUserSettingsManager();
		this.tournamentSystem = this.userSettingsManager.getCurrentTournamentSystem();
    
	}

	async run(message: any, {text, winner, tournamentpseudo}: any){
		
		var winnerName = ''
		if(tournamentpseudo != ''){
			winnerName = tournamentpseudo
		} else {
			winnerName = winner.displayName
		}

		var participantId = ""
		var winnerId = ""
		let participantIds: object = {};
		let participantMatch: Match;
		var that = this

		let authorName: string;
		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}
		console.log("ss" + authorName)

		var getParticipantsTask = this.tournamentSystem.getTournamentParticipants(text)
		getParticipantsTask.then(function(result: Participant[]){

			//Chercher si le participant est inscrit - si la personne s'est inscrite directement sur le tournoi, on essaie de matcher
			var foundParticipant = this.tournamentSystem.checkParticipantRegistration(authorName, result);
			participantId=foundParticipant.id

			//Chercher si le nom du winner correspond à quelque chose
			var foundWinner = this.tournamentSystem.checkParticipantRegistration(winnerName, result)
			winnerId=foundWinner.id
			
			participantIds=result.reduce(function(prev: {[key: string]: string}, curr){
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
				throw "Technical Error!"
			}
			participantMatch=found[0]


			//lastroundover à gérer
			var isLastRoundOver = that.isLastRoundOver(matches, participantMatch.round)
			if(!isLastRoundOver){
				throw that.languageManager.getPolyglotInstance().t("winner-is-round-not-finished");
			}
			return this.tournamentSystem.declareMatchWinner(text, participantMatch.id, winnerId)
		}).then(function(result){
			var confirmationMessage = that.whoIsTheWinner(participantId, winnerId, participantMatch, participantIds)
			message.reply(confirmationMessage)
		})
		.catch(function(errorReason){
			message.reply(errorReason)	
		})		
	}

	isLastRoundOver(matches: Match[], currentRound: number){

		//These are the first rounds, no need to wait
		if(currentRound == 1) return true;

		var matchesByRound = this.tournamentSystem.getMatchesByRound(matches)
		
		var lastRound = currentRound - 1
		var allRoundMatches = matchesByRound[lastRound + ""]
		
		for(var j=0; j < allRoundMatches.length; j++){
			var match = allRoundMatches[j]
			if(match.state != "complete"){
				return false
			}
		}

		return true
	}

	//TODO : A refaire aussi avec build Summary
	whoIsTheWinner(participantId: string, winnerId: string, matchData: Match, participantsData: any){

		var msgToBuild = ""
		var opponentId = ""

		//1 - Write winner
		if(matchData.player1Id == participantId) opponentId = matchData.player2Id
		else opponentId = matchData.player1Id

		//Should not be the case! 
		if(opponentId == null){
			msgToBuild += "L'adversaire de votre match (round " + matchData.round + ") est encore inconnu."
		} else {
			msgToBuild += "A l'issue du match (round " + matchData.round + ") contre " + participantsData[opponentId] + ","
			msgToBuild += " le joueur " + participantsData[winnerId] + " a été déclaré vainqueur"
		}

		return msgToBuild
	}


}