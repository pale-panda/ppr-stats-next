import {
  BadgeCheck,
  Bell,
  LogIn,
  LogOut,
  Settings,
  UserCircle2,
  UserRoundPlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  CurrentUserAvatar,
  CurrentUserAvatarWithName,
} from '@/components/current-user-avatar';
import { logoutAction } from '@/components/logout-button';
import Link from 'next/link';

interface HeaderActionsProps {
  isAuthenticated?: boolean;
}

export function HeaderActions({ isAuthenticated }: HeaderActionsProps) {
  return (
    <div className='flex items-center justify-end gap-2 md:min-w-38'>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              className='p-0 rounded-full  hover:ring-ring active:ring-ring focus-visible:ring-1 focus-visible:ring-offset-0'>
              <CurrentUserAvatar />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={'bottom'}
            align='start'
            sideOffset={4}>
            <DropdownMenuLabel className='px-1 py-0 font-normal'>
              <CurrentUserAvatarWithName />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutAction}>
              <LogOut />
              Log out
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
              <DropdownMenuItem>
                <Link
                  href='/auth/login'
                  className='flex items-center gap-2 w-full'>
                  <LogIn />
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/auth/signup'
                  className='flex items-center gap-2 w-full'>
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
