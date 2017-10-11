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
				console.log(err,data)
				if (data["0"]) {
					
					for(var i=0;i<Object.keys(data).length;i++){
						if(data[i + ""] && data[i + ""].participant.name == authorName){
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
									message.reply("Votre désinscription au tournoi " + text + " a bien été prise en compte")
								}
							}
						});
					} else {
						message.reply("Vous n'êtes pas inscrit au tournoi " + text + ", vous ne pouvez pas vous en désinscire :-) ")
						return;
					}

					


				} else {
					message.reply("Le code du tournoi a-t-il bien été saisi?")
				}

			}

		});

		
	}



}

module.exports=LeaveTournamentCommand;