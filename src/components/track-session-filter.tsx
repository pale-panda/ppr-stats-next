'use client';
import { ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import {
  setFilter,
  resetFilter,
} from '@/state/reducers/track-sessions/track-session.reducer';

export function TrackSessionFilter() {
  const trackSessionState = useSelector(
    (state: RootState) => state.trackSession
  );
  const dispatch = useDispatch<AppDispatch>();

  function handleSearch(filterColumn: string, searchTerm: string) {
    dispatch(setFilter({ [filterColumn]: searchTerm }));
  }

  function handleResetFilter() {
    dispatch(resetFilter());
  }

  return (
    <div className='flex gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm'>
            <Filter className='w-4 h-4 mr-2' />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start'>
          <DropdownMenuLabel className='font-semibold text-muted-foreground'>
            Filter by:
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Country</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    textValue='Sweden'
                    onClick={(e) => {
                      handleSearch('country', e.currentTarget.textContent);
                    }}>
                    Sweden
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    textValue='Finland'
                    onClick={(e) => {
                      handleSearch('country', e.currentTarget.textContent);
                    }}>
                    Finland
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Track</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    textValue='Mantorp Park'
                    onClick={(e) => {
                      handleSearch('track.name', e.currentTarget.textContent);
                    }}>
                    Mantorp Park
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    textValue='Kemora'
                    onClick={(e) => {
                      handleSearch('track.name', e.currentTarget.textContent);
                    }}>
                    Kemora
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator />
          <DropdownMenuLabel>Sorting</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Email</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>*/}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant='ghost'
        size='sm'
        className='text-primary'
        onClick={() => handleResetFilter()}>
        View All
        <ChevronRight className='w-4 h-4 ml-1' />
      </Button>
    </div>
  );
}
