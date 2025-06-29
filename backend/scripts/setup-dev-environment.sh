
#!/bin/bash

# Script de configuration de l'environnement de développement

echo "🛠️ Configuration de l'environnement de développement Tchat Souvenir..."

# Vérifier MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️ MySQL n'est pas installé. Veuillez installer MySQL."
else
    echo "✅ MySQL détecté"
    
    # Créer la base de données
    echo "📊 Configuration de la base de données..."
    mysql -u root -p < scripts/setup-database-complete.sql
    echo "✅ Base de données configurée"
fi

# Copier le fichier de configuration
if [ ! -f "src/main/resources/application-local.properties" ]; then
    echo "📝 Création du fichier de configuration local..."
    cat > src/main/resources/application-local.properties << EOF
# Configuration locale de développement
spring.profiles.active=local
spring.datasource.url=jdbc:mysql://localhost:3306/tchat_souvenir?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
EOF
    echo "✅ Fichier de configuration créé"
fi

# Installation des dépendances
echo "📦 Installation des dépendances Maven..."
mvn dependency:resolve

echo "🎉 Environnement de développement configuré avec succès!"
echo ""
echo "Pour démarrer le backend:"
echo "  ./scripts/start-backend.sh"
echo ""
echo "Pour tester l'API:"
echo "  curl http://localhost:8080/api/orders"
