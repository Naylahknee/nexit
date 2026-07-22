-- Baseline tables required before later migrations.
-- Idempotent: safe to run on a fresh database or one already created from db/schema.sql.
-- Runs first (000) so 001_profiles.sql can reference users(id).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  income_required INT NOT NULL CHECK (income_required >= 0),
  UNIQUE (name, visa_type)
);

INSERT INTO countries (name, visa_type, income_required) VALUES
  ('Portugal', 'D7', 2000),
  ('Spain', 'Digital Nomad', 2500),
  ('Mexico', 'Temporary Resident', 1500)
ON CONFLICT (name, visa_type) DO NOTHING;
