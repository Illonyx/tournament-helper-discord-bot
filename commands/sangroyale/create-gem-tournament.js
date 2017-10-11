const Commando = require('discord.js-commando');
const request = require('ajax-request');

class CreateGemTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'create-gem-tournament',
        group: 'sangroyale',
        memberName: 'create-gem-tournament',
        description: 'Commande réservée aux adjoints. Permet de créer un évenement de tournoi à gemmes', 
        userPermissions: ['MANAGE_ROLES'], 
        examples : ['tr-create-gem-tournament "Sang Royale tr" sr123 "2017-09-17 19:30:00" Largosien 500', 
        	'tr-create-gem-tournament "Sang Royale tr" sr123 "2017-10-17 19:00:00" Skyice 2000 "si tournoi public, Regles optionnelles à respecter, description du tournoi..."'],
        args : [{
            key: 'name',
            prompt: 'Precise the tournament name into quotes',
            type: 'string'
        }, {
            key: 'password',
            prompt: 'Precise the password of the tournament',
            type: 'string'
        }, {
        	key : 'date',
        	prompt : 'Precise when tournament (date and hour) are to be launched', 
        	type : 'string'
        }, {
        	key : 'organizer',
        	prompt : 'Precise the tournament organizer', 
        	type : 'string'
        }, {
        	key : 'gemnumber', 
        	prompt : 'Precise the tournament gem number', 
        	type : 'integer'
        }, {
        	key : 'description',
        	prompt : 'Precise extra info about tournament if needed : privacy, special rules, rewards...',
        	type : 'string',
        	default : ''
        }]

    	});
    
	}

	async run(message, {name, password, date, organizer, gemnumber, description}){
		
			var url = process.env.SR_DOMAIN_NAME + "/api/tournamentContext"
			//Receive args and prepare tournament message
			var now = new Date()
			var id = "TR" + now.getDate() + now.getMonth() + now.getFullYear() + now.getHours() + now.getMinutes() + now.getSeconds();
			var capacity = this.returnCapacityWithNumberGems(gemnumber);



			//Champs à envoyer : name entre guillemets, date, privacy, reglement, organizer, password, gemnumber

			await request(
			{
				url : url,
				method : 'POST',
				data : {

				    id : id,
				    name : name,
				    description : description,
				    date : date,
				    reglement : "Pas de règles spéciales",
				    privacy : "private",
				    organizer : organizer,
				    capacity : capacity,
				    tournamentGemProperty: {
				        gemnumber: gemnumber,
				        password: password
				    }

				}

			}, function(err, res, body) {
				message.channel.sendMessage("Tournoi correctement crée")
			}).catch(function(err){
				message.channel.sendMessage("Erreur inconnue : encore la faute à Skyice")
			});
	}

	returnCapacityWithNumberGems(numbergems){
		switch(numbergems){

			case 100:
				return 50

			case 500: 
				return 100

			case 2000:
				return 200

			case 10000:
				return 1000

		}
	}




}

module.exports=CreateGemTournamentCommand;