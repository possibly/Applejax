var http = require('http'); //talks http.
var ecstatic = require('ecstatic')(__dirname + '/static'); //serves static files.
var router = require('routes')(); //handles routing of incoming requests to controllers.

//Registering some routes with our app.
//See inside each file for more info.
var post = require('./routes/helpers.js').post
router.addRoute('/', require('./routes/tilde.js'));
router.addRoute('/register/:username/:password', post(require('./routes/register.js')));

//Create the server.
var server = http.createServer(function (req,res) {
	var route = router.match(req.url);
	if (route) route.fn(req,res,route.params);
	else ecstatic(req,res); //Default to some generic page instead of just failing.
});

//Inside play.js is where the game logic sits.
require('./play.js')(server);

//Listen on a port.
server.listen(8000, function(){
	console.log('likes to listen-a-lot');
});
