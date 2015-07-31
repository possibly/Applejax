// main file for NodeJS implementation
var express = require('express');
var app = express();
var mysql = require('mysql');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'sample_user',
	password: 'sample_password',
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
var default_x = Math.floor(board_width/2);
var default_y = Math.floor(board_length/2);
var default_apples = 5;
// =============================================================

app.get('/', function(req, res) {
	res.sendFile(__dirname+"/static_pages/index.html")
});

io.on('connect', function(socket) {
	var user_info = []
	connection.query("CALL count_free_sessions();", function(err, rows, fields) {
		if (err) throw err;
		function returnInfo() {
			connection.query("CALL get_free_session();", function(err, row, fields) {
				if (err) throw err;
				user_info["session_id"] = row[0][0].session_id;
				//console.log(session_id);
				function giveClientId() {
					connection.query("CALL add_client_to_session(?,?,?,?);",
						[user_info["session_id"],default_x,default_y,default_apples],
						function(err, rows, fields) {
							if (err) throw err;
							user_info["client_id"] = rows[0][0].client_id;
							sendBackInfo(socket, user_info, ["session_id", "client_id"], 'user_info')
						});
				}
				
				giveClientId();
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
	
	socket.on('disconnect', function() {
		connection.query("CALL remove_client(?)", [user_info["session_id"]], 
			function(err) {
				if (err) throw err;
			})
	});
});

function sendBackInfo(socket, hash, keys, event_name) {
	var result = {}
	for (i=0; i<keys.length; i++) {
		//console.log(keys[i]+" "+hash[keys[i]])
		var key = keys[i]
		result[key] = hash[key]
	}
	socket.emit(event_name, JSON.stringify(result))
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
