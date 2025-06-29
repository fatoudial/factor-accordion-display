
# Tchat Souvenir Backend

## Description
Backend Spring Boot pour l'application Tchat Souvenir.

## Prérequis
- Java 17+
- Maven 3.6+
- MySQL 8.0+ (optionnel, H2 utilisée par défaut)

## Installation et démarrage

### 1. Cloner le projet
```bash
git clone <repository-url>
cd backend
```

### 2. Démarrer avec H2 (base de données en mémoire)
```bash
mvn spring-boot:run
```

### 3. Démarrer avec MySQL
1. Créer une base de données MySQL :
```sql
CREATE DATABASE tchat_souvenir;
```

2. Modifier les paramètres dans `application-mysql.properties`

3. Démarrer avec le profil MySQL :
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

## Endpoints API

### Commandes
- `GET /api/orders` - Liste toutes les commandes avec filtres optionnels
- `GET /api/orders/{id}` - Récupère une commande par ID
- `GET /api/orders/reference/{ref}` - Récupère une commande par référence
- `POST /api/orders` - Crée une nouvelle commande
- `PUT /api/orders/{id}` - Met à jour une commande
- `PATCH /api/orders/{id}/status` - Met à jour le statut d'une commande
- `DELETE /api/orders/{id}` - Supprime une commande
- `GET /api/orders/stats` - Statistiques des commandes

### Utilisateurs
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/{id}` - Récupère un utilisateur par ID
- `GET /api/users/email/{email}` - Récupère un utilisateur par email
- `POST /api/users` - Crée un nouvel utilisateur
- `PUT /api/users/{id}` - Met à jour un utilisateur
- `DELETE /api/users/{id}` - Supprime un utilisateur

## Console H2
Accessible à : http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:testdb
- Username: sa
- Password: password

## Configuration
- Port par défaut : 8080
- Base de données : H2 (développement) / MySQL (production)
- CORS activé pour http://localhost:5173
