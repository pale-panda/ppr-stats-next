import { BadgeCheck, Bell, LogOut, Settings } from 'lucide-react';
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

export function HeaderActions() {
  return (
    <div className='flex items-center gap-2'>
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
    </div>
  );
}
