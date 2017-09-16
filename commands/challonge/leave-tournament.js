const Commando = require('discord.js-commando');
const challonge = require('challonge')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

class LeaveTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'leave',
        group: 'challonge',
        memberName: 'leave',
        description: 'Leave a challonge tournament by specifying its code (code is precised in the tournament page)',
        examples: ["Example: tr-leave BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to leave',
            type: 'string'
        }]

    	});
    
	}

	async run(message, args){
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
						client.participants.destroy({
							id: text,
							participantId: participantId,
							callback: (err, data) => {
								console.log(err,data)
								if(data){
									message.channel.sendMessage("Votre désinscription au tournoi " + text + " a bien été prise en compte")
								}
							}
						});
					} else {
						message.channel.sendMessage("Vous n'êtes pas inscrit au tournoi " + text + ", vous ne pouvez pas vous en désinscire :-) ")
						return;
					}

					


				} else {
					message.channel.sendMessage("Le code du tournoi a-t-il bien été saisi?")
				}

			}

		});

		
	}



}

module.exports=LeaveTournamentCommand;