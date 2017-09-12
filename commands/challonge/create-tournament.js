const Commando = require('discord.js-commando');

class CreateTournamentCommand extends Commando.Command{

	constructor(client) {

    super(client, {
        name: 'roll',
        group: 'challonge',
        memberName: 'roll',
        description: 'Loterie'

    	});
    
	}

	async run(message, args){
		var roll = Math.floor(Math.random() * 6) + 1;
		message.reply("Vous tombé sur un" + roll);
	}


}

module.exports=CreateTournamentCommand;