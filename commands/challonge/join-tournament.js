const Commando = require('discord.js-commando');
const challonge = require('challonge')
const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_USER_TOKEN
});

class JoinTournamentCommand extends Commando.Command {

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
				//console.log(err,data)
				if (err == null) {
					
					if(data["0"]){
						//Checker s'il y a des inscrits
						for(var i=0;i<Object.keys(data).length;i++){
							if(data[i + ""] && data[i + ""].participant.name == authorName){
								message.reply("Vous êtes déjà inscrit au tournoi demandé")
								return;
							}
						}
					}	

					//Tester le create avec un nom déjà existant?
					client.participants.create({
						id: text,
						participant: {
							name: encodeURI("" + authorName)
						},
						callback: (err, data) => {
							console.log(err,data)
							if(err) {
								message.reply("Erreur lors de l'inscription : le tournoi a déjà commencé")
							} else {
								if(data.participant.onWaitingList){
									message.reply("Le tournoi est complet : vous avez été placé sur liste d'attente")
								} else {
									message.reply("Votre inscription au tournoi" + text + " a bien été prise en compte")
								}
							}
						}
					});


				} else {
					message.reply("Le code du tournoi a-t-il bien été saisi?")
				}

			}

		});

		
	}



}

module.exports=JoinTournamentCommand;