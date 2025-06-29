
#!/bin/bash
# Script de démarrage avec MySQL pour le backend Tchat Souvenir

echo "Démarrage du backend Tchat Souvenir avec MySQL..."

# Vérifier si MySQL est en cours d'exécution
if ! pgrep -x "mysqld" > /dev/null; then
    echo "MySQL ne semble pas être en cours d'exécution."
    echo "Veuillez démarrer MySQL et créer la base de données 'tchat_souvenir'."
    echo "CREATE DATABASE tchat_souvenir;"
    exit 1
fi

# Démarrer l'application avec le profil MySQL
echo "Démarrage avec MySQL..."
mvn spring-boot:run -Dspring-boot.run.profiles=mysql

echo "Backend démarré sur http://localhost:8080"
