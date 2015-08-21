var http = require('http'); //talks http.
var ecstatic = require('ecstatic')(__dirname + '/static'); //serves static files.
var router = require('routes')(); //handles routing of incoming requests to controllers.

//Registering some routes with our app.
router.addRoute('/', require('./routes/tilde.js'));

//Create the server.
var server = http.createServer(function (req,res) {
	var route = router.match(req.url);
	if (route) route.fn(req,res,route.params);
	else ecstatic(req,res); //serve a 'File not found :(' instead of just hanging up.
});

//Listen on a port.
server.listen(8000, function(){
	console.log('likes to listen-a-lot');
});
