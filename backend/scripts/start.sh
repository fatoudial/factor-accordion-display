
#!/bin/bash
# Script de démarrage pour le backend Tchat Souvenir

echo "Démarrage du backend Tchat Souvenir..."

# Vérifier si Maven est installé
if ! command -v mvn &> /dev/null; then
    echo "Maven n'est pas installé. Veuillez installer Maven 3.6+ pour continuer."
    exit 1
fi

# Vérifier si Java est installé
if ! command -v java &> /dev/null; then
    echo "Java n'est pas installé. Veuillez installer Java 17+ pour continuer."
    exit 1
fi

# Démarrer l'application
echo "Démarrage avec la base de données H2..."
mvn spring-boot:run

echo "Backend démarré sur http://localhost:8080"
echo "Console H2 disponible sur http://localhost:8080/h2-console"
