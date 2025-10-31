-- Migration: V202510XX_add_contact_request_tables
-- Purpose: Create contact_requests and contact_request_vehicles tables with anonymity tracking
-- Date: October 31, 2025

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    preferred_contact_method VARCHAR(20) NOT NULL,
    additional_comments TEXT,
    anonymity_expires_at TIMESTAMP NOT NULL,
    email_sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on contact_requests
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_anonymity_expires_at ON contact_requests(anonymity_expires_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_email_sent_at ON contact_requests(email_sent_at);

-- Create contact_request_vehicles junction table
CREATE TABLE IF NOT EXISTS contact_request_vehicles (
    id BIGSERIAL PRIMARY KEY,
    contact_request_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    sequence INTEGER NOT NULL,
    CONSTRAINT fk_contact_request FOREIGN KEY (contact_request_id) REFERENCES contact_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT uk_contact_request_vehicle UNIQUE (contact_request_id, vehicle_id)
);

-- Create indexes on contact_request_vehicles
CREATE INDEX IF NOT EXISTS idx_contact_request_vehicles_contact_request_id ON contact_request_vehicles(contact_request_id);
CREATE INDEX IF NOT EXISTS idx_contact_request_vehicles_vehicle_id ON contact_request_vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_contact_request_vehicles_sequence ON contact_request_vehicles(sequence);

-- Add anonymity_expires_at column to contact_requests if it doesn't exist
-- (Already included in CREATE TABLE above)

-- Add email_sent_at column to contact_requests for tracking dealership notifications
-- (Already included in CREATE TABLE above)
