drop policy "Enable read access for all users" on "public"."app_stats";

drop policy "Authenticated read comment reactions" on "public"."comment_reactions";

drop policy "Users react" on "public"."comment_reactions";

drop policy "Users remove own reactions" on "public"."comment_reactions";

drop policy "Authenticated read laps" on "public"."laps";

drop policy "Users delete own laps" on "public"."laps";

drop policy "Users insert own laps" on "public"."laps";

drop policy "Users update own laps" on "public"."laps";

drop policy "Public read news posts" on "public"."news_posts";

drop policy "Team and admin manage news posts" on "public"."news_posts";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

drop policy "Authenticated read session comments" on "public"."session_comments";

drop policy "Users delete own session comments" on "public"."session_comments";

drop policy "Users insert own session comments" on "public"."session_comments";

drop policy "Users update own session comments" on "public"."session_comments";

drop policy "Authenticated read sessions" on "public"."sessions";

drop policy "Users delete own sessions" on "public"."sessions";

drop policy "Users insert own sessions" on "public"."sessions";

drop policy "Users update own sessions" on "public"."sessions";

drop policy "Authenticated read telemetry" on "public"."telemetry_points";

drop policy "Users delete own telemetry" on "public"."telemetry_points";

drop policy "Users insert own telemetry" on "public"."telemetry_points";

drop policy "Users update own telemetry" on "public"."telemetry_points";

drop policy "Admins update tracks" on "public"."tracks";

drop policy "Authenticated read tracks" on "public"."tracks";

drop policy "Users insert tracks" on "public"."tracks";

drop policy "Users delete own dm messages" on "public"."dm_messages";

drop policy "Users edit own dm messages" on "public"."dm_messages";

drop policy "Users read dm messages" on "public"."dm_messages";

drop policy "Users send dm messages" on "public"."dm_messages";

drop policy "Users add dm participants" on "public"."dm_participants";

drop policy "Users read dm participants" on "public"."dm_participants";

drop policy "Users remove dm participants" on "public"."dm_participants";

drop policy "Users create dm threads" on "public"."dm_threads";

drop policy "Users delete own dm threads" on "public"."dm_threads";

drop policy "Users read dm threads" on "public"."dm_threads";

alter table "public"."sessions" add column "track_slug" character varying not null;

alter table "public"."sessions" add constraint "sessions_track_slug_fkey" FOREIGN KEY (track_slug) REFERENCES public.tracks(slug) not valid;

alter table "public"."sessions" validate constraint "sessions_track_slug_fkey";

set check_function_bodies = off;

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

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;$function$
;


  create policy "App stats delete admin"
  on "public"."app_stats"
  as permissive
  for delete
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "App stats insert admin"
  on "public"."app_stats"
  as permissive
  for insert
  to authenticated
with check (public.is_admin(auth.uid()));



  create policy "App stats read public"
  on "public"."app_stats"
  as permissive
  for select
  to public
using (true);



  create policy "App stats update admin"
  on "public"."app_stats"
  as permissive
  for update
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "Comment reactions delete own or admin"
  on "public"."comment_reactions"
  as permissive
  for delete
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Comment reactions insert own"
  on "public"."comment_reactions"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "Comment reactions read"
  on "public"."comment_reactions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Comment reactions update admin"
  on "public"."comment_reactions"
  as permissive
  for update
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "Laps delete own or admin"
  on "public"."laps"
  as permissive
  for delete
  to authenticated
using ((public.is_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.sessions s
  WHERE ((s.id = laps.session_id) AND (s.user_id = auth.uid()))))));



  create policy "Laps insert own or admin"
  on "public"."laps"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.sessions s
  WHERE ((s.id = laps.session_id) AND (s.user_id = auth.uid()))))));



  create policy "Laps read"
  on "public"."laps"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Laps update own or admin"
  on "public"."laps"
  as permissive
  for update
  to authenticated
using ((public.is_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.sessions s
  WHERE ((s.id = laps.session_id) AND (s.user_id = auth.uid()))))));



  create policy "News posts delete team or admin"
  on "public"."news_posts"
  as permissive
  for delete
  to authenticated
using (public.is_team_or_admin(auth.uid()));



  create policy "News posts insert team or admin"
  on "public"."news_posts"
  as permissive
  for insert
  to authenticated
with check (public.is_team_or_admin(auth.uid()));



  create policy "News posts read public"
  on "public"."news_posts"
  as permissive
  for select
  to public
using (true);



  create policy "News posts update team or admin"
  on "public"."news_posts"
  as permissive
  for update
  to authenticated
using (public.is_team_or_admin(auth.uid()));



  create policy "Profiles delete admin"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "Profiles insert own"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((id = auth.uid()));



  create policy "Profiles read"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Profiles update own or admin"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using (((id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Session comments delete own or admin"
  on "public"."session_comments"
  as permissive
  for delete
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Session comments insert own"
  on "public"."session_comments"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "Session comments read"
  on "public"."session_comments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Session comments update own or admin"
  on "public"."session_comments"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Sessions delete own or admin"
  on "public"."sessions"
  as permissive
  for delete
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Sessions insert own or admin"
  on "public"."sessions"
  as permissive
  for insert
  to authenticated
with check (((user_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Sessions read"
  on "public"."sessions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Sessions update own or admin"
  on "public"."sessions"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Telemetry delete own session or admin"
  on "public"."telemetry_points"
  as permissive
  for delete
  to authenticated
using ((public.is_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.sessions s
  WHERE ((s.id = telemetry_points.session_id) AND (s.user_id = auth.uid()))))));



  create policy "Telemetry insert own session or admin"
  on "public"."telemetry_points"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.sessions s
  WHERE ((s.id = telemetry_points.session_id) AND (s.user_id = auth.uid()))))));



  create policy "Telemetry read"
  on "public"."telemetry_points"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Telemetry update own session or admin"
  on "public"."telemetry_points"
  as permissive
  for update
  to authenticated
using ((public.is_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.sessions s
  WHERE ((s.id = telemetry_points.session_id) AND (s.user_id = auth.uid()))))));



  create policy "Tracks delete admin"
  on "public"."tracks"
  as permissive
  for delete
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "Tracks insert"
  on "public"."tracks"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Tracks read"
  on "public"."tracks"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Tracks update admin"
  on "public"."tracks"
  as permissive
  for update
  to authenticated
using (public.is_admin(auth.uid()));



  create policy "Users delete own dm messages"
  on "public"."dm_messages"
  as permissive
  for delete
  to authenticated
using (((sender_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Users edit own dm messages"
  on "public"."dm_messages"
  as permissive
  for update
  to authenticated
using (((sender_id = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Users read dm messages"
  on "public"."dm_messages"
  as permissive
  for select
  to authenticated
using ((public.is_thread_participant(thread_id, auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Users send dm messages"
  on "public"."dm_messages"
  as permissive
  for insert
  to authenticated
with check (((sender_id = auth.uid()) AND (public.is_thread_participant(thread_id, auth.uid()) OR public.is_admin(auth.uid()))));



  create policy "Users add dm participants"
  on "public"."dm_participants"
  as permissive
  for insert
  to authenticated
with check (((auth.uid() IS NOT NULL) AND ((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.dm_threads t
  WHERE ((t.id = dm_participants.thread_id) AND (t.created_by = auth.uid())))) OR public.is_admin(auth.uid()))));



  create policy "Users read dm participants"
  on "public"."dm_participants"
  as permissive
  for select
  to authenticated
using ((public.is_thread_participant(thread_id, auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Users remove dm participants"
  on "public"."dm_participants"
  as permissive
  for delete
  to authenticated
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.dm_threads t
  WHERE ((t.id = dm_participants.thread_id) AND (t.created_by = auth.uid())))) OR public.is_admin(auth.uid())));



  create policy "Users create dm threads"
  on "public"."dm_threads"
  as permissive
  for insert
  to authenticated
with check ((created_by = auth.uid()));



  create policy "Users delete own dm threads"
  on "public"."dm_threads"
  as permissive
  for delete
  to authenticated
using (((created_by = auth.uid()) OR public.is_admin(auth.uid())));



  create policy "Users read dm threads"
  on "public"."dm_threads"
  as permissive
  for select
  to authenticated
using (((created_by = auth.uid()) OR public.is_thread_participant(id, auth.uid()) OR public.is_admin(auth.uid())));




