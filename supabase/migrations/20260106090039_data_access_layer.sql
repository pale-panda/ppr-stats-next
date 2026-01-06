alter table "public"."tracks" drop constraint "tracks_track_slug_key";

drop index if exists "public"."tracks_track_slug_key";

alter table "public"."tracks" drop column "track_slug";

alter table "public"."tracks" add column "slug" character varying not null;

CREATE UNIQUE INDEX tracks_track_slug_key ON public.tracks USING btree (slug);

alter table "public"."tracks" add constraint "tracks_track_slug_key" UNIQUE using index "tracks_track_slug_key";


