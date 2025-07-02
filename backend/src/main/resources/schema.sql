CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP,
    is_active BOOLEAN
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_reference VARCHAR(100),
    user_id BIGINT,
    total_amount BIGINT,
    status VARCHAR(50),
    payment_method VARCHAR(50),
    book_format VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    product_id VARCHAR(100),
    name VARCHAR(255),
    quantity INT,
    unit_price BIGINT,
    book_format VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
