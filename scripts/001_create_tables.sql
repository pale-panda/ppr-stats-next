-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  length_meters DECIMAL(10, 2),
  turns INTEGER,
  configuration TEXT,
  description TEXT,
  image_url TEXT,
  gps_point JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  data_source TEXT,
  session_date TIMESTAMPTZ NOT NULL,
  session_type TEXT DEFAULT 'Track',
  total_laps INTEGER DEFAULT 0,
  best_lap_time_seconds DECIMAL(10, 3),
  vehicle TEXT,
  duration_seconds DECIMAL(10, 3),
  session_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create laps table
CREATE TABLE IF NOT EXISTS laps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  lap_number INTEGER NOT NULL,
  lap_time_seconds DECIMAL(10, 3),
  max_lean_angle DECIMAL(5, 2),
  min_speed_kmh DECIMAL(6, 2),
  max_speed_kmh DECIMAL(6, 2),
  min_g_force_x DECIMAL(5, 3),
  max_g_force_x DECIMAL(5, 3),
  min_g_force_z DECIMAL(5, 3),
  max_g_force_z DECIMAL(5, 3),
  sector_1 DECIMAL(10, 3),
  sector_2 DECIMAL(10, 3),
  sector_3 DECIMAL(10, 3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create telemetry_points table for high-frequency GPS data
CREATE TABLE IF NOT EXISTS telemetry_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  lap_id UUID REFERENCES laps(id) ON DELETE CASCADE,
  record_number INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  gps_point JSONB,
  altitude DECIMAL(8, 2),
  speed_kmh DECIMAL(6, 2),
  g_force_x DECIMAL(5, 3),
  g_force_z DECIMAL(5, 3),
  lap_number INTEGER,
  lean_angle DECIMAL(5, 2),
  gyro_x DECIMAL(8, 3),
  gyro_y DECIMAL(8, 3),
  gyro_z DECIMAL(8, 3)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_track_id ON sessions(track_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_laps_session_id ON laps(session_id);
CREATE INDEX IF NOT EXISTS idx_laps_lap_number ON laps(lap_number);
CREATE INDEX IF NOT EXISTS idx_telemetry_session_id ON telemetry_points(session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_lap_id ON telemetry_points(lap_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry_points(timestamp);

-- Enable RLS on all tables (public read for now, can restrict later)
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE laps ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_points ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for now, since no auth required)
CREATE POLICY "Allow public read access on tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tracks" ON tracks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tracks" ON tracks FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sessions" ON sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on laps" ON laps FOR SELECT USING (true);
CREATE POLICY "Allow public insert on laps" ON laps FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on telemetry" ON telemetry_points FOR SELECT USING (true);
CREATE POLICY "Allow public insert on telemetry" ON telemetry_points FOR INSERT WITH CHECK (true);
