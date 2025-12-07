-- Create database
CREATE DATABASE IF NOT EXISTS grocery_delivery_db;
USE grocery_delivery_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    banner_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    eta_min INT DEFAULT 30,
    eta_max INT DEFAULT 45,
    min_order DECIMAL(10,2) DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    store_id INT,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_store (name, store_id)
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    store_id INT NOT NULL,
    unit VARCHAR(50),
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    is_popular BOOLEAN DEFAULT FALSE,
    is_essential BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_store (store_id),
    INDEX idx_popular (is_popular),
    INDEX idx_price (price)
);

-- Carts table (for active carts)
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    session_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id),
    INDEX idx_user (user_id),
    INDEX idx_session (session_token)
);

-- Cart items table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_add DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id),
    INDEX idx_cart (cart_id)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_store (store_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order (order_id)
);

-- User addresses table
CREATE TABLE user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    label VARCHAR(50) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- Wishlist table
CREATE TABLE wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user (user_id)
);

-- Create stored procedures for better performance

-- Procedure to get user cart with items
DELIMITER //
CREATE PROCEDURE GetUserCart(IN p_user_id INT, IN p_store_id INT)
BEGIN
    SELECT 
        c.id as cart_id,
        ci.id as cart_item_id,
        ci.product_id,
        p.name as product_name,
        p.image_url,
        p.unit,
        ci.quantity,
        ci.price_at_add as price,
        p.stock,
        (ci.quantity * ci.price_at_add) as item_total
    FROM carts c
    LEFT JOIN cart_items ci ON c.id = ci.cart_id
    LEFT JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = p_user_id AND c.store_id = p_store_id
    ORDER BY ci.created_at DESC;
END //
DELIMITER ;

-- Procedure to calculate cart totals
DELIMITER //
CREATE PROCEDURE CalculateCartTotals(IN p_cart_id INT, OUT p_subtotal DECIMAL(10,2), OUT p_delivery_fee DECIMAL(10,2), OUT p_total DECIMAL(10,2))
BEGIN
    -- Calculate subtotal
    SELECT COALESCE(SUM(ci.quantity * ci.price_at_add), 0) INTO p_subtotal
    FROM cart_items ci
    WHERE ci.cart_id = p_cart_id;
    
    -- Get store delivery fee and min order
    SELECT s.delivery_fee, s.min_order INTO @delivery_fee, @min_order
    FROM carts c
    JOIN stores s ON c.store_id = s.id
    WHERE c.id = p_cart_id;
    
    -- Calculate delivery fee
    IF p_subtotal >= @min_order THEN
        SET p_delivery_fee = 0;
    ELSE
        SET p_delivery_fee = @delivery_fee;
    END IF;
    
    -- Calculate total
    SET p_total = p_subtotal + p_delivery_fee;
END //
DELIMITER ;

-- Insert sample data
INSERT INTO stores (name, description, banner_url, rating, eta_min, eta_max, min_order, delivery_fee) VALUES
('FreshMart Grocery', 'Fresh produce, pantry staples & household essentials delivered to your door', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', 4.8, 30, 45, 100.00, 29.00);

SET @store_id = LAST_INSERT_ID();

INSERT INTO categories (name, icon, store_id) VALUES
('Fruits & Vegetables', '🍎', @store_id),
('Dairy & Eggs', '🥛', @store_id),
('Meat & Seafood', '🍗', @store_id),
('Bakery', '🍞', @store_id),
('Beverages', '🥤', @store_id),
('Snacks', '🍿', @store_id),
('Household', '🏠', @store_id),
('Personal Care', '🧴', @store_id),
('Pantry', '🥫', @store_id);

INSERT INTO products (name, description, price, category_id, store_id, unit, image_url, stock, discount_percent, is_popular, is_essential) VALUES
('Fresh Apples', 'Fresh and crunchy apples', 120.00, 1, @store_id, 'kg', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb', 50, 10.00, TRUE, FALSE),
('Bananas', 'Ripe yellow bananas', 40.00, 1, @store_id, 'dozen', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e', 80, 0.00, TRUE, FALSE),
('Milk', 'Fresh cow milk', 60.00, 2, @store_id, 'liter', 'https://images.unsplash.com/photo-1563636619-e9143da7973b', 100, 0.00, FALSE, TRUE),
('Eggs', 'Farm fresh eggs', 80.00, 2, @store_id, 'dozen', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f', 60, 0.00, FALSE, TRUE),
('Chicken Breast', 'Boneless chicken breast', 250.00, 3, @store_id, 'kg', 'https://images.unsplash.com/photo-1604503468506-8e6a6c0c2d78', 30, 0.00, FALSE, FALSE),
('Fresh Bread', 'Whole wheat bread', 45.00, 4, @store_id, 'pack', 'https://images.unsplash.com/photo-1509440159596-0249088772ff', 70, 0.00, TRUE, FALSE),
('Coca Cola', '1.5L bottle', 90.00, 5, @store_id, '1.5L', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97', 120, 0.00, FALSE, FALSE),
('Potato Chips', 'Classic salted chips', 50.00, 6, @store_id, 'pack', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b', 90, 0.00, FALSE, FALSE),
('Toilet Paper', 'Soft 4-ply tissue', 150.00, 7, @store_id, 'pack of 4', 'https://images.unsplash.com/photo-1584556812956-c9cf6c6e23c2', 40, 0.00, FALSE, TRUE),
('Shampoo', 'Herbal shampoo for all hair types', 180.00, 8, @store_id, 'bottle', 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34', 35, 0.00, FALSE, FALSE),
('Basmati Rice', 'Premium quality rice', 85.00, 9, @store_id, 'kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 60, 0.00, FALSE, TRUE),
('Tomatoes', 'Fresh red tomatoes', 35.00, 1, @store_id, 'kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea', 75, 0.00, FALSE, FALSE),
('Orange Juice', 'Freshly squeezed orange juice', 110.00, 5, @store_id, '1L', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b', 45, 0.00, TRUE, FALSE),
('Potatoes', 'Fresh potatoes', 30.00, 1, @store_id, 'kg', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655', 120, 0.00, FALSE, TRUE),
('Coffee', 'Premium ground coffee', 200.00, 5, @store_id, '250g', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 25, 0.00, TRUE, FALSE),
('Butter', 'Unsalted butter', 95.00, 2, @store_id, '250g', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d', 40, 0.00, FALSE, FALSE);