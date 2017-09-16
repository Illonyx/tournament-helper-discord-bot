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
		message.sendMessage("Commande en cours d'écriture")
		/*
		const {text} = args
		var participantId = ""

		client.participants.index({
			id:text,
			callback: (err,data) => {
				console.log(err,data)
				if (data["0"]) {
					
					for(var i=0;i<Object.keys(data).length;i++){
						if(data[i + ""] && data[i + ""].participant.name == message.author.username){
							participantId=data[i + ""].participant.id
						}
					}

					if(participantId != ""){
						
						//Find match to show
						client.matches.index({
							id: text,
							callback: (err, data) => {
								

								if(data[0]){

								} else {
									message.channel.sendMessage("Vous n'êtes pas inscrit au tournoi " + text + ", vous ne pouvez pas effectuer cette action")
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
		*/

		
	}



}

module.exports=NextMatchTournamentCommand;