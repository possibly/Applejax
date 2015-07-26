DELIMITER $$

USE applejax_db
DROP PROCEDURE IF EXISTS count_free_sessions$$
CREATE PROCEDURE count_free_sessions() 
BEGIN
	SELECT count(*) AS result
		FROM applejax_db.sessions 
		AS sessions
		WHERE (SELECT count(client_id) FROM applejax_db.clients AS client WHERE client.session_id = sessions.session_id) < sessions.player_limit; 
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

DROP FUNCTION IF EXISTS does_client_exist$$
CREATE FUNCTION does_client_exist(v_session_id INT, v_coords_x INT, v_coords_y INT)
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE return_value INT;
	DECLARE client_count INT;
	SET return_value = 0;
	SET client_count = (
		SELECT count(client_id)
		FROM clients
		WHERE (session_id = v_session_id)
		AND (coordinates_x = v_coords_x)
		AND (coordinates_y = v_coords_y)
	);
	IF (client_count > 0) THEN 
		SET return_value = 1;
	END IF;
	RETURN return_value;
END$$

DROP PROCEDURE IF EXISTS add_client_to_session$$
CREATE PROCEDURE add_client_to_session(v_session_id INT, v_coords_x INT, v_coords_y INT, v_default_apples INT)
BEGIN
	DECLARE v_temp_coords_x INT;
	DECLARE v_temp_coords_y INT;
	DECLARE v_max_x INT;
	DECLARE v_max_y INT;
	
	SET v_max_x = (
		SELECT board_width
		FROM sessions
		WHERE session_id = v_session_id
	);
	SET v_max_y = (
		SELECT board_length
		FROM sessions
		WHERE session_id = v_session_id
	);
	SET v_temp_coords_x = v_coords_x;
	SET v_temp_coords_y = v_coords_y;
	WHILE does_client_exist(v_session_id, v_temp_coords_x, v_temp_coords_y) > 0 DO 
		IF (v_temp_coords_x = (v_max_x-1)) THEN
			SET v_temp_coords_x = 0;
		ELSE 
			SET v_temp_coords_x = v_temp_coords_x+1;
		END IF; 
		
		IF (v_temp_coords_y = (v_max_y-1)) THEN
			SET v_temp_coords_y = 0;
		ELSE 
			SET v_temp_coords_y = v_temp_coords_y+1;
		END IF; 
	END WHILE;	
	INSERT INTO clients (apples, coordinates_x, coordinates_y, session_id) 
	VALUES (v_default_apples, v_temp_coords_x, v_temp_coords_y, v_session_id);
	SELECT client_id
	FROM clients
	WHERE (session_id = v_session_id)
	AND (coordinates_x = v_temp_coords_x)
	AND (coordinates_y = v_temp_coords_y);
END$$