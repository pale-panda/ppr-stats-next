import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createThreadSchema = z.object({
  recipientId: z.uuid(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: participantRows, error: participantError } = await supabase
    .from('dm_participants')
    .select('thread_id')
    .eq('user_id', user.id);

  if (participantError) {
    return NextResponse.json(
      { error: 'Failed to fetch threads', details: participantError.message },
      { status: 500 },
    );
  }

  const threadIds = (participantRows ?? []).map((row) => row.thread_id);

  if (threadIds.length === 0) {
    return NextResponse.json({ threads: [] });
  }

  const { data: threads, error: threadsError } = await supabase
    .from('dm_threads')
    .select('id, created_at, created_by')
    .in('id', threadIds)
    .order('created_at', { ascending: false });

  if (threadsError) {
    return NextResponse.json(
      { error: 'Failed to fetch threads', details: threadsError.message },
      { status: 500 },
    );
  }

  const { data: participants, error: participantsError } = await supabase
    .from('dm_participants')
    .select(
      'thread_id, user_id, profiles ( id, first_name, last_name, avatar_url, role )',
    )
    .in('thread_id', threadIds);

  if (participantsError) {
    return NextResponse.json(
      {
        error: 'Failed to fetch participants',
        details: participantsError.message,
      },
      { status: 500 },
    );
  }

  const { data: messages, error: messagesError } = await supabase
    .from('dm_messages')
    .select('thread_id, id, body, created_at, sender_id')
    .in('thread_id', threadIds)
    .order('created_at', { ascending: false });

  if (messagesError) {
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: messagesError.message },
      { status: 500 },
    );
  }

  const lastMessageByThread = new Map<string, (typeof messages)[number]>();
  for (const message of messages ?? []) {
    if (!lastMessageByThread.has(message.thread_id)) {
      lastMessageByThread.set(message.thread_id, message);
    }
  }

  const participantByThread = new Map<string, typeof participants>();
  for (const participant of participants ?? []) {
    const list = participantByThread.get(participant.thread_id) ?? [];
    list.push(participant);
    participantByThread.set(participant.thread_id, list);
  }

  const enriched = (threads ?? []).map((thread) => ({
    ...thread,
    participants: participantByThread.get(thread.id) ?? [],
    lastMessage: lastMessageByThread.get(thread.id) ?? null,
  }));

  return NextResponse.json({ threads: enriched });
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createThreadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid form data',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (parsed.data.recipientId === user.id) {
    return NextResponse.json(
      { error: 'Cannot create thread with yourself' },
      { status: 400 },
    );
  }
  console.log(parsed);
  const { data: thread, error: threadError } = await supabase
    .from('dm_threads')
    .insert({ created_by: user.id })
    .select('id, created_at, created_by')
    .single();

  console.log(thread, threadError);
  if (threadError || !thread) {
    return NextResponse.json(
      { error: 'Failed to create thread', details: threadError?.message },
      { status: 500 },
    );
  }

  const { error: participantsError } = await supabase
    .from('dm_participants')
    .insert([
      { thread_id: thread.id, user_id: user.id },
      { thread_id: thread.id, user_id: parsed.data.recipientId },
    ]);

  if (participantsError) {
    return NextResponse.json(
      {
        error: 'Failed to add participants',
        details: participantsError.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ thread });
}
