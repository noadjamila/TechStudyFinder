-- User quiz results table for storing saved study programme recommendations
CREATE TABLE IF NOT EXISTS user_quiz_results (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  result_ids JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
