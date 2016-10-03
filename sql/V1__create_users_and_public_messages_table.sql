CREATE DATABASE IF NOT EXISTS esn_db;
USE esn_db;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	user_name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	`online` TINYINT DEFAULT 0
);

CREATE INDEX user_id_index ON users (id);
CREATE INDEX user_name_index ON users (user_name);

CREATE TABLE IF NOT EXISTS public_messages (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	sender_id INT UNSIGNED NOT NULL,
	message TEXT NOT NULL,
	message_status VARCHAR(255) NULL,
	latitude FLOAT NULL,
	longitude FLOAT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL,
	FOREIGN KEY fk_sender(sender_id) REFERENCES users(id)
);

CREATE INDEX sender_id_index ON public_messages(sender_id);
CREATE INDEX public_message_sender_id_index ON public_messages (sender_id);
CREATE FULLTEXT INDEX public_message_message_index ON public_messages (message);

-- Add index for online column in user table

CREATE INDEX user_online_status ON users (`online`);
ALTER TABLE public_messages MODIFY message_status TINYINT DEFAULT 0;
ALTER TABLE users ADD status TINYINT DEFAULT 0 AFTER `online` ;



