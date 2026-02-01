'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Track } from '@/types';
import { type DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { BadgeCheck, ChevronRight, Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useCallback, useMemo } from 'react';

type FilterKey = 'name' | 'country';
type Checked = DropdownMenuCheckboxItemProps['checked'];

function uniq(values: string[]) {
  return [...new Set(values)];
}

function serializeSelected(params: URLSearchParams) {
  const keys: FilterKey[] = ['country', 'name'];
  return keys
    .map((k) => `${k}=${uniq(params.getAll(k)).slice().sort().join(',')}`)
    .join('&');
}

interface TrackSessionFilterProps {
  tracks: Promise<Track[]>;
}

export function TrackSessionFilter({ tracks }: TrackSessionFilterProps) {
  const data = use(tracks);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const selected = useMemo(() => {
    return {
      name: uniq(searchParams.getAll('name')),
      country: uniq(searchParams.getAll('country')),
    };
  }, [searchParams]);

  const computeAvailableFilterValues = useCallback(
    (state: { name?: string[]; country?: string[] }) => {
      const allTracks = data ?? [];

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
    [data],
  );

  const availableFilterValues = useMemo(() => {
    return computeAvailableFilterValues(selected);
  }, [computeAvailableFilterValues, selected]);

  // Visuell hint: vilka länder innehåller valt "name"?
  const countryHasSelectedName = useMemo(() => {
    const allTracks = data ?? [];
    const selectedNames = new Set(selected.name);

    // Om inget "name" valt: inga hints behövs
    if (selectedNames.size === 0) return new Set<string>();

    const matchingCountries = new Set<string>();
    for (const t of allTracks) {
      if (selectedNames.has(t.name)) matchingCountries.add(t.country);
    }
    return matchingCountries;
  }, [selected.name, data]);

  const navigateWithParams = useCallback(
    (params: URLSearchParams) => {
      params.sort();
      const qs = params.toString();

      replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [pathname, replace],
  );

  const updateFilterQuery = useCallback(
    (key: FilterKey, value: string, checked: Checked) => {
      const before = new URLSearchParams(searchParams.toString());
      const beforeSig = serializeSelected(before);

      const params = new URLSearchParams(searchParams.toString());
      const current = uniq(params.getAll(key));

      const next = !checked
        ? current.filter((v) => v !== value)
        : [...current, value];

      // write key
      params.delete(key);
      next.forEach((v) => params.append(key, v));

      if (key === 'country') {
        // prune names that no longer exist for selected countries
        const allowedNames = computeAvailableFilterValues({
          country: next,
        }).name;

        const currentNames = uniq(params.getAll('name'));
        const prunedNames = currentNames.filter((n) => allowedNames.has(n));

        params.delete('name');
        prunedNames.forEach((n) => params.append('name', n));
      }

      const afterSig = serializeSelected(params);
      if (afterSig !== beforeSig) {
        params.delete('page');
        params.delete('cursor');
      }

      navigateWithParams(params);
    },
    [computeAvailableFilterValues, navigateWithParams, searchParams],
  );

  const handleResetFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('name');
    params.delete('country');
    params.delete('page');
    params.delete('cursor');
    navigateWithParams(params);
  }, [navigateWithParams, searchParams]);

  type TrackFilterItem = {
    key: FilterKey;
    label: string;
    items: {
      active?: Checked;
      disabled?: boolean;
      value: string;
      // endast för visual hint i country-menyn
      matchesSelectedName?: boolean;
      getOppositeCount?: () => number;
    }[];
    getSelectedCount: () => number;
  };

  const getTrackFilters = (): TrackFilterItem[] => {
    if (!data) return [];

    const trackNames = [...new Set(data.map((track) => track.name))];
    const trackCountries = [...new Set(data.map((track) => track.country))];

    const getDisabledState = (item: string, key: FilterKey) => {
      if (key === 'name') {
        return (
          !availableFilterValues.name.has(item) && !selected.name.includes(item)
        );
      }
      return false;
    };

    const shouldHintCountries = selected.name.length > 0;

    return [
      {
        key: 'name',
        label: 'Track Name',
        items: trackNames.map((item) => ({
          value: item,
          active: selected.name.includes(item),
          disabled: getDisabledState(item, 'name'),
        })),
        getSelectedCount: () => selected.name.length,
      },
      {
        key: 'country',
        label: 'Country',
        items: trackCountries.map((item) => ({
          value: item,
          active: selected.country.includes(item),
          disabled: false,
          matchesSelectedName: shouldHintCountries
            ? countryHasSelectedName.has(item)
            : undefined,
          getOppositeCount: () => {
            if (!shouldHintCountries) return 0;
            const allTracks = data ?? [];
            const selectedNamesSet = new Set(selected.name);
            return allTracks.filter(
              (t) => t.country === item && selectedNamesSet.has(t.name),
            ).length;
          },
        })),
        getSelectedCount: () => selected.country.length,
      },
    ];
  };

  const trackFilters = getTrackFilters();

  return (
    <div className='flex gap-2 justify-between w-full md:w-auto'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm'>
            <Filter className='w-4 h-4 mr-2' />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-44' align='center'>
          <DropdownMenuLabel className='font-medium text-muted-foreground'>
            Filter by
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {trackFilters.map((queryObject) => (
              <DropdownMenuSub key={queryObject.key}>
                <DropdownMenuSubTrigger className='cursor-pointer focus:bg-accent/30! data-[state=open]:bg-accent/30!'>
                  <span className='flex w-full items-center gap-2'>
                    {queryObject.label}
                    {queryObject.getSelectedCount() > 0 && (
                      <Badge className='ml-auto text-xs' variant='secondary'>
                        {queryObject.getSelectedCount()}
                      </Badge>
                    )}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='w-fit'>
                    {queryObject.items.map((item) => {
                      const showCountryHint =
                        queryObject.key === 'country' &&
                        selected.name.length > 0;

                      const countryMismatch =
                        showCountryHint && item.matchesSelectedName === false;

                      const countryMatch =
                        showCountryHint && item.matchesSelectedName === true;

                      return (
                        <DropdownMenuCheckboxItem
                          key={item.value}
                          textValue={item.value}
                          onCheckedChange={(checked) =>
                            updateFilterQuery(
                              queryObject.key,
                              item.value,
                              checked,
                            )
                          }
                          disabled={item.disabled}
                          className={cn(
                            'group cursor-pointer focus:bg-primary/30!',
                            countryMismatch && 'text-muted-foreground',
                          )}
                          checked={item.active}>
                          <span
                            className={cn(
                              'flex w-full items-center gap-2',
                              item.disabled && 'text-muted-foreground',
                            )}>
                            <span
                              className={cn(countryMatch && 'text-foreground')}>
                              {item.value}
                            </span>
                            {countryMatch && item.getOppositeCount && (
                              <Badge
                                className='ml-auto text-xs'
                                variant='secondary'>
                                <BadgeCheck className='h-2 w-2' />
                                {item.getOppositeCount()}{' '}
                                {item.getOppositeCount() === 1
                                  ? 'track'
                                  : 'tracks'}
                              </Badge>
                            )}
                          </span>
                        </DropdownMenuCheckboxItem>
                      );
                    })}
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
        onClick={handleResetFilter}>
        View All
        <ChevronRight className='w-4 h-4 ml-1' />
      </Button>
    </div>
  );
}
