//Handles registering new players.

module.exports = function(req, res, params){
	//For debugging. Check out the console where you started the node server!
	//keys of params are determined by the variables set during route creation, values are set in the route's view
	console.log(params);
	//Check that the user's credentials are valid. Also, scrub the input so there's no Bobby Droptables.
	if (addUserToDatabase(params.username, params.password)){
		res.end('Success!');
	}else{
		res.end('Failure :(');
	}
}

function addUserToDatabase(username, password){
	//No Bobby Drop Tables (scrubbing/sanitizing)
	//Does the user already exist?
	//Add the user
	return true;
}
