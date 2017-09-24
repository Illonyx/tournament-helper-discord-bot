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
        description: 'Allows to register a match result for a tournament by specifying its code (code is precised in the tournament page) and winner name',
        examples: ["Example: tr-winner-is BrawlhallaTourney01 Brian"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to see your future match',
            type: 'string'
        }, {
            key: 'winnername',
            prompt: 'Precise the match winner name',
            type: 'string'
        }]

    	});
    
	}

	async run(message, {text, winnername}){
		
		var participantId = ""
		var winnerId = ""
		var participantIds = [];

		client.participants.index({
			id:text,
			callback: (err,data) => {
				
				if (data["0"]) {
					
					for(var i=0;i<Object.keys(data).length;i++){

						var nameValue = (data[i + ""].participant.name != "") ? data[i + ""].participant.name : data[i + ""].participant.challongeUsername
						participantIds[data[i + ""].participant.id] = nameValue
						if(data[i + ""] && nameValue == message.author.username){
							participantId=data[i + ""].participant.id
							
						}
						console.log("winnername" + winnername)
						if(data[i + ""] && nameValue == winnername){
							winnerId=data[i + ""].participant.id
							
						}

					}

					console.log("e" + winnerId)
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
											console.log("f" + matchData.id)
											client.matches.update({
												id: text,
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


	whoIsTheWinner(participantId, winnerId, matchData, participantsData){

		console.log('Haha');
		var msgToBuild = ""
		var opponentId = ""

		//1 - Write winner
		if(matchData.player1Id == participantId) opponentId = matchData.player2Id
		else opponentId = matchData.player1Id

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