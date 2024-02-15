CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  content text NOT NULL,
  views integer NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL
);