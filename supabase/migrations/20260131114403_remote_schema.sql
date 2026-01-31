alter table "public"."sessions" drop constraint "sessions_track_slug_fkey";

alter table "public"."sessions" alter column "track_slug" drop not null;

CREATE UNIQUE INDEX tracks_track_slug_key ON public.tracks USING btree (slug);

alter table "public"."tracks" add constraint "tracks_track_slug_key" UNIQUE using index "tracks_track_slug_key";

alter table "public"."sessions" add constraint "sessions_track_slug_fkey" FOREIGN KEY (track_slug) REFERENCES public.tracks(slug) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_track_slug_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.dm_messages_broadcast_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  PERFORM realtime.broadcast_changes(
    'dm:' || NEW.thread_id::text || ':messages',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'email', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = _user_id
      and p.role = 'admin'::public.app_role
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_team_or_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = _user_id
      and p.role = any (array['admin'::public.app_role, 'team'::public.app_role])
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_thread_participant(_thread_id uuid, _user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.dm_participants dp
    where dp.thread_id = _thread_id
      and dp.user_id = _user_id
  );
$function$
;


  create policy "Allow public insert on laps"
  on "public"."laps"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public read access on laps"
  on "public"."laps"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public insert on sessions"
  on "public"."sessions"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public read access on sessions"
  on "public"."sessions"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public update on sessions"
  on "public"."sessions"
  as permissive
  for update
  to public
using (true);



  create policy "Allow public insert on telemetry"
  on "public"."telemetry_points"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public read access on telemetry"
  on "public"."telemetry_points"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public insert on tracks"
  on "public"."tracks"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public read access on tracks"
  on "public"."tracks"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public update on tracks"
  on "public"."tracks"
  as permissive
  for update
  to public
using (true);


CREATE TRIGGER dm_messages_broadcast_trigger AFTER INSERT ON public.dm_messages FOR EACH ROW EXECUTE FUNCTION public.dm_messages_broadcast_trigger();

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


