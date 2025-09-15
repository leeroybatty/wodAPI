CREATE TYPE breed AS ENUM (
  'Homid',
  'Metis',
  'Lupus',
  'Hyaena',
  'Arachnid',
  'Feline',
  'Corvid',
  'Ursine',
  'Fox',
  'Suchid',
  'Serpent',
  'Latrani',
  'Rodens',
  'Squamus'
);

CREATE TYPE auspice AS ENUM (
  'Ragabash',
  'Theurge',
  'Philodox',
  'Galliard',
  'Ahroun',
  'Brightwater',
  'Dimwater',
  'Darkwater',
  'Kamakshi',
  'Kartikeya',
  'Kamsa',
  'Kali',
  'Rising Sun',
  'Noonday Sun',
  'Setting Sun',
  'Shrouded Sun',
  'Arcas',
  'Uzmati',
  'Kojubat',
  'Kieh',
  'Rishi',
  'Daylight',
  'Twilight',
  'Night',
  'Tenere',
  'Hatar',
  'Kumoti',
  'Dawn',
  'Dusk',
  'Kataribe',
  'Gukutsushi',
  'Doshi',
  'Eji',
  'Midnight'
);

ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS breed BREED;

ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS auspice AUSPICE;

CREATE TABLE IF NOT EXISTS werewolf_gifts (
  name TEXT NOT NULL,
  rank INTEGER,
  wyrm_only boolean,
  weaver_only boolean,
  book_id INT references wod_books(id)
  page_number INT
);