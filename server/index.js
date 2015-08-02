// main file for NodeJS implementation
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var configs = require("./configs")
var sqlHandler = require("./sql_handler")
var timerHandler = require("./timerHandler")
var eventQue = require("./eventQue")

var rooms = []
var timers = []

function makeString(parameter) {
	return parameter+""
}


// The following parameters should be later put in a config file
// =============================================================
var board_length = configs.get("board_length")
var board_width = configs.get("board_width")
var player_limit = configs.get("player_limit")
var default_apples = configs.get("default_apples")
var tree_number = configs.get("tree_number")
var def_tree_apples = configs.get("def_tree_apples")
var def_turn_time = configs.get("def_turn_time")
var max_visibility = configs.get("max_visibility")
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
		var room_name = "session#"+user_info["session_id"]
		if (rooms.indexOf(room_name)==-1) {
			rooms.push(room_name)
			var temp_timer = timerHandler.getTimer(def_turn_time, 1000, 
				function(time) {
					io.to(room_name).emit('time left', Math.round(time.ms/1000))
				},
				function(timer) {
					var l = new eventQue()
					getObjectsAroundClient(user_info["client_id"], user_info["session_id"], function(json) {
						console.log(json)
						socket.emit('board update', json)
						timer.reset(10000)
						timer.start()
					})
				})
			temp_timer.start()
			timers.push(temp_timer)
			populateWithTrees(user_info["session_id"])
		}
		socket.join(room_name)
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

function getObjectsAroundClient(v_client_id, v_session_id, callback) {
	var returnJson = { clients: [], trees: [] }
	sqlHandler.getClientsAroundClient(v_client_id, v_session_id, max_visibility, function(array) {
		for (i=0; i<array.length; i++) {
			var temp_json = {}
			temp_json["client_id"] = array[i][0]
			temp_json["rel_x"] = array[i][1]
			temp_json["rel_y"] = array[i][2]
			returnJson["clients"].push(temp_json)
		}
		sqlHandler.getTreesAroundClient(v_client_id, v_session_id, max_visibility, function(array) {
			for (i=0; i<array.length; i++) {
				var temp_json = {}
				temp_json["tree_id"] = array[i][0]
				temp_json["rel_x"] = array[i][1]
				temp_json["rel_y"] = array[i][2]
				returnJson["trees"].push(temp_json)
			}
			callback(returnJson)
		})
	})
}

function populateWithTrees(v_session_id) {
	var existing_trees = []
	for (i=0; i<tree_number; i++) {
		var random_y = Math.floor((Math.random()*Math.pow(10, (1+Math.floor(Math.log10(board_length)))))%20)
		var random_x = Math.floor((Math.random()*Math.pow(10, (1+Math.floor(Math.log10(board_width)))))%20)
		if (existing_trees.indexOf([random_x, random_y]) == -1) {
			sqlHandler.addTree(v_session_id, random_x, random_y, def_tree_apples)
			existing_trees.push([random_x, random_y])
		} else {
			i--
			continue;
		}
	}
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
