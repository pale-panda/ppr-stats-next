'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckIcon, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useFetchTracksQuery } from '@/state/services/tracks';
import { cn } from '@/lib/utils';

export function TrackSessionFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const baseQueryString = searchParams.toString();

  const [filterState, setFilterState] = useState<{ [key: string]: string[] }>(
    {}
  );

  const { data: tracks, isLoading, error } = useFetchTracksQuery({});

  const computeAvailableFilterValues = useCallback(
    (state: { [key: string]: string[] }) => {
      const allTracks = tracks ?? [];

      const matchesOtherFilters = (
        track: { name: string; country: string },
        ignoredKey: string
      ) => {
        for (const [key, values] of Object.entries(state)) {
          if (!values.length || key === ignoredKey) continue;

          if (key === 'name' && !values.includes(track.name)) return false;
          if (key === 'country' && !values.includes(track.country))
            return false;
        }
        return true;
      };

      const nameSet = new Set(
        allTracks
          .filter((track) => matchesOtherFilters(track, 'name'))
          .map((track) => track.name)
      );

      const countrySet = new Set(
        allTracks
          .filter((track) => matchesOtherFilters(track, 'country'))
          .map((track) => track.country)
      );

      return {
        name: nameSet,
        country: countrySet,
      };
    },
    [tracks]
  );

  const availableFilterValues = useMemo(() => {
    return computeAvailableFilterValues(filterState);
  }, [computeAvailableFilterValues, filterState]);

  const activeFilters = useMemo(() => {
    return Object.entries(filterState)
      .filter(([, values]) => values.length)
      .map(([key, values]) => `${key}:${values.join(',')}`)
      .join(';');
  }, [filterState]);

  useEffect(() => {
    const params = new URLSearchParams(baseQueryString);
    if (activeFilters) {
      params.set('query', activeFilters);
    } else {
      params.delete('query');
    }

    const nextQueryString = params.toString();
    const currentUrl = baseQueryString
      ? `${pathname}?${baseQueryString}`
      : pathname;
    const nextUrl = nextQueryString
      ? `${pathname}?${nextQueryString}`
      : pathname;

    if (nextUrl === currentUrl) {
      return;
    }

    replace(nextUrl);
  }, [activeFilters, baseQueryString, pathname, replace]);

  function updateFilterQuery(query: { [key: string]: string }) {
    const searchColumn = Object.keys(query)[0];
    const searchValue = query[searchColumn];
    setFilterState((prevState) => {
      const currentFilterValues = prevState[searchColumn] || [];

      const nextState: { [key: string]: string[] } = { ...prevState };
      if (currentFilterValues.includes(searchValue)) {
        const pruned = currentFilterValues.filter(
          (value) => value !== searchValue
        );
        if (pruned.length) {
          nextState[searchColumn] = pruned;
        } else {
          delete nextState[searchColumn];
        }
      } else {
        nextState[searchColumn] = [...currentFilterValues, searchValue];
      }

      const allowed = computeAvailableFilterValues(nextState);

      const pruneByAllowed = (key: 'name' | 'country') => {
        const current = nextState[key] ?? [];
        if (!current.length) return;
        const pruned = current.filter((value) => allowed[key].has(value));
        if (pruned.length) {
          nextState[key] = pruned;
        } else {
          delete nextState[key];
        }
      };

      pruneByAllowed('name');
      pruneByAllowed('country');

      return nextState;
    });
  }

  function handleResetFilter() {
    setFilterState({});
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading filters</div>;
  }

  type trackFilterItem = {
    key: string;
    label: string;
    items: {
      active?: boolean;
      disabled?: boolean;
      value: string;
    }[];
  };

  const getTrackFilters = (): trackFilterItem[] => {
    if (!tracks) return [];
    const trackNames = [...new Set(tracks.map((track) => track.name))];
    const trackCountries = [...new Set(tracks.map((track) => track.country))];

    return [
      {
        key: 'name',
        label: 'Track Name',
        items: trackNames.map((item) => ({
          value: item,
          active: filterState['name']?.includes(item),
          disabled:
            !availableFilterValues.name.has(item) &&
            !filterState['name']?.includes(item),
        })),
      },
      {
        key: 'country',
        label: 'Country',
        items: trackCountries.map((item) => ({
          value: item,
          active: filterState['country']?.includes(item),
          disabled:
            !availableFilterValues.country.has(item) &&
            !filterState['country']?.includes(item),
        })),
      },
    ];
  };

  const trackFilters = getTrackFilters();

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
          <DropdownMenuLabel className='font-medium text-muted-foreground'>
            Filter by
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {trackFilters.map((queryObject) => (
              <DropdownMenuSub key={queryObject.key}>
                <DropdownMenuSubTrigger>
                  {queryObject.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {queryObject.items.map((item) => (
                      <DropdownMenuItem
                        key={item.value}
                        textValue={item.value}
                        onClick={() => {
                          updateFilterQuery({
                            [queryObject.key]: item.value,
                          });
                        }}
                        disabled={item.disabled}>
                        <span
                          className={cn(
                            'flex items-center gap-2',
                            item.disabled && 'text-muted-foreground'
                          )}>
                          {item.active && (
                            <CheckIcon className='text-chart-1' />
                          )}
                          {item.value}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
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
