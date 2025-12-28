'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckIcon, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

      // Country är "master" och ska inte påverkas av name
      const countrySet = new Set(allTracks.map((t) => t.country));

      // Name ska bero på country (om country-filter är valt)
      const selectedCountries = state.country ?? [];
      const filteredByCountry =
        selectedCountries.length > 0
          ? allTracks.filter((t) => selectedCountries.includes(t.country))
          : allTracks;

      const nameSet = new Set(filteredByCountry.map((t) => t.name));

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

      // toggle value
      if (currentFilterValues.includes(searchValue)) {
        const pruned = currentFilterValues.filter((v) => v !== searchValue);
        if (pruned.length) nextState[searchColumn] = pruned;
        else delete nextState[searchColumn];
      } else {
        nextState[searchColumn] = [...currentFilterValues, searchValue];
      }

      if (searchColumn === 'country') {
        delete nextState.name;
      }

      const allowed = computeAvailableFilterValues(nextState);

      // prune ONLY name based on selected country
      const currentNames = nextState.name ?? [];
      if (currentNames.length) {
        const prunedNames = currentNames.filter((v) => allowed.name.has(v));
        if (prunedNames.length) nextState.name = prunedNames;
        else delete nextState.name;
      }

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
    getSelectedCount: () => number;
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
        getSelectedCount: () => {
          return filterState['name']?.length || 0;
        },
      },
      {
        key: 'country',
        label: 'Country',
        items: trackCountries.map((item) => ({
          value: item,
          active: filterState['country']?.includes(item),
          disabled: false,
        })),
        getSelectedCount: () => {
          return filterState['country']?.length || 0;
        },
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
                <DropdownMenuSubTrigger className='cursor-pointer focus:bg-accent/30! data-[state=open]:bg-accent/30!'>
                  {queryObject.getSelectedCount() > 0 && (
                    <Badge
                      className='h-5 min-w-5 rounded-full px-1 font-mono tabular-nums'
                      variant='destructive'>
                      {queryObject.getSelectedCount()}
                    </Badge>
                  )}
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
                        disabled={item.disabled}
                        className='group cursor-pointer focus:bg-primary/30!'>
                        <span
                          className={cn(
                            'flex items-center gap-2',
                            item.disabled && 'text-muted-foreground'
                          )}>
                          {item.active && (
                            <div className='group-focus:bg-muted size-6 rounded-lg flex items-center justify-center bg-primary/10'>
                              <CheckIcon className='text-chart-1' />
                            </div>
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
