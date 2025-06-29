
-- Script de création de la base de données MySQL pour Tchat Souvenir

CREATE DATABASE IF NOT EXISTS tchat_souvenir;
USE tchat_souvenir;

-- Créer un utilisateur dédié (optionnel)
-- CREATE USER 'tchat_user'@'localhost' IDENTIFIED BY 'tchat_password';
-- GRANT ALL PRIVILEGES ON tchat_souvenir.* TO 'tchat_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Les tables seront créées automatiquement par Hibernate lors du premier démarrage
