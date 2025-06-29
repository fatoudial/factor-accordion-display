
-- Données de test pour le développement
INSERT INTO users (email, name, password, role, created_at, is_active) VALUES
('admin@tchatsouvenir.com', 'Admin User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW(), true),
('user@example.com', 'John Doe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER', NOW(), true);

-- Commandes de test
INSERT INTO orders (order_reference, user_id, total_amount, status, payment_method, book_format, created_at, updated_at, first_name, last_name, address, city, postal_code, country) VALUES
('ORD-2024-001', 2, 25000, 'DELIVERED', 'MOBILE_MONEY', 'PRINT_PREMIUM', NOW(), NOW(), 'John', 'Doe', '123 Main St', 'Abidjan', '00225', 'Côte d''Ivoire'),
('ORD-2024-002', 2, 15000, 'SHIPPED', 'CREDIT_CARD', 'PRINT_STANDARD', NOW(), NOW(), 'John', 'Doe', '123 Main St', 'Abidjan', '00225', 'Côte d''Ivoire');

-- Articles de commande
INSERT INTO order_items (order_id, product_id, name, quantity, unit_price, book_format) VALUES
(1, 'book_1', 'Mon livre souvenir', 1, 25000, 'PRINT_PREMIUM'),
(2, 'book_2', 'Voyage en Afrique', 1, 15000, 'PRINT_STANDARD');
