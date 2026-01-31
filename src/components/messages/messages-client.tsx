'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
};

type Thread = {
  id: string;
  created_at: string;
  created_by: string;
  participants: { thread_id: string; user_id: string; profiles: Profile }[];
  lastMessage: {
    id: string;
    body: string;
    created_at: string;
    sender_id: string;
  } | null;
};

type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

function displayName(profile: Profile | null) {
  if (!profile) return 'Unknown';
  return `${profile.first_name} ${profile.last_name}`.trim();
}

export function MessagesClient() {
  const { data, mutate } = useSWR('/api/messages/threads', fetcher);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageBody, setMessageBody] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isStartingId, setIsStartingId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const threads = useMemo(
    () => (data?.threads ?? []) as Thread[],
    [data?.threads],
  );
  const resolvedThreadId = activeThreadId ?? threads[0]?.id ?? null;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
    supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .order('first_name', { ascending: true })
      .then(({ data: profilesData }) => {
        setProfiles((profilesData ?? []) as Profile[]);
      });
  }, []);

  const activeThread = threads.find((thread) => thread.id === resolvedThreadId);

  const { data: messagesData, mutate: mutateMessages } = useSWR(
    resolvedThreadId
      ? `/api/messages/threads/${resolvedThreadId}/messages`
      : null,
    fetcher,
  );

  const messages = (messagesData?.messages ?? []) as Message[];

  const otherParticipants = useMemo(() => {
    return (
      activeThread?.participants
        .map((participant) => participant.profiles)
        .filter((profile): profile is Profile =>
          Boolean(profile && profile.id !== currentUserId),
        ) ?? []
    );
  }, [activeThread, currentUserId]);

  const threadByRecipient = useMemo(() => {
    const map = new Map<string, string>();
    for (const thread of threads) {
      for (const participant of thread.participants ?? []) {
        if (participant.user_id !== currentUserId) {
          map.set(participant.user_id, thread.id);
        }
      }
    }
    return map;
  }, [threads, currentUserId]);

  const filteredProfiles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return profiles
      .filter((profile) => profile.id !== currentUserId)
      .filter((profile) => {
        if (!term) return true;
        const name = `${profile.first_name} ${profile.last_name}`.toLowerCase();
        return name.includes(term);
      })
      .slice(0, 8);
  }, [profiles, currentUserId, searchTerm]);

  async function handleSend() {
    if (!messageBody.trim() || !resolvedThreadId) return;

    const res = await fetch(
      `/api/messages/threads/${resolvedThreadId}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: messageBody }),
      },
    );

    if (res.ok) {
      setMessageBody('');
      await mutateMessages();
      await mutate();
    }
  }

  async function handleCreateThread(targetId: string) {
    if (!targetId) return;
    setIsStartingId(targetId);

    const res = await fetch('/api/messages/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: targetId }),
    });

    setIsStartingId(null);

    if (res.ok) {
      const payload = await res.json().catch(() => null);
      const newThreadId = payload?.thread?.id as string | undefined;
      if (newThreadId) {
        setActiveThreadId(newThreadId);
      }
      await mutate();
    }
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
      <Card className='bg-card border-border/50'>
        <CardHeader>
          <CardTitle className='text-foreground'>Direct Messages</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <p className='text-xs text-muted-foreground'>Start a new DM</p>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Search teammates...'
            />
            <div className='space-y-2'>
              {filteredProfiles.length === 0 ? (
                <p className='text-xs text-muted-foreground'>
                  No teammates found.
                </p>
              ) : (
                filteredProfiles.map((profile) => {
                  const existingThreadId = threadByRecipient.get(profile.id);
                  return (
                    <div
                      key={profile.id}
                      className='flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 px-3 py-2'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={profile.avatar_url ?? undefined}
                            alt={displayName(profile)}
                          />
                          <AvatarFallback>
                            {displayName(profile)
                              .split(' ')
                              .map((part) => part.charAt(0))
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-semibold text-foreground'>
                            {displayName(profile)}
                          </p>
                          <Badge variant='outline' className='text-[10px]'>
                            {profile.role}
                          </Badge>
                        </div>
                      </div>
                      {existingThreadId ? (
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => setActiveThreadId(existingThreadId)}>
                          Open
                        </Button>
                      ) : (
                        <Button
                          size='sm'
                          onClick={() => handleCreateThread(profile.id)}
                          disabled={isStartingId === profile.id}>
                          Start
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <ScrollArea className='h-[420px] pr-2'>
            <div className='space-y-3'>
              {threads.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No conversations yet.
                </p>
              ) : (
                threads.map((thread) => {
                  const participants = thread.participants
                    .map((p) => p.profiles)
                    .filter((profile): profile is Profile =>
                      Boolean(profile && profile.id !== currentUserId),
                    );
                  const title =
                    participants.length > 0
                      ? participants.map(displayName).join(', ')
                      : 'Direct message';
                  return (
                    <button
                      key={thread.id}
                      className={cn(
                        'w-full text-left rounded-lg border border-border/50 px-3 py-2 transition',
                        thread.id === resolvedThreadId
                          ? 'bg-muted/60'
                          : 'hover:bg-muted/40',
                      )}
                      onClick={() => setActiveThreadId(thread.id)}>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='text-sm font-semibold text-foreground'>
                          {title}
                        </p>
                        {thread.lastMessage && (
                          <span className='text-[10px] text-muted-foreground'>
                            {formatDistanceToNow(
                              new Date(thread.lastMessage.created_at),
                              { addSuffix: true },
                            )}
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-muted-foreground line-clamp-1'>
                        {thread.lastMessage?.body ?? 'Say hello 👋'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className='bg-card border-border/50'>
        <CardHeader>
          <CardTitle className='text-foreground'>Conversation</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {activeThread ? (
            <>
              <div className='flex flex-wrap items-center gap-2'>
                {otherParticipants.map((profile) => (
                  <Badge key={profile.id} variant='outline'>
                    {displayName(profile)}
                  </Badge>
                ))}
              </div>
              <ScrollArea className='h-[420px] pr-2'>
                <div className='space-y-4'>
                  {messages.map((message) => {
                    const isMine = message.sender_id === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          isMine ? 'justify-end' : 'justify-start',
                        )}>
                        {!isMine && (
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={
                                activeThread.participants.find(
                                  (p) => p.user_id === message.sender_id,
                                )?.profiles.avatar_url ?? undefined
                              }
                            />
                            <AvatarFallback>
                              {activeThread.participants
                                .find((p) => p.user_id === message.sender_id)
                                ?.profiles.first_name.charAt(0)
                                .toUpperCase() ?? 'T'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg border border-border/60 px-3 py-2 text-sm',
                            isMine
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted/40',
                          )}>
                          <p>{message.body}</p>
                          <p className='mt-1 text-[10px] text-muted-foreground'>
                            {formatDistanceToNow(new Date(message.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className='space-y-2'>
                <Textarea
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  placeholder='Write a message...'
                  className='min-h-[100px]'
                />
                <div className='flex justify-end'>
                  <Button onClick={handleSend} disabled={!messageBody.trim()}>
                    Send message
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className='flex h-[420px] items-center justify-center text-sm text-muted-foreground'>
              Select a conversation to start chatting.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
