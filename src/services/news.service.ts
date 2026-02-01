'use server';
import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_url: string | null;
  tags: string[];
  published_at: string;
  created_at: string;
  author_id: string | null;
  profiles?:
    | {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url: string | null;
        role: string;
      }[]
    | null;
};

export const getNewsPosts = cache(async (limit = 12) => {
  const db: SupabaseClient = await createClient();
  const { data, error } = await db
    .from('news_posts')
    .select(
      'id, title, slug, content, cover_url, tags, published_at, created_at, author_id, profiles ( id, first_name, last_name, avatar_url, role )',
    )
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as NewsPost[];
});

export const getNewsPostBySlug = cache(async (slug: string) => {
  console.log(slug);
  const db: SupabaseClient = await createClient();
  const { data, error } = await db
    .from('news_posts')
    .select(
      'id, title, slug, content, cover_url, tags, published_at, created_at, author_id, profiles ( id, first_name, last_name, avatar_url, role )',
    )
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data ? (data as NewsPost) : null;
});
