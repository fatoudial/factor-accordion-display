
-- Script SQL complet pour créer toutes les tables nécessaires
-- Base de données: tchat_souvenir
-- SGBD: PostgreSQL

-- Création de la base de données (à exécuter en tant que superutilisateur)
-- CREATE DATABASE tchat_souvenir;
-- CREATE USER tchat_user WITH PASSWORD 'tchat_password';
-- GRANT ALL PRIVILEGES ON DATABASE tchat_souvenir TO tchat_user;

-- Se connecter à la base tchat_souvenir avant d'exécuter les commandes suivantes

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des imprimeurs/fournisseurs
CREATE TABLE IF NOT EXISTS printers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    standard_cost DECIMAL(10,2) DEFAULT 8000.00,
    medium_cost DECIMAL(10,2) DEFAULT 10000.00,
    premium_cost DECIMAL(10,2) DEFAULT 15000.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des livres
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    user_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'DRAFT',
    format VARCHAR(50) DEFAULT 'STANDARD',
    cover_image_url TEXT,
    design TEXT,
    content TEXT,
    fabrication_cost DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    assigned_printer_id BIGINT REFERENCES printers(id),
    download_path VARCHAR(500),
    is_downloaded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    processed_at TIMESTAMP
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_reference VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 2500.00,
    shipping_address TEXT,
    billing_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des éléments de commande
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    book_id BIGINT REFERENCES books(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    book_format VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table du panier
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    book_format VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    order_id BIGINT REFERENCES orders(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    payment_method VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    phone_number VARCHAR(20),
    status VARCHAR(50) DEFAULT 'PENDING',
    external_reference VARCHAR(255),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Table des commandes d'imprimeurs
CREATE TABLE IF NOT EXISTS printer_orders (
    id BIGSERIAL PRIMARY KEY,
    printer_id BIGINT NOT NULL REFERENCES printers(id),
    book_id BIGINT NOT NULL REFERENCES books(id),
    order_id BIGINT NOT NULL REFERENCES orders(id),
    cost DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Insertion de données de test
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@tchatsouvenir.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P4QKWUTbTjapqy', 'Admin', 'System', 'ADMIN'),
('mbodjfaticha99@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P4QKWUTbTjapqy', 'Faticha', 'Mbodj', 'USER'),
('user@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P4QKWUTbTjapqy', 'Test', 'User', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Insertion d'imprimeurs de test
INSERT INTO printers (name, email, phone, address, standard_cost, medium_cost, premium_cost) VALUES
('Imprimerie Dakar Print', 'contact@dakarprint.sn', '+221 33 123 45 67', 'Rue 10, Dakar, Sénégal', 8000.00, 10000.00, 15000.00),
('Sahel Éditions', 'info@sahel-editions.sn', '+221 33 234 56 78', 'Avenue Bourguiba, Dakar', 7500.00, 9500.00, 14000.00),
('Print Express', 'admin@printexpress.sn', '+221 33 345 67 89', 'Zone industrielle, Pikine', 8500.00, 11000.00, 16000.00)
ON CONFLICT DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_books_deleted_at ON books(deleted_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_printer_orders_printer_id ON printer_orders(printer_id);
CREATE INDEX IF NOT EXISTS idx_printer_orders_status ON printer_orders(status);
