const Commando = require('discord.js-commando');
const challonge = require('challonge')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

class WinnerIsCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'winner-is',
        group: 'challonge',
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
    
	}

	async run(message, {text, winner, tournamentpseudo}){
		
		var winnername = ''
		if(tournamentpseudo != ''){
			winnername = tournamentpseudo
		} else {
			winnername = winner.displayName
		}

		var participantId = ""
		var winnerId = ""
		var participantIds = [];

		var authorName;
		//Know where message comes from
		if(message.member){
			authorName=message.member.displayName
		} else {
			authorName=message.author.username
		}
		console.log("ss" + authorName)

		client.participants.index({
			id:text,
			callback: (err,data) => {
				
				if (data["0"]) {
					
					for(var i=0;i<Object.keys(data).length;i++){

						var nameValue = (data[i + ""].participant.name != "") ? data[i + ""].participant.name : data[i + ""].participant.challongeUsername
						participantIds[data[i + ""].participant.id] = nameValue
						if(data[i + ""] && nameValue == authorName){
							participantId=data[i + ""].participant.id
							
						}
						console.log("winnername" + winnername)
						if(data[i + ""] && nameValue == winnername){
							winnerId=data[i + ""].participant.id
						}

					}

					console.log("e" + winnerId)

					if(participantId == "" || winnerId == ""){
						message.reply("Impossible de trouver le vainqueur déclaré pour votre match : faute de frappe? ")
						return;
					}

					if(participantId != ""){
						//Find match to show
						client.matches.index({
							id: text,
							callback: (err, data) => {
								console.log(err,data)
								if(data["0"]){
									
									for(var i=0;i<Object.keys(data).length;i++){
										if(data[i + ""] && (data[i + ""].match.state == 'open' || data[i + ""].match.state == 'pending') && (data[i + ""].match.player1Id == participantId || data[i + ""].match.player2Id == participantId)){
											
											var matchData = data[i + ""].match
											if(!this.isLastRoundOver(data, matchData.round)){
												message.reply("Les matchs du round d'avant ne sont pas encore terminés. Veuillez attendre la fin des matchs d'avant pour commencer votre match/déclarer votre résultat")
												return; 
											}
											client.matches.update({
												id: text,
												  matchId: matchData.id,
												  match: {
												  	scoresCsv: '0-0',
												  	winnerId: winnerId
												  },
												callback: (err, data) => {
													//console.log(err, data);
													var msg = this.whoIsTheWinner(participantId, winnerId, matchData, participantIds)
													message.reply(msg)

												}
											});
											
											




											return;
										}
									}
									message.reply("Votre prochain match n'a pas été trouvé. Vous avez donc été éliminé ou n'avez plus de matchs à faire? Bonne chance pour la suite ;D")

								} else {
									message.reply("Les matchs du tournoi " + text + " n'ont pas encore été tirés au sort")
								}





							}
						});





					} else {
						message.channel.sendMessage("Vous n'êtes pas inscrit au tournoi " + text + ", vous ne pouvez pas effectuer cette action")
						return;
					}

					


				} else {
					message.channel.sendMessage("Le code du tournoi a-t-il bien été saisi?")
				}

			}

		});
		
	
		
	}

	isLastRoundOver(data, currentRound){

		//These are the first rounds, no need to wait
		if(currentRound == 1) return true;

		var matchByRound = {}
		
		for(var i=0;i<Object.keys(data).length;i++){
			if(data[i + ""]){
				var matchData = data[i + ""].match
				if(!matchByRound[matchData.round]){
					matchByRound[matchData.round] = []
				}
				matchByRound[matchData.round].push(matchData)

			}
		}
		
		var lastRound = currentRound - 1
		var allRoundMatches = matchByRound[lastRound + ""]
		
		for(var j=0; j < allRoundMatches.length; j++){
			var match = allRoundMatches[j]
			if(match.state != "complete"){
				return false
			}
		}

		return true
		



	}

	whoIsTheWinner(participantId, winnerId, matchData, participantsData){

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

module.exports=WinnerIsCommand;