-- Create Database
CREATE DATABASE IF NOT EXISTS dahanu_db;
USE dahanu_db;

-- ==========================================
-- 1. USERS TABLE (Admin, Vendor, User)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Storing plain text for demo, use hashing in prod
    phone VARCHAR(20),
    role ENUM('USER', 'VENDOR', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin
-- Username: admin@dahanu.com / Password: admin123
INSERT IGNORE INTO users (id, name, email, password, phone, role) 
VALUES ('u_admin', 'System Admin', 'admin@dahanu.com', 'admin123', '9876543210', 'ADMIN');


-- ==========================================
-- 2. CATEGORIES TABLE (Hierarchical)
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50), -- Lucide Icon Name
    description TEXT,
    parent_id VARCHAR(50) NULL,
    theme_color VARCHAR(20) DEFAULT '#9C81A4',
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Seed Categories (Main)
INSERT IGNORE INTO categories (id, name, icon, description, theme_color, parent_id) VALUES 
('events', 'Events Services', 'PartyPopper', 'Everything you need for your special occasions.', '#9C27B0', NULL),
('medical', 'Medical & Health', 'Stethoscope', 'Healthcare services, clinics, and emergency support.', '#2196F3', NULL),
('transport', 'Transport', 'Truck', 'Logistics, travel agencies, and vehicle rentals.', '#FF9800', NULL),
('beauty', 'Beauty & Wellness', 'Sparkles', 'Salons, spas, and fitness centers.', '#E91E63', NULL),
('home', 'Home & Maintenance', 'Hammer', 'Repairs, renovations, and handyman services.', '#4CAF50', NULL),
('housekeeping', 'Housekeeping', 'SprayCan', 'Maids, cooks, and daily utility supplies.', '#009688', NULL),
('food', 'Food & Beverages', 'Utensils', 'Restaurants, cafes, and street food.', '#F44336', NULL),
('accom', 'Accommodation', 'Hotel', 'Hotels, lodges, and guest houses.', '#FFC107', NULL),
('dahanu_fresh', 'Dahanu Fresh', 'Apple', 'Fresh fruits, vegetables and organic produce.', '#43A047', NULL),
('dahanu_mart', 'Dahanu Mart', 'ShoppingBasket', 'Groceries and daily essentials.', '#FF5722', NULL);

-- Seed Sub-Categories
INSERT IGNORE INTO categories (id, name, icon, description, parent_id) VALUES 
('event_planning', 'Event Planning', NULL, 'Corporate and private events.', 'events'),
('catering', 'Catering & Food', NULL, 'Catering services.', 'events'),
('plumber', 'Plumber', NULL, 'Pipe fitting and repairs.', 'home'),
('electrician', 'Electrician', NULL, 'Electrical repairs.', 'home'),
('hospitals', 'Hospitals & Clinics', NULL, 'Emergency care.', 'medical'),
('seasonal_fruits', 'Seasonal Fruits', NULL, 'Fresh seasonal fruits.', 'dahanu_fresh'),
('daily_needs', 'Daily Essentials', NULL, 'Daily grocery items.', 'dahanu_mart');


-- ==========================================
-- 3. VENDORS TABLE (Service Providers)
-- ==========================================
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50), -- Link to users table if vendor has login
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rating DECIMAL(3,1) DEFAULT 0.0,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    address TEXT,
    contact VARCHAR(50),
    masked_contact VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    price_start DECIMAL(10,2),
    email VARCHAR(100),
    supports_delivery BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Sample Vendors
INSERT IGNORE INTO vendors (id, name, description, rating, lat, lng, address, contact, masked_contact, is_verified, is_approved, image_url, price_start, email, supports_delivery) VALUES
('v1', 'Elite Event Planners', 'Premier event planning for weddings.', 4.8, 19.97000000, 72.73000000, '123 Main St, Dahanu', '+919876543210', '+91 98*** **210', 1, 1, 'https://picsum.photos/300/200?random=10', 5000.00, 'elite@events.com', 0),
('v2', 'City General Hospital', '24/7 Emergency and specialized care.', 4.5, 19.97500000, 72.73500000, '45 Health Ave, Dahanu', '+919876543211', '+91 98*** **211', 1, 1, 'https://picsum.photos/300/200?random=11', 500.00, 'info@cityhosp.com', 0),
('v4', 'Green Farm Fresh', 'Fresh organic vegetables from local farms.', 4.9, 19.97200000, 72.73200000, 'Farm No 4, Bordi Road', '+919999988888', '+91 99*** **888', 1, 1, 'https://picsum.photos/300/200?random=13', 20.00, 'fresh@greenfarm.com', 1);


-- ==========================================
-- 4. VENDOR_CATEGORIES (Junction Table)
-- ==========================================
CREATE TABLE IF NOT EXISTS vendor_categories (
    vendor_id VARCHAR(50),
    category_id VARCHAR(50),
    PRIMARY KEY (vendor_id, category_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Link Vendors to Categories
INSERT IGNORE INTO vendor_categories (vendor_id, category_id) VALUES 
('v1', 'event_planning'),
('v2', 'hospitals'),
('v4', 'dahanu_fresh'),
('v4', 'seasonal_fruits');


-- ==========================================
-- 5. PRODUCTS TABLE (For Delivery Vendors)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Seed Products
INSERT INTO products (vendor_id, name, price) VALUES 
('v1', 'Wedding Package', 50000.00),
('v1', 'Birthday Basic', 15000.00),
('v4', 'Red Apples (1kg)', 180.00),
('v4', 'Fresh Spinach (Bunch)', 20.00),
('v4', 'Alphonso Mango (Dozen)', 800.00);


-- ==========================================
-- 6. ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    vendor_id VARCHAR(50),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    service_requested TEXT, -- Stores product details or service name
    date VARCHAR(50),
    status ENUM('PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING',
    address TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);


-- ==========================================
-- 7. BANNERS TABLE (Homepage)
-- ==========================================
CREATE TABLE IF NOT EXISTS banners (
    id VARCHAR(50) PRIMARY KEY,
    image_url TEXT NOT NULL,
    link TEXT,
    alt_text VARCHAR(255)
);

INSERT IGNORE INTO banners (id, image_url, link, alt_text) VALUES 
('1', 'https://picsum.photos/1200/300?random=1', '#', 'Big Sale on Home Services'),
('2', 'https://picsum.photos/1200/300?random=2', '#', 'Wedding Season Discounts');