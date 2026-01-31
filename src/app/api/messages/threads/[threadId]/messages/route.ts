import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createMessageSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/messages/threads/[threadId]/messages'>
) {
  const { threadId } = await ctx.params;

  if (!threadId) {
    return NextResponse.json({ error: 'Missing thread id' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: messages, error } = await supabase
    .from('dm_messages')
    .select('id, thread_id, sender_id, body, created_at, edited_at, deleted_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/messages/threads/[threadId]/messages'>
) {
  const { threadId } = await ctx.params;

  if (!threadId) {
    return NextResponse.json({ error: 'Missing thread id' }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('dm_messages')
    .insert({
      thread_id: threadId,
      sender_id: user.id,
      body: parsed.data.body,
    })
    .select('id, thread_id, sender_id, body, created_at')
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: data });
}
