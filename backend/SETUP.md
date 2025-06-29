
# Configuration du Backend Tchat Souvenir

## Prérequis

1. **Java 17 ou supérieur**
   ```bash
   java -version
   ```

2. **Maven 3.6 ou supérieur**
   ```bash
   mvn -version
   ```

3. **MySQL 8.0 ou supérieur**
   ```bash
   mysql --version
   ```

## Installation et Configuration

### 1. Base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script de création
source scripts/setup-database-complete.sql
```

### 2. Configuration de l'application

Créer le fichier `src/main/resources/application-local.properties` :

```properties
# Configuration locale
spring.profiles.active=local
spring.datasource.url=jdbc:mysql://localhost:3306/tchat_souvenir?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE_MYSQL
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080

# Configuration CORS
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### 3. Démarrage automatique

```bash
# Rendre le script exécutable
chmod +x scripts/setup-dev-environment.sh
chmod +x scripts/start-backend.sh

# Configuration de l'environnement
./scripts/setup-dev-environment.sh

# Démarrage du backend
./scripts/start-backend.sh
```

### 4. Démarrage manuel

```bash
# Compilation
mvn clean compile

# Démarrage
mvn spring-boot:run
```

## API Endpoints

### Panier
- `GET /api/cart` - Récupérer les articles du panier
- `POST /api/cart/add` - Ajouter un article
- `PUT /api/cart/{id}` - Modifier la quantité
- `DELETE /api/cart/{id}` - Supprimer un article
- `DELETE /api/cart/clear` - Vider le panier
- `GET /api/cart/summary` - Résumé du panier

### Paiements
- `POST /api/payments/initiate` - Initier un paiement
- `GET /api/payments/status/{transactionId}` - Vérifier le statut
- `GET /api/payments/history` - Historique des paiements
- `POST /api/payments/callback` - Callback des opérateurs

### Commandes
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/{id}` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PATCH /api/orders/{id}/status` - Modifier le statut

## Tests

```bash
# Tester la connectivité
curl http://localhost:8080/api/orders/stats

# Tester le panier (nécessite un token)
curl -H "Authorization: Bearer demo-token" http://localhost:8080/api/cart

# Tester un paiement
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"orderId":1,"amount":25000,"method":"mobile_money","provider":"orange","phoneNumber":"0712345678"}' \
  http://localhost:8080/api/payments/initiate
```

## Intégration Frontend

Le frontend utilise automatiquement le backend si disponible, sinon il utilise les données de simulation.

Configurer l'URL dans le fichier `.env` du frontend :
```
VITE_API_URL=http://localhost:8080/api
```

## Production

Pour la production, modifier `application.properties` :
```properties
spring.profiles.active=prod
spring.datasource.url=jdbc:mysql://VOTRE_SERVEUR:3306/tchat_souvenir
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```
