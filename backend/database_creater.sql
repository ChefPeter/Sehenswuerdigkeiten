/*
    Linux commands

	sudo apt update
	sudo apt install mysql-server
    sudo mysql_secure_installation
*/

/*
    Erstellt die Datenbank
*/
CREATE DATABASE city_to_go;
use city_to_go;

/*
    Erstellt die einzelnen Tabellen
*/
CREATE TABLE IF NOT EXISTS users (
	username VARCHAR(100) PRIMARY KEY,
    email VARCHAR(100),
    password VARCHAR(500),
    date_created date,
	last_time_active datetime,
    user_desc VARCHAR(2000),
    profile_picture VARCHAR(200),
    approved boolean,
    approved_token VARCHAR(1000),
    reset_token VARCHAR(1000),
    reset_time datetime
);

CREATE TABLE IF NOT EXISTS friends (
	user1 VARCHAR(100),
	user2 VARCHAR(100),
    approved boolean,
    FOREIGN KEY (user1) REFERENCES users(username),
    FOREIGN KEY (user2) REFERENCES users(username),
    PRIMARY KEY (user1, user2)
);

CREATE TABLE IF NOT EXISTS messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender VARCHAR(100),
    recipient VARCHAR(100),
    message_timestamp datetime,
    content VARCHAR(10000),
    is_file boolean,
    FOREIGN KEY (sender) REFERENCES users(username),
    FOREIGN KEY (recipient) REFERENCES users(username)
);