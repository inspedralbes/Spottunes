-- El contenidor de mysql que es crea amb el docker compose up
-- cridarà aquest script i crea la BBDD persones i la taula noms
-- Ho fa pq. el docker de mysql executa tot el que troba a la carpeta
-- /docker-entrypoint-initdb.d/ quan es crea el contenidor	

-- Dades
-- Creacio de la BBDD persones amb la taula noms

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;
DROP DATABASE IF EXISTS `spottunes`;
CREATE DATABASE `spottunes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spottunes`;
