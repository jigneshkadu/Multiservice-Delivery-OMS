
-- Create Database
CREATE DATABASE IF NOT EXISTS dahanu_db;
USE dahanu_db;

-- ==========================================
-- 1. USERS TABLE (Admin, Vendor, User, Rider)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NULL, -- Link to Firebase Identity
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NULL, -- Optional if using Firebase/Social
    phone VARCHAR(20),
    role ENUM('USER', 'VENDOR', 'ADMIN', 'RIDER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin
INSERT IGNORE INTO users (id, name, email, role) 
VALUES ('u_admin', 'System Admin', 'admin@dahanu.com', 'ADMIN');

-- ==========================================
-- 2. CATEGORIES TABLE (Hierarchical)
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50), 
    description TEXT,
    parent_id VARCHAR(50) NULL,
    theme_color VARCHAR(20) DEFAULT '#9C81A4',
    registration_fee DECIMAL(10,2) DEFAULT 999.00,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Seed Categories (Main)
INSERT IGNORE INTO categories (id, name, icon, description, theme_color) VALUES 
('events', 'Events Services', 'PartyPopper', 'Everything you need for your special occasions.', '#9C27B0'),
('medical', 'Medical & Health', 'Stethoscope', 'Healthcare services, clinics, and emergency support.', '#2196F3'),
('transport', 'Transport', 'Truck', 'Logistics, travel agencies, and vehicle rentals.', '#FF9800'),
('beauty', 'Beauty & Wellness', 'Sparkles', 'Salons, spas, and fitness centers.', '#E91E63'),
('home', 'Home & Maintenance', 'Hammer', 'Repairs, renovations, and handyman services.', '#4CAF50'),
('housekeeping', 'Housekeeping', 'SprayCan', 'Maids, cooks, and daily utility supplies.', '#009688'),
('food', 'Food & Beverages', 'Utensils', 'Restaurants, cafes, and street food.', '#F44336'),
('accom', 'Accommodation', 'Hotel', 'Hotels, lodges, and guest houses.', '#FFC107'),
('dahanu_fresh', 'Dahanu Fresh', 'Apple', 'Fresh fruits, vegetables and organic produce.', '#43A047'),
('dahanu_mart', 'Dahanu Mart', 'ShoppingBasket', 'Groceries and daily essentials.', '#FF5722');

-- ==========================================
-- 3. VENDORS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50), 
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rating DECIMAL(3,1) DEFAULT 4.0,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    address TEXT,
    contact VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    price_start DECIMAL(10,2) DEFAULT 0.00,
    email VARCHAR(100),
    supports_delivery BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- 4. RIDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS riders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_type ENUM('BIKE', 'SCOOTER', 'CYCLE') NOT NULL,
    status ENUM('ONLINE', 'OFFLINE', 'BUSY') DEFAULT 'OFFLINE',
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    is_approved BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,1) DEFAULT 5.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- 5. ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    vendor_id VARCHAR(50),
    rider_id VARCHAR(50),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    service_requested TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING',
    address TEXT,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
    FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE SET NULL
);
