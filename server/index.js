// main file for NodeJS implementation
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var configs = require("./configs")
var sqlHandler = require("./sql_handler")

function makeString(parameter) {
	return parameter+""
}


// The following parameters should be later put in a config file
// =============================================================
var board_length = configs.get("board_length")
var board_width = configs.get("board_width")
var player_limit = configs.get("player_limit")
var default_apples = configs.get("default_apples")
var default_x = Math.floor(board_width/2);
var default_y = Math.floor(board_length/2);
// =============================================================

app.get('/', function(req, res) {
	res.sendFile(__dirname+"/static_pages/index.html")
});

io.on('connect', function(socket) {
	var user_info = []
	sqlHandler.reportBackInfo(function(reported_shit) {
		user_info = reported_shit // FUCK YEAH!
		sendBackInfo(socket, user_info, ["session_id", "client_id"], 'user_info')
		socket.join("session#"+user_info["session_id"])
	})

	socket.on('disconnect', function() {
		sqlHandler.removeClient(user_info["client_id"])
	});
});

function sendBackInfo(socket, hash, keys, event_name) {
	var result = {}
	for (i=0; i<keys.length; i++) {
		var key = keys[i]
		result[key] = hash[key]
	}
	socket.emit(event_name, JSON.stringify(result))
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
