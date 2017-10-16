const Commando = require('discord.js-commando');
const request = require('ajax-request');

class ShowEventsCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'show-events',
        group: 'sangroyale',
        memberName: 'show-events',
        description: 'Permet de consulter tous les tournois prévus par Sang Royale (commande en cours de conception). '

    	});
    
	}

	async run(message, args){
		
			var url = process.env.SR_DOMAIN_NAME + "/api/tournamentContext"

			await request(url, function(err, res, body) {
				var synthesis = "Tous les évenements prévus dans Sang Royale :" + "\n"
				body=JSON.parse(body)
				body = body.map(function(event){
					var kind=""
					if(event.tournamentChallongeProperty != null){
						kind="Tournoi Challonge"
					} else {
						kind="Tournoi à gemmes"
					}
					return {"id" : event.id, "name" : event.name, "date" : event.date, "kind" : kind}
				})
				body.sort(function(a,b){
					var d1 = new Date(a.date)
					var d2 = new Date(b.date)
					return d1 - d2
				})
				for(var i=0; i< body.length; i++){
					//Si l'évenement est ancien, ne pas l'afficher
					console.log("ss?" + body[i].date)
					var dateEvent = new Date(new String(body[i].date))
					dateEvent.setHours(dateEvent.getHours() + 3)
					var sub = dateEvent - Date.now()
					if(sub >= 0)
					{
						synthesis += "```"
						synthesis += "Nom : " + body[i].name + " / Id : " + body[i].id  + "\n"
						synthesis += "Date : "  + body[i].date + "\n"
						synthesis += "Type : " + body[i].kind + "\n"
						synthesis += "```"
					}
				}

				message.channel.sendMessage(synthesis)

			}).catch(function(err){
				message.channel.sendMessage("Erreur inconnue : encore la faute à Skyice")
			});
	}


}

module.exports=ShowEventsCommand;