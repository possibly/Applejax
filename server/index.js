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

function makeString(parameter) {
	return parameter+""
}

// The following parameters should be later put in a config file
// =============================================================
var board_length = 20;
var board_width = 20;
var player_limit = 5;
// =============================================================

app.get('/', function(req, res) {
	res.send("Hello World!");
});

app.get('/getInfoForNewClient', function(req, res) {
	connection.connect();
	connection.query("CALL count_free_sessions();", function(err, rows, fields) {
		if (err) throw err;
		function returnInfo() {
			connection.query("CALL get_free_session();", function(err, row, fields) {
				if (err) throw err;
				res.sendStatus(makeString(row[0][0].session_id));
				connection.end();
			});
		}
		if (rows[0][0].result==0) {
			connection.query("CALL add_session(?,?,?)", [board_length, board_width, player_limit],
			function(err, rows, fields) {
				if (err) throw err;
				returnInfo();
			} );
			
		} else {
			returnInfo();
		}
	});
	
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Someone accessed the server at http://%s:%s", host, port);
});
