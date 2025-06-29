
-- Script de création complète de la base de données MySQL pour Tchat Souvenir

CREATE DATABASE IF NOT EXISTS tchat_souvenir;
USE tchat_souvenir;

-- Créer un utilisateur dédié (optionnel)
-- CREATE USER 'tchat_user'@'localhost' IDENTIFIED BY 'tchat_password';
-- GRANT ALL PRIVILEGES ON tchat_souvenir.* TO 'tchat_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des articles du panier
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    book_format VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_reference VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING_PAYMENT',
    payment_method VARCHAR(100),
    payment_id VARCHAR(255),
    tracking_number VARCHAR(255),
    estimated_delivery_date TIMESTAMP NULL,
    book_format VARCHAR(100),
    book_id VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address TEXT,
    city VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Côte d''Ivoire',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    book_format VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    payment_method VARCHAR(100) NOT NULL,
    provider VARCHAR(100),
    phone_number VARCHAR(20),
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    external_reference VARCHAR(255),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Index pour optimiser les performances
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_reference ON orders(order_reference);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_user ON payments(user_id);

-- Données de test
INSERT IGNORE INTO users (email, name, password, role, created_at, is_active) VALUES
('admin@tchatsouvenir.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW(), true),
('user@example.com', 'John Doe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER', NOW(), true),
('mbodjfaticha99@gmail.com', 'Faticha Mbodj', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER', NOW(), true);

-- Commandes de test
INSERT IGNORE INTO orders (order_reference, user_id, total_amount, status, payment_method, book_format, created_at, updated_at, first_name, last_name, address, city, postal_code, country) VALUES
('ORD-2024-001', 2, 25000, 'DELIVERED', 'MOBILE_MONEY', 'PRINT_PREMIUM', NOW(), NOW(), 'John', 'Doe', '123 Main St', 'Abidjan', '00225', 'Côte d''Ivoire'),
('ORD-2024-002', 2, 15000, 'SHIPPED', 'CREDIT_CARD', 'PRINT_STANDARD', NOW(), NOW(), 'John', 'Doe', '123 Main St', 'Abidjan', '00225', 'Côte d''Ivoire'),
('ORD-2024-003', 3, 18000, 'PROCESSING', 'MOBILE_MONEY', 'DIGITAL', NOW(), NOW(), 'Faticha', 'Mbodj', '456 Avenue Test', 'Dakar', '10000', 'Sénégal');

-- Articles de commande
INSERT IGNORE INTO order_items (order_id, product_id, name, quantity, unit_price, book_format) VALUES
(1, 'book_1', 'Mon livre souvenir', 1, 25000, 'PRINT_PREMIUM'),
(2, 'book_2', 'Voyage en Afrique', 1, 15000, 'PRINT_STANDARD'),
(3, 'book_3', 'Conversations précieuses', 1, 18000, 'DIGITAL');

-- Paiements de test
INSERT IGNORE INTO payments (transaction_id, user_id, order_id, amount, payment_method, provider, phone_number, status, created_at, completed_at) VALUES
('TXN-2024-001', 2, 1, 25000, 'MOBILE_MONEY', 'Orange Money', '0712345678', 'SUCCESS', NOW(), NOW()),
('TXN-2024-002', 2, 2, 15000, 'CREDIT_CARD', NULL, NULL, 'SUCCESS', NOW(), NOW()),
('TXN-2024-003', 3, 3, 18000, 'MOBILE_MONEY', 'Wave', '0787654321', 'PENDING', NOW(), NULL);

-- Articles du panier de test
INSERT IGNORE INTO cart_items (user_id, product_id, product_name, quantity, unit_price, book_format, created_at) VALUES
(2, 'book_new_1', 'Nouveau livre souvenir', 1, 20000, 'PRINT_STANDARD', NOW()),
(3, 'book_new_2', 'Mes meilleures conversations', 2, 15000, 'DIGITAL', NOW());

COMMIT;
