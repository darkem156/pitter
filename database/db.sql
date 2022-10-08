-- Deleting Database If Exists
DROP DATABASE IF EXISTS pitter;

-- Upgrading Privileges
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

-- Creating database
CREATE DATABASE pitter;

-- Using database
USE pitter;

-- Creating sessions If Not Exists
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Create following
CREATE TABLE `following` 
(
  `id_follower` bigint unsigned NOT NULL,
  `id_following` bigint unsigned NOT NULL
);

-- Create private
CREATE TABLE `private` 
(
  `id` bigint unsigned NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Create publicaciones
CREATE TABLE `publicaciones` 
(
  `id_pub` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contenido` varchar(300) NOT NULL,
  `id_usuario` bigint unsigned NOT NULL,
  `date` timestamp NOT NULL,
  PRIMARY KEY (`id_pub`)
);

-- Create users
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
);
