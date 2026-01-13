-- Favorites table for storing user's favorite study programmes
-- Using GENERATED ALWAYS AS IDENTITY to prevent manual ID insertion 
CREATE TABLE IF NOT EXISTS favoriten (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  studiengang_id VARCHAR(255) NOT NULL,
  UNIQUE(user_id, studiengang_id)
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_favoriten_user_id ON favoriten(user_id);
CREATE INDEX IF NOT EXISTS idx_favoriten_studiengang_id ON favoriten(studiengang_id);
