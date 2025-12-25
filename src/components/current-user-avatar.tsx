'use client';

import { useCurrentUserImage } from '@/hooks/use-current-user-image';
import { useCurrentUserName } from '@/hooks/use-current-user-name';
import { useCurrentUserAuth } from '@/hooks/use-current-user-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CurrentUserAvatar = () => {
  const profileImage = useCurrentUserImage();
  const name = useCurrentUserName();
  const initials = name
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  return (
    <Avatar>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export const CurrentUserAvatarWithName = () => {
  const { isAuthenticated, currentUser, currentProfile } = useCurrentUserAuth();

  if (!isAuthenticated) return null;

  return (
    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
      <CurrentUserAvatar />
      <div className='flex flex-col p-1'>
        <span className='font-medium text-foreground truncate w-40'>
          {currentProfile?.full_name}
        </span>
        <span className='text-xs text-muted-foreground truncate w-40'>
          {currentUser?.email}
        </span>
      </div>
    </div>
  );
};
