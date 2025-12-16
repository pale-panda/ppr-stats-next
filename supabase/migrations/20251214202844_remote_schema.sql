alter table "public"."laps" add column "min_g_force_x" numeric(5,3);

alter table "public"."laps" add column "min_g_force_z" numeric(5,3);

alter table "public"."laps" add column "min_speed_kmh" numeric(6,2);

alter table "public"."telemetry_points" drop column "latitude";

alter table "public"."telemetry_points" drop column "longitude";

alter table "public"."tracks" drop column "latitude";

alter table "public"."tracks" drop column "longitude";

alter table "public"."tracks" add column "gps_point" jsonb;


