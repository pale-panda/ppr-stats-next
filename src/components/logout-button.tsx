'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';
import Link from 'next/link';

type LogoutButtonProps = {
  className?: string;
};

export const logoutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  const path = '/auth/login';

  return path;
};

export function LogoutButton({
  children,
  className,
}: PropsWithChildren<LogoutButtonProps>) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Link
      href='#'
      title='Logout'
      className={cn('', className)}
      onClick={() =>
        logoutAction().then((path) => {
          dispatch({ type: 'user/clearUser' });
          router.push(path);
        })
      }>
      {children}
    </Link>
  );
}
