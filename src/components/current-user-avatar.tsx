'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import React from 'react';

export const CurrentUserAvatar = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { user } = useAuth();

  const fullName: string = user?.user_metadata.full_name || '';
  const initials = fullName
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  return (
    <Avatar
      className={cn(
        'size-12 border border-border bg-muted hover:ring-1 hover:ring-ring/50 cursor-pointer',
        props.className
      )}>
      {user?.user_metadata.avatar_url && (
        <AvatarImage src={user.user_metadata.avatar_url} alt={initials} />
      )}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export const CurrentUserAvatarWithName = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
      <CurrentUserAvatar {...props} />
      <div className='flex flex-col p-1'>
        <span className='font-medium text-foreground truncate w-40'>
          {user?.user_metadata.full_name}
        </span>
        <span className='text-xs text-muted-foreground truncate w-40'>
          {user?.email}
        </span>
      </div>
    </div>
  );
};
