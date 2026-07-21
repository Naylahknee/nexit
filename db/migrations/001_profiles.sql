CREATE TABLE IF NOT EXISTS profiles (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  current_country TEXT NOT NULL DEFAULT '',
  timeline TEXT NOT NULL DEFAULT 'Just exploring',
  priority TEXT NOT NULL DEFAULT 'Affordability',
  monthly_income INT NOT NULL DEFAULT 2500 CHECK (monthly_income >= 0),
  remote BOOLEAN NOT NULL DEFAULT TRUE,
  family_size INT NOT NULL DEFAULT 1 CHECK (family_size BETWEEN 1 AND 12),
  preferred_region TEXT NOT NULL DEFAULT 'Open to anywhere',
  climate TEXT NOT NULL DEFAULT 'No preference',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  wizard_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
