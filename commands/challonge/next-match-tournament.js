const Commando = require('discord.js-commando');
const challonge = require('challonge')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

class NextMatchTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'next-match',
        group: 'challonge',
        memberName: 'next-match',
        description: 'Shows the next match a challonge tournament partcipant will do by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-next-match BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to see your future match',
            type: 'string'
        }]

    	});
    
	}

	async run(message, args){
		
		
		const {text} = args
		var participantId = ""
		var participantIds = [];

		client.participants.index({
			id:text,
			callback: (err,data) => {
				
				if (data["0"]) {
					
					for(var i=0;i<Object.keys(data).length;i++){
						participantIds[data[i + ""].participant.id] = data[i + ""].participant.name
						if(data[i + ""] && data[i + ""].participant.name == message.author.username){
							participantId=data[i + ""].participant.id
							
						}

					}

					console.log("e" + participantId)
					if(participantId != ""){
						//Find match to show
						client.matches.index({
							id: text,
							callback: (err, data) => {
								console.log(err,data)
								if(data["0"]){
									
									for(var i=0;i<Object.keys(data).length;i++){
										if(data[i + ""] && (data[i + ""].match.state == 'open' || data[i + ""].match.state == 'pending') && (data[i + ""].match.player1Id == participantId || data[i + ""].match.player2Id == participantId)){
											var summary = this.buildMatchSummary(participantId, data[i + ""].match, participantIds)
											message.channel.sendMessage(summary)
											return;
										}
									}
									message.channel.sendMessage("Votre prochain match n'a pas été trouvé. Vous avez donc été éliminé ou n'avez plus de matchs à faire? Bonne chance pour la suite ;D")

								} else {
									message.channel.sendMessage("Les matchs du tournoi " + text + " n'ont pas encore été tirés au sort")
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

	buildMatchSummary(participantId, matchData, participantsData){
		console.log('Haha');
		var msgToBuild = ""
		var opponentId = ""

		//1 - Find opponent
		if(matchData.player1Id == participantId) opponentId = matchData.player2Id
		else opponentId = matchData.player1Id

		if(opponentId == null){
			msgToBuild += "L'adversaire de votre match (round " + matchData.round + ") est encore inconnu."
		} else {
			msgToBuild += "Votre prochain match (round " + matchData.round + ") vous opposera à : " + participantsData[opponentId] + ". "
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

module.exports=NextMatchTournamentCommand;