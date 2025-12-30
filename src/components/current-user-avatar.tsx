'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface CurrentUserAvatarProps {
  user: User;
  className?: string;
}

export const CurrentUserAvatar = ({
  user,
  className,
}: CurrentUserAvatarProps) => {
  if (!user) return null;

  const fullName = user.fullName || 'Pale Panda';
  const initials = fullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className={cn('size-12 rounded-md', className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={initials} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export const CurrentUserAvatarWithName = ({
  user,
  className,
}: CurrentUserAvatarProps) => {
  if (!user) return null;

  return (
    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
      <CurrentUserAvatar user={user} className={className} />
      <div className='flex flex-col p-1 w-40'>
        <span className='font-medium text-foreground truncate w-40'>
          {user.fullName}
        </span>
        <span className='text-xs text-muted-foreground truncate w-40'>
          {user.email}
        </span>
      </div>
    </div>
  );
};
