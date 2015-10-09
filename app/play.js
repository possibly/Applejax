//A place where game logic can go. This will probably be broken up into multiple files as we add stuff.

var faye = require('faye');
var bayeux = new faye.NodeAdapter({mount: '/play', timeout: 45});

//passing the http server over, dont worry about me.
module.exports = function(server){ 
	bayeux.attach(server);
	
	// faye will hook into the server and take over the /play route.
	// /play now acts as a channel where messages get sent to it.
	// All players know what every other player is doing.
	// We can change that if we dont like that totally modifiable.
	bayeux.getClient().subscribe('/play', function(event){ 
		play(event);
	});

	//This is actual game logic.
	function play(event){
		//The event comes in the form of JavaScript objects, not JSON.
		console.log(event);	
	}
}

