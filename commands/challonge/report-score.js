const Commando = require('discord.js-commando');

class CreateTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'report-score',
        group: 'challonge',
        memberName: 'report-score',
        description: 'Permettra de reporter le score de votre match contre votre adversaire (en cours de developpement)'
    	});
    
	}

	async run(message, args){
		message.reply("En cours de developpement, sortira samedi dans la nuit :-D")
	}


}

module.exports=CreateTournamentCommand;