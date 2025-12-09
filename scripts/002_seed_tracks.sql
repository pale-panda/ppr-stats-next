-- Seed the two Swedish tracks from the uploaded sessions
INSERT INTO tracks (name, country, length_meters, turns, configuration, latitude, longitude)
VALUES 
  ('Anderstorp', 'Sweden', 4015, 12, 'Full Circuit', 57.2610, 13.6000),
  ('Mantorp Park', 'Sweden', 3106, 9, 'Full Circuit', 58.5013, 15.2877)
ON CONFLICT (name) DO UPDATE SET
  country = EXCLUDED.country,
  length_meters = EXCLUDED.length_meters,
  turns = EXCLUDED.turns,
  configuration = EXCLUDED.configuration,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();
