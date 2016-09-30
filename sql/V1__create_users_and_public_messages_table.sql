CREATE DATABASE IF NOT EXISTS esn_db;
USE esn_db;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	user_name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	online TINYINT DEFAULT 0
);

CREATE INDEX user_id_index ON users (id);
CREATE INDEX user_name_index ON users (user_name);

CREATE TABLE IF NOT EXISTS public_messages (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	sender_id INT NOT NULL,
	message TEXT NOT NULL,
	message_status VARCHAR(255) NULL,
	latitude FLOAT NULL,
	longitude FLOAT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL
);

CREATE INDEX public_message_sender_id_index ON public_messages (sender_id);
CREATE FULLTEXT INDEX public_message_message_index ON public_messages (message);

