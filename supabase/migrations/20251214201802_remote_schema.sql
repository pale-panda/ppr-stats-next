alter table "public"."laps" drop column "min_g_force_x";

alter table "public"."laps" drop column "min_g_force_z";

alter table "public"."laps" drop column "min_speed_kmh";

alter table "public"."telemetry_points" add column "latitude" numeric(10,7) not null;

alter table "public"."telemetry_points" add column "longitude" numeric(10,7) not null;

alter table "public"."tracks" drop column "gps_point";

alter table "public"."tracks" add column "latitude" numeric(10,7);

alter table "public"."tracks" add column "longitude" numeric(10,7);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calc_min_g_force_x(session_id_input uuid)
 RETURNS TABLE(lap_number integer, min_g_force_x numeric)
 LANGUAGE plpgsql
AS $function$
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
$function$
;


