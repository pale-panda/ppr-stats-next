


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calc_min_g_force_x"("session_id_input" "uuid") RETURNS TABLE("lap_number" integer, "min_g_force_x" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        tp.lap_number,
        MIN(tp.g_force_x) AS min_g_force_x
    FROM public.telemetry_points tp
    WHERE tp.session_id = session_id_input
    GROUP BY tp.lap_number
    ORDER BY tp.lap_number;
END;
$$;


ALTER FUNCTION "public"."calc_min_g_force_x"("session_id_input" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."laps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid",
    "lap_number" integer NOT NULL,
    "lap_time_seconds" numeric(10,3),
    "max_lean_angle" numeric(5,2),
    "min_speed_kmh" numeric(6,2),
    "max_speed_kmh" numeric(6,2),
    "min_g_force_x" numeric(5,3),
    "max_g_force_x" numeric(5,3),
    "min_g_force_z" numeric(5,3),
    "max_g_force_z" numeric(5,3),
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "sector_1" numeric,
    "sector_2" numeric,
    "sector_3" numeric,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."laps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "track_id" "uuid",
    "user_id" "uuid",
    "data_source" "text",
    "session_date" timestamp with time zone NOT NULL,
    "session_type" "text" DEFAULT 'Track'::"text",
    "total_laps" integer DEFAULT 0,
    "best_lap_time_seconds" numeric(10,3),
    "vehicle" "text",
    "duration_seconds" numeric,
    "file_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."telemetry_points" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid",
    "lap_id" "uuid",
    "record_number" integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "altitude" numeric(8,2),
    "speed_kmh" numeric(6,2),
    "g_force_x" numeric(5,3),
    "g_force_z" numeric(5,3),
    "lap_number" integer,
    "lean_angle" numeric(5,2),
    "gyro_x" numeric(8,3),
    "gyro_y" numeric(8,3),
    "gyro_z" numeric(8,3),
    "gps_point" "jsonb"
);


ALTER TABLE "public"."telemetry_points" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tracks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "country" "text",
    "length_meters" numeric(10,2),
    "turns" integer,
    "configuration" "text",
    "image_url" "text",
    "description" "text",
    "gps_point" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tracks" OWNER TO "postgres";


ALTER TABLE ONLY "public"."laps"
    ADD CONSTRAINT "laps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."telemetry_points"
    ADD CONSTRAINT "telemetry_points_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_laps_lap_number" ON "public"."laps" USING "btree" ("lap_number");



CREATE INDEX "idx_laps_session_id" ON "public"."laps" USING "btree" ("session_id");



CREATE INDEX "idx_sessions_session_date" ON "public"."sessions" USING "btree" ("session_date");



CREATE INDEX "idx_sessions_track_id" ON "public"."sessions" USING "btree" ("track_id");



CREATE INDEX "idx_telemetry_lap_id" ON "public"."telemetry_points" USING "btree" ("lap_id");



CREATE INDEX "idx_telemetry_session_id" ON "public"."telemetry_points" USING "btree" ("session_id");



CREATE INDEX "idx_telemetry_timestamp" ON "public"."telemetry_points" USING "btree" ("timestamp");



ALTER TABLE ONLY "public"."laps"
    ADD CONSTRAINT "laps_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."telemetry_points"
    ADD CONSTRAINT "telemetry_points_lap_id_fkey" FOREIGN KEY ("lap_id") REFERENCES "public"."laps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."telemetry_points"
    ADD CONSTRAINT "telemetry_points_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



CREATE POLICY "Allow public insert on laps" ON "public"."laps" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public insert on sessions" ON "public"."sessions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public insert on telemetry" ON "public"."telemetry_points" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public insert on tracks" ON "public"."tracks" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public read access on laps" ON "public"."laps" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on sessions" ON "public"."sessions" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on telemetry" ON "public"."telemetry_points" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on tracks" ON "public"."tracks" FOR SELECT USING (true);



CREATE POLICY "Allow public update on sessions" ON "public"."sessions" FOR UPDATE USING (true);



CREATE POLICY "Allow public update on tracks" ON "public"."tracks" FOR UPDATE USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."laps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."telemetry_points" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tracks" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."calc_min_g_force_x"("session_id_input" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calc_min_g_force_x"("session_id_input" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calc_min_g_force_x"("session_id_input" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."laps" TO "anon";
GRANT ALL ON TABLE "public"."laps" TO "authenticated";
GRANT ALL ON TABLE "public"."laps" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON TABLE "public"."telemetry_points" TO "anon";
GRANT ALL ON TABLE "public"."telemetry_points" TO "authenticated";
GRANT ALL ON TABLE "public"."telemetry_points" TO "service_role";



GRANT ALL ON TABLE "public"."tracks" TO "anon";
GRANT ALL ON TABLE "public"."tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."tracks" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Anyone can upload an avatar."
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'avatars'::text));



  create policy "Avatar images are publicly accessible."
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



