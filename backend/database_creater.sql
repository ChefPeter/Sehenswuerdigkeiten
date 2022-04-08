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
    reset_time datetime,
    latitude DOUBLE,
    longtitude DOUBLE,
    share_position BOOLEAN
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

CREATE TABLE IF NOT EXISTS reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100),
    content VARCHAR(1000),
    resolved boolean,
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS usergroups (
    group_id INT NOT NULL,
    groupname VARCHAR(100),
    profile_picture VARCHAR(200),
    PRIMARY KEY (group_id)
);

CREATE TABLE IF NOT EXISTS users_usergroups (
    username VARCHAR(100),
    group_id INT,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (group_id) REFERENCES usergroups(group_id),
    PRIMARY KEY (username, group_id)
);

CREATE TABLE IF NOT EXISTS group_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender VARCHAR(100),
    group_id INT,
    message_timestamp datetime,
    content VARCHAR(10000),
    is_file BOOLEAN,
    FOREIGN KEY (sender) REFERENCES users(username),
    FOREIGN KEY (group_id) REFERENCES usergroups(group_id)
);

CREATE TABLE IF NOT EXISTS sights (
    sight_id VARCHAR(20) PRIMARY KEY,
    sightname VARCHAR(100),
    latitude DOUBLE,
    longtitude DOUBLE
);

CREATE TABLE IF NOT EXISTS ratings (
    username VARCHAR(100),
    sight_id VARCHAR(20),
    rating DOUBLE,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (sight_id) REFERENCES sights(sight_id),
    PRIMARY KEY (username, sight_id)
);

CREATE TABLE IF NOT EXISTS users_sights (
    username VARCHAR(100),
    sight_id VARCHAR(20),
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (sight_id) REFERENCES sights(sight_id),
    PRIMARY KEY (username, sight_id)
);

CREATE TABLE IF NOT EXISTS points (
    point_id VARCHAR(20) PRIMARY KEY,
    latitude DOUBLE,
    longtitude DOUBLE,
    name VARCHAR(300),
    wikidata VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS routes (
    username VARCHAR(100),
    route_name VARCHAR(300),
    point_id VARCHAR(20),
    FOREIGN KEY (point_id) REFERENCES points(point_id),
    FOREIGN KEY (username) REFERENCES users(username),
    PRIMARY KEY (username, route_name, point_id)
);