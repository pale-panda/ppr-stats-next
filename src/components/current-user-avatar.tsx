'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

export const CurrentUserAvatar = () => {
  const userState = useSelector((state: RootState) => state.user);

  const fullName: string = userState.user?.user_metadata.full_name || '';
  const initials = fullName
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  return (
    <Avatar>
      {userState.user?.user_metadata.avatar_url && (
        <AvatarImage
          src={userState.user.user_metadata.avatar_url}
          alt={initials}
        />
      )}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export const CurrentUserAvatarWithName = () => {
  const userState = useSelector((state: RootState) => state.user);

  if (!userState.isAuthenticated) return null;

  return (
    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
      <CurrentUserAvatar />
      <div className='flex flex-col p-1'>
        <span className='font-medium text-foreground truncate w-40'>
          {userState.user?.user_metadata.full_name}
        </span>
        <span className='text-xs text-muted-foreground truncate w-40'>
          {userState.user?.email}
        </span>
      </div>
    </div>
  );
};
