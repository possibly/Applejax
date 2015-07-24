# This file is designed to create/reset the database to original, blank state.
# ===========================================================================
# To run this file
# 1. Run 
# 	mysql -u <user_name> -p < server/reset_db.mysql
#    where <user_name> is the name of the user who can create databases in your mysql installation
# 2. Enter your mysql password


CREATE DATABASE IF NOT EXISTS applejax_db;
USE applejax_db;
CREATE TABLE IF NOT EXISTS sessions(session_id INT auto_increment, board_length INT, board_width INT, PRIMARY KEY (session_id));
CREATE TABLE IF NOT EXISTS clients(client_id INT auto_increment, apples INT, coordinates_x INT, coordinates_y INT,
	session_id INT, primary key (client_id), foreign key (session_id) references sessions(session_id));
CREATE TABLE IF NOT EXISTS trees(tree_id INT auto_increment, coordinates_x INT, coordinate_y INT, session_id INT,
	primary key (tree_id),
	foreign key (session_id) references sessions(session_id));
CREATE TABLE IF NOT EXISTS cooldown_trees(tree_id INT, cooldown_end DATETIME,
	foreign key (tree_id) references trees(tree_id));
