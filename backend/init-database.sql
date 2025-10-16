-- T-Rex Database Initialization Script
-- This script sets up the database schema and loads comprehensive vehicle data

-- Create the database if it doesn't exist
-- Note: Run this as postgres superuser first
-- CREATE DATABASE t_rex_db;
-- CREATE USER t_rex_user WITH PASSWORD 'password';
-- GRANT ALL PRIVILEGES ON DATABASE t_rex_db TO t_rex_user;

-- Connect to the database
\c t_rex_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS vehicles CASCADE;

-- Create vehicles table
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    used_vehicle_stock_id BIGINT UNIQUE,
    year INTEGER,
    make_name VARCHAR(100),
    model_name VARCHAR(100),
    variant_name VARCHAR(255),
    vin VARCHAR(50),
    registration VARCHAR(50),
    mm_code VARCHAR(50),
    engine_no VARCHAR(100),
    mileage INTEGER,
    colour VARCHAR(100),
    province_name VARCHAR(100),
    city_name VARCHAR(100),
    trim VARCHAR(100),
    condition VARCHAR(50),
    stock_code VARCHAR(100),
    department VARCHAR(50),
    load_date TIMESTAMP,
    last_touch_date TIMESTAMP,
    last_changed_date TIMESTAMP,
    sold_date TIMESTAMP,
    is_program INTEGER,
    currency_symbol VARCHAR(10),
    price DECIMAL(12, 2),
    first_price DECIMAL(12, 2),
    franchise VARCHAR(255),
    extras TEXT,
    comments TEXT,
    body_type VARCHAR(50),
    transmission VARCHAR(50),
    fuel_type VARCHAR(50),
    engine_size VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_vehicles_make ON vehicles(make_name);
CREATE INDEX idx_vehicles_model ON vehicles(model_name);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_province ON vehicles(province_name);
CREATE INDEX idx_vehicles_city ON vehicles(city_name);
CREATE INDEX idx_vehicles_sold_date ON vehicles(sold_date);
CREATE INDEX idx_vehicles_body_type ON vehicles(body_type);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_transmission ON vehicles(transmission);

-- Note: comprehensive-vehicles.sql will be loaded automatically by Docker
-- as 02-comprehensive-vehicles.sql in the docker-entrypoint-initdb.d directory
