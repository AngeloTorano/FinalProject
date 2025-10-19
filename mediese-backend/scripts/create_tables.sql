-- PostgreSQL table creation script for Mediease backend
-- Run this script to create the necessary tables

CREATE TABLE IF NOT EXISTS staff_accounts (
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_username ON staff_accounts(username);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff_accounts(email);
