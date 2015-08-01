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
	}
}

var makeQuery = function(name, params, callback) {
	connection.query(name, params, callback);
}