'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

type LogoutButtonProps = {
  variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
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
  ...props
}: PropsWithChildren & LogoutButtonProps) {
  const router = useRouter();

  return (
    <Button
      className={cn(className)}
      {...props}
      onClick={() => logoutAction().then((path) => router.push(path))}>
      {children}
    </Button>
  );
}
