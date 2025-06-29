
-- Script de configuration PostgreSQL pour Tchat Souvenir

-- Créer la base de données
CREATE DATABASE tchat_souvenir;

-- Se connecter à la base de données
\c tchat_souvenir;

-- Créer les tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_reference VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    book_format VARCHAR(50),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'XOF',
    payment_method VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    phone_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'PENDING',
    external_reference VARCHAR(100),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Créer les index pour améliorer les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Insérer des données de test
INSERT INTO users (email, name, password, role, is_active) VALUES
('mbodjfaticha99@gmail.com', 'Faticha Mbodj', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', TRUE),
('admin@tchatsouvenir.com', 'Admin System', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', TRUE),
('user@example.com', 'Test User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', TRUE);

-- Insérer des commandes de test
INSERT INTO orders (user_id, order_reference, status, total_amount) VALUES
(1, 'ORD-2024-001', 'PENDING', 15000.00),
(1, 'ORD-2024-002', 'COMPLETED', 25000.00),
(3, 'ORD-2024-003', 'PROCESSING', 5000.00);

-- Insérer des articles de panier de test
INSERT INTO cart_items (user_id, product_id, product_name, quantity, unit_price, book_format) VALUES
(1, 'book-001', 'Mon livre de souvenirs Instagram', 1, 15000.00, 'PRINT_STANDARD'),
(1, 'book-002', 'Livre de conversations WhatsApp', 2, 12000.00, 'PRINT_PREMIUM'),
(3, 'book-003', 'Livre de photos Facebook', 1, 18000.00, 'EBOOK');

-- Insérer des paiements de test
INSERT INTO payments (transaction_id, user_id, order_id, amount, payment_method, provider, phone_number, status) VALUES
('TXN-2024-001', 1, 1, 15000.00, 'mobile_money', 'orange_money', '773456789', 'PENDING'),
('TXN-2024-002', 1, 2, 25000.00, 'mobile_money', 'orange_money', '773456789', 'SUCCESS'),
('TXN-2024-003', 3, 3, 5000.00, 'card', NULL, NULL, 'SUCCESS');

-- Créer les triggers pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Accorder les permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Afficher les informations de connexion
SELECT 'Base de données configurée avec succès!' as message;
SELECT 'Utilisateur test: mbodjfaticha99@gmail.com / passer' as info;
SELECT 'Utilisateur admin: admin@tchatsouvenir.com / passer' as info;
