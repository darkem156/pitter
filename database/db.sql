-- Creating database
CREATE DATABASE pitter;

-- Using database
USE pitter;

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