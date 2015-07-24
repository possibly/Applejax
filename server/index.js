// main file for NodeJS implementation
var express = require('express');
var mysql = require('mysql');
var app = express();
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Seraphima1',
	database: 'applejax_db'
});

app.get('/', function(req, res) {
	res.send("Hello World!");
});

app.get('/getInfoForNewClient', function(req, res) {
	connection.connect();
	connection.query("SELECT 1+1 AS solution", function(err, rows, fields) {
		//if (err) throw err;
		res.sendStatus(rows[0].solution);
	});
	connection.end();	
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Someone accessed the server at http://%s:%s", host, port);
});
