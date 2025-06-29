
#!/bin/bash

# Script de configuration de l'environnement de développement

echo "🛠️ Configuration de l'environnement de développement Tchat Souvenir..."

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️ PostgreSQL n'est pas installé. Veuillez installer PostgreSQL."
    echo "Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "MacOS: brew install postgresql"
    echo "Windows: Télécharger depuis https://www.postgresql.org/download/"
else
    echo "✅ PostgreSQL détecté"
    
    # Configurer la base de données
    echo "📊 Configuration de la base de données PostgreSQL..."
    
    # Créer l'utilisateur et la base de données si nécessaire
    sudo -u postgres psql -c "CREATE USER tchat_user WITH PASSWORD 'tchat_password';" 2>/dev/null || echo "Utilisateur existe déjà"
    sudo -u postgres psql -c "CREATE DATABASE tchat_souvenir OWNER tchat_user;" 2>/dev/null || echo "Base de données existe déjà"
    
    # Exécuter le script de configuration
    echo "🔧 Exécution du script de configuration..."
    sudo -u postgres psql -d tchat_souvenir -f scripts/setup-postgresql.sql
    echo "✅ Base de données configurée"
fi

# Vérifier Java
if ! command -v java &> /dev/null; then
    echo "⚠️ Java n'est pas installé. Veuillez installer Java 17 ou supérieur."
else
    echo "✅ Java détecté: $(java -version 2>&1 | head -n 1)"
fi

# Vérifier Maven
if ! command -v mvn &> /dev/null; then
    echo "⚠️ Maven n'est pas installé. Veuillez installer Maven."
else
    echo "✅ Maven détecté: $(mvn -version | head -n 1)"
fi

# Copier le fichier de configuration
if [ ! -f "src/main/resources/application-local.properties" ]; then
    echo "📝 Création du fichier de configuration local..."
    cat > src/main/resources/application-local.properties << EOF
# Configuration locale de développement
spring.profiles.active=postgres
spring.datasource.url=jdbc:postgresql://localhost:5432/tchat_souvenir
spring.datasource.username=tchat_user
spring.datasource.password=tchat_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080

# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# Email Configuration (remplacer par vos vraies informations)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Orange Money Configuration (remplacer par vos vraies clés)
orange-money.client-id=your-client-id
orange-money.client-secret=your-client-secret
orange-money.api-url=https://api.orange.com/orange-money-webpay/v1
EOF
    echo "✅ Fichier de configuration créé"
fi

# Installation des dépendances
echo "📦 Installation des dépendances Maven..."
mvn clean install -DskipTests

echo "🎉 Environnement de développement configuré avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurer les variables d'environnement dans application-local.properties"
echo "2. Démarrer le backend: ./scripts/start-backend.sh"
echo "3. Démarrer le frontend: cd ../frontend && npm run dev"
echo ""
echo "🔗 URLs importantes:"
echo "  - API Backend: http://localhost:8080/api"
echo "  - Frontend: http://localhost:5173"
echo "  - Swagger UI: http://localhost:8080/swagger-ui.html"
echo ""
echo "👤 Comptes de test:"
echo "  - Utilisateur: mbodjfaticha99@gmail.com / passer"
echo "  - Admin: admin@tchatsouvenir.com / passer"
