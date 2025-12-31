'use client';

import {
  CurrentUserAvatar,
  CurrentUserAvatarWithName,
} from '@/components/current-user-avatar';
import { LogoutButton } from '@/components/logout-button';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types';
import {
  BadgeCheck,
  Bell,
  LogIn,
  LogOut,
  Settings,
  UserCircle2,
  UserRoundPlus,
} from 'lucide-react';
import Link from 'next/link';

interface HeaderActionsProps {
  user: User | null;
}

export function HeaderActions({ user }: HeaderActionsProps) {
  return (
    <div className='flex items-center justify-end gap-4'>
      <ModeToggle className='cursor-pointer' />
      {user && user.isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='focus-visible:border-0 focus:border-0 rounded-full'>
            <CurrentUserAvatar user={user} className='size-10 rounded-full' />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-fit max-w-75 rounded-lg mx-6'
            side={'bottom'}
            align='center'
            sideOffset={10}>
            <DropdownMenuLabel className='px-1 py-0 font-normal'>
              <CurrentUserAvatarWithName
                user={user}
                className='size-14 rounded-xl hover:ring-0 cursor-default'
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/user/account'>
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/user/settings'>
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/user/notifications'>
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='dark:focus:bg-primary/50 cursor-pointer'
              asChild>
              <LogoutButton className='flex flex-row w-full items-center gap-2'>
                <LogOut />
                Log out
              </LogoutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              className='p-0 rounded-full  hover:ring-ring active:ring-ring focus-visible:ring-1 focus-visible:ring-offset-0'>
              <UserCircle2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={'bottom'}
            align='center'
            sideOffset={4}>
            <DropdownMenuLabel className='font-normal text-muted-foreground'>
              Sign in to your account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className='dark:focus:bg-primary/50 cursor-pointer'
                asChild>
                <Link href='/auth/login'>
                  <LogIn />
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='dark:focus:bg-primary/50 cursor-pointer'
                asChild>
                <Link href='/auth/signup'>
                  <UserRoundPlus />
                  Sign up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
