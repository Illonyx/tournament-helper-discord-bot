const Commando = require('discord.js-commando');
const request = require('ajax-request');

class ShowEventCommand extends Commando.Command{

	constructor(client) {

	    super(client, {
	        name: 'show-event',
	        group: 'sangroyale',
	        memberName: 'show-event',
	        description: 'Permet de consulter tous les tournois prévus par Sang Royale (commande en cours de conception). ',
	        args : [{
	            key: 'eventId',
	            prompt: 'Precise the event id you would like to find details about',
	            type: 'string'
	        }]

	    
	    });
    
	}

	async run(message, {eventId}){
		
			var url = process.env.SR_DOMAIN_NAME + "/api/tournamentContext/" + eventId

			await request(url, function(err, res, body) {
				var synthesis = "Tous les évenements prévus dans Sang Royale :" + "\n"
				body=JSON.parse(body)
				var event=body[0]
				if(event != undefined){

					synthesis += "```"
					synthesis += "Nom : " + event.name + " / Id : " + event.id  + "\n"
					synthesis += "Date : "  + event.date + "\n"
					synthesis += "Type : " + event.kind + "\n"
					synthesis += "Capacité : " + event.capacity + "\n"
					synthesis += "Organisateur : " + event.organizer + "\n"
					synthesis += "Visibilité : " + event.privacy + "\n"
					if(event.description != "") synthesis += "Description : " + event.description + "\n"
					switch(event.kind){
						case "Gem Tournament":
							synthesis += "Nombre gemmes : " + event.properties.gemnumber + "\n"
							synthesis += "Mot de passe : " + event.properties.password + "\n"
						break;
						case "Bracket Tournament":
							//TODO
							break;
						default:
							break;
					}



					synthesis += "```"

					message.channel.sendMessage(synthesis)



				}
				

			}).catch(function(err){
				message.channel.sendMessage("Erreur inconnue : encore la faute à Skyice")
			});
	}


	


}

module.exports=ShowEventCommand;