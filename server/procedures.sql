DELIMITER $$

USE applejax_db
DROP PROCEDURE IF EXISTS count_free_sessions$$
CREATE PROCEDURE count_free_sessions() 
BEGIN
	SELECT count(*) AS result
		FROM applejax_db.sessions 
		AS sessions
		WHERE (SELECT count(client_id) FROM applejax_db.clients AS client WHERE client.session_id = sessions.session_id) != sessions.player_limit; 
END$$

DROP PROCEDURE IF EXISTS get_free_session$$
CREATE PROCEDURE get_free_session()
BEGIN
	SELECT session_id
	FROM sessions AS session_table
	ORDER BY (
		SELECT count(client_id)
		FROM clients AS client_table
		WHERE client_table.session_id = session_table.session_id
	); 
END$$
	
DROP PROCEDURE IF EXISTS add_session$$
CREATE PROCEDURE add_session(v_length INT, v_width INT, v_limit INT)
BEGIN
	INSERT INTO sessions (board_length, board_width, player_limit)
	VALUES (v_length, v_width, v_limit);
END$$