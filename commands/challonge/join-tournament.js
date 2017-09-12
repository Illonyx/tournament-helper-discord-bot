const Commando = require('discord.js-commando');
const challonge = require('challonge')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

class JoinTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'join',
        group: 'challonge',
        memberName: 'join',
        description: 'Join a challonge tournament by specifying its code (code is precised in the tournament',
        examples: ["Example: !join BrawlhallaTourney01"],
        args : [{
            key: 'text',
            prompt: 'Precise the tournament code you would like to join',
            type: 'string'
        }]

    	});
    
	}

	async run(message, args){
		const {text} = args

		client.participants.index({
			id:text,
			callback: (err,data) => {
				console.log(err,data)
				if (data["0"]) {
					
					for(var i=0;i<Object.keys(data).length;i++){
						if(data[i + ""] && data[i + ""].participant.name == message.author.username){
							message.channel.sendMessage("Vous êtes déjà inscrit au tournoi demandé")
							return;
						}
					}
					//Tester le create avec un nom déjà existant?
					client.participants.create({
						id: text,
						participant: {
							name: message.author.username
						},
						callback: (err, data) => {
							console.log(err,data)
							if(data){
								message.channel.sendMessage("Votre inscription au tournoi" + text + " a bien été prise en compte")
							}
						}
					});


				} else {
					message.channel.sendMessage("Le code du tournoi a-t-il bien été saisi?")
				}

			}

		});

		
	}



}

module.exports=JoinTournamentCommand;