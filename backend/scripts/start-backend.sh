
#!/bin/bash

# Script de démarrage du backend Tchat Souvenir

echo "🚀 Démarrage du backend Tchat Souvenir..."

# Vérifier si Java est installé
if ! command -v java &> /dev/null; then
    echo "❌ Java n'est pas installé. Veuillez installer Java 17 ou supérieur."
    exit 1
fi

# Vérifier si Maven est installé
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven n'est pas installé. Veuillez installer Maven."
    exit 1
fi

# Se déplacer dans le répertoire backend
cd "$(dirname "$0")/.."

# Nettoyer et compiler le projet
echo "🔧 Compilation du projet..."
mvn clean compile

# Démarrer l'application
echo "🌟 Démarrage de l'application Spring Boot..."
mvn spring-boot:run

echo "✅ Backend démarré avec succès!"
echo "📱 API disponible sur: http://localhost:8080"
echo "📚 Documentation Swagger: http://localhost:8080/swagger-ui.html"
