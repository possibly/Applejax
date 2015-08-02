var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'sample_user',
	password: 'sample_password',
	database: 'applejax_db'
});

module.exports = {
	reportBackInfo: function(callback) {
		
		makeQuery("CALL count_free_sessions();", function(err, rows, fields) {
			var user_info = []
			function returnInfo() {
				makeQuery("CALL get_free_session();", function(err, row, fields) {
					if (err) throw err;
					user_info["session_id"] = row[0][0].session_id;
					function giveClientId() {
						makeQuery("CALL add_client_to_session(?,?,?,?);",
							[user_info["session_id"],10,10,5],
							function(err, rows, fields) {
								if (err) throw err;
								user_info["client_id"] = rows[0][0].client_id;
								callback(user_info)
							});
					}
				
					giveClientId();
				});
			}
			if (rows[0][0].result==0) {
				makeQuery("CALL add_session(?,?,?)", [20, 20, 5],
				function(err, rows, fields) {
					if (err) throw err;
					returnInfo();
				} );
			
			} else {
				returnInfo();
			}
		});
	},
	
	removeClient: function(client_id) {
		makeQuery("CALL remove_client(?);", [client_id], function(err) {
			if (err) throw err;
		});
	},
	
	addTree: function(v_session_id, v_x, v_y, v_apples) {
		makeQuery("CALL add_tree(?, ?, ?, ?)", [v_session_id, v_x, v_y, v_apples], function(err) {
			if (err) throw err;
		});
	},
	
	getClientsAroundClient: function(v_client_id, v_session_id, range, callback) {
		makeQuery("CALL get_client_coordinates(?);", [v_client_id], function(err, rows, fields) {
			if (err) throw err;
			var coordinates_x = rows[0][0].coordinates_x
			var coordinates_y = rows[0][0].coordinates_y
			makeQuery("CALL get_clients_in_range(?, ?, ?, ?, ?);", [v_session_id, v_client_id, coordinates_x, coordinates_y, range], function(err, rows, fields){
				if (err) throw err;
				var return_array = []
				for (i=0; i<rows[0].length; i++) {
					var row = rows[0][i]
					return_array.push([row.client_id, row.relational_x, row.relational_y])
				}
				callback(return_array)
			})
		})
	},
	
	getTreesAroundClient: function(v_client_id, v_session_id, range, callback) {
		makeQuery("CALL get_client_coordinates(?);", [v_client_id], function(err, rows, fields) {
			if (err) throw err;
			var coordinates_x = rows[0][0].coordinates_x
			var coordinates_y = rows[0][0].coordinates_y
			makeQuery("CALL get_trees_in_range(?, ?, ?, ?);", [v_session_id, coordinates_x, coordinates_y, range], function(err, rows, fields) {
				if (err) throw err;
				var return_array = []
				for (i=0; i<rows[0].length; i++) {
					var row = rows[0][i]
					return_array.push([row.tree_id, row.relational_x, row.relational_y])
				}
				callback(return_array)
			})
		})
	}
}

var makeQuery = function(name, params, callback) {
	connection.query(name, params, callback);
}