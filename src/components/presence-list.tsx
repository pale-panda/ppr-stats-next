'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';

const CHANNEL_NAME = 'presence:ppr-team';

type PresenceProfile = {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
};

function formatName(profile: PresenceProfile) {
  return `${profile.first_name} ${profile.last_name}`.trim();
}

export function PresenceList() {
  const [online, setOnline] = useState<PresenceProfile[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    let active = true;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('id', user.id)
        .single();

      const presencePayload: PresenceProfile = {
        user_id: user.id,
        first_name: profile?.first_name ?? 'Team',
        last_name: profile?.last_name ?? 'Member',
        avatar_url: profile?.avatar_url ?? null,
        role: profile?.role ?? 'user',
      };

      const presenceChannel = supabase.channel(CHANNEL_NAME, {
        config: { presence: { key: user.id } },
      });
      channel = presenceChannel;

      presenceChannel.on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState<PresenceProfile>();
        const list = Object.values(state).flat();
        if (active) {
          const deduped = new Map(list.map((item) => [item.user_id, item]));
          setOnline(Array.from(deduped.values()));
        }
      });

      presenceChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track(presencePayload);
        }
      });
    };

    init();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const sorted = useMemo(() => {
    return [...online].sort((a, b) => a.first_name.localeCompare(b.first_name));
  }, [online]);

  return (
    <Card className='bg-card border-border/50'>
      <CardHeader>
        <CardTitle className='text-foreground'>Team Online</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {sorted.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No one online yet.</p>
        ) : (
          sorted.map((profile) => (
            <div
              key={profile.user_id}
              className='flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 px-3 py-2'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage
                    src={profile.avatar_url ?? undefined}
                    alt={formatName(profile)}
                  />
                  <AvatarFallback>
                    {formatName(profile)
                      .split(' ')
                      .map((part) => part.charAt(0))
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-semibold text-foreground'>
                    {formatName(profile)}
                  </p>
                  <p className='text-xs text-muted-foreground'>Active now</p>
                </div>
              </div>
              <Badge variant='outline' className='text-[10px] uppercase'>
                {profile.role}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
