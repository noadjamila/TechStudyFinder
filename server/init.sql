-- Database initialization script for TechStudyFinder
-- Script should be run once when setting up a new database
-- Creates all necessary tables with proper identity columns to prevent ID conflicts

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Favorites table for storing user's favorite study programmes
CREATE TABLE IF NOT EXISTS favoriten (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  studiengang_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, studiengang_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_favoriten_user_id ON favoriten(user_id);
CREATE INDEX IF NOT EXISTS idx_favoriten_studiengang_id ON favoriten(studiengang_id);
