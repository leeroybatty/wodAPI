CREATE TABLE IF NOT EXISTS wod_books (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INT REFERENCES wod_books(id),
  CONSTRAINT unique_book_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INT REFERENCES stats(id),
  xp_cost INT,
  freebie_cost INT,
  description TEXT,
  book_id INT REFERENCES wod_books(id),
  page_number INT, 
  org_lock_id INT REFERENCES organizations(id),
  CONSTRAINT unique_stat_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name TEXT,
  parent_id INT REFERENCES organizations(id),
  book_id INT REFERENCES wod_books(id),
  page_number INT, 
  monster_id INT REFERENCES monsters(id),
  CONSTRAINT unique_organization_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS monsters (
  id SERIAL PRIMARY KEY,
  name TEXT,
  parent_id INT REFERENCES monsters(id),
  org_lock_id INT REFERENCES organizations(id),
  book_id INT REFERENCES wod_books(id),
  page_number INT,
  weakness VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bridge_monsters_stats (
  id SERIAL PRIMARY KEY,
  monster_id INT REFERENCES monsters(id),
  stat_id INT REFERENCES stats(id)
);

CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  dbref TEXT NULL,
  current_xp DOUBLE PRECISION,
  total_xp DOUBLE PRECISION,
  curr_network_xp DOUBLE PRECISION,
  total_network_xp DOUBLE PRECISION,
  monster_id INT REFERENCES monsters(id),
  path_id INT REFERENCES stats(id),
  nature_id INT REFERENCES stats(id),
  demeanor_id INT REFERENCES stats(id),
  org_id INT REFERENCES organizations(id),
  approved INT,   -- sometimes bool, sometimes timestamp in secs()
  deactivated INT,  -- sometimes bool, sometimes timestamp in secs()
  retired INT,    -- sometimes bool, sometimes timestamp in secs()
  staff BOOLEAN,
  npc BOOLEAN,
  birthdate INT,
  diablerist BOOLEAN,
  additional_discipline INT references stats(id)
  player_id INT REFERENCES players(id),
  full_name TEXT,
  CONSTRAINT unique_character_dbref UNIQUE (dbref)
);

CREATE TABLE IF NOT EXISTS pooled_backgrounds (
  id SERIAL PRIMARY KEY,
  name TEXT,
  owner_id INT REFERENCES characters(id)
);

CREATE TABLE IF NOT EXISTS bridge_characters_stats (
  id SERIAL PRIMARY KEY,
  character_id INT REFERENCES characters(id),
  stat_id INT REFERENCES stats(id),
  value INT,
  background_pool_id INT REFERENCES pooled_backgrounds (id) ON DELETE CASCADE,
  CONSTRAINT unique_character_stats UNIQUE (character_id, stat_id),
);

-- Players: Read-only. Admin: Can edit characters.  Lead: Can edit game settings.
CREATE TYPE user_role AS ENUM ('Player', 'Administrator', 'Lead');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(250) UNIQUE NOT NULL,
  email VARCHAR(250) UNIQUE NOT NULL,        -- Emails are encypted non-deterministicaly.
  hashed_email VARCHAR(250) UNIQUE NOT NULL, -- Hashes used to check for existing emails.
  password VARCHAR(512) NOT NULL,
  password_reset_token VARCHAR(250),
  password_reset_expiry TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  role user_role DEFAULT 'Player'
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();