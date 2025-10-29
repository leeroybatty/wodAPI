CREATE TABLE IF NOT EXISTS bridge_paths_virtues (
  id SERIAL PRIMARY KEY,
  path_id INT REFERENCES stats(id),
  stat_id INT REFERENCES stats(id),
);

CREATE TABLE IF NOT EXISTS rituals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value INT,
  stat_id INT REFERENCES stats(id),
  book_id INT REFERENCES wod_books(id),
  page_number INT
);

CREATE TABLE IF NOT EXISTS ritae (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  auctoritas BOOLEAN DEFAULT FALSE
);

