'use client';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Filter } from 'lucide-react';
import { SessionCard } from '@/components/session-card';
import { formatLapTime } from '@/lib/format-utils';
import { AppPagination } from '@/components/app-pagination';
import { type DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
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
import {
  PaginationMeta,
  Tracks,
  TrackSessionWithTrack,
} from '@/lib/types/response';
import { cn } from '@/lib/utils';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Checked = DropdownMenuCheckboxItemProps['checked'];

interface SessionSectionProps {
  sessionCount?: number;
  tracks: Tracks;
}

interface FilterState {
  country: (string | null)[];
  trackName: (string | null)[];
}

export function SessionSection({ tracks }: SessionSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterState>();

  useEffect(() => {
    console.log('filter to parse: ', filter);
  }, [filter]);

  const url = `/api/sessions?page=${currentPage}`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
  });

  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    tracks.forEach((track) => {
      if (track.country) {
        countrySet.add(track.country);
      }
    });
    return Array.from(countrySet);
  }, [tracks]);

  const trackNames = useMemo(() => {
    return tracks.map((track) => track.name);
  }, [tracks]);

  const availableTracks =
    filter && filter.country.length > 0
      ? tracks
          .filter((track) => filter.country.includes(track.country!))
          .map((track) => track.name)
      : trackNames;

  const availableCountries =
    filter && filter.trackName.length > 0
      ? tracks
          .filter((track) => filter.trackName.includes(track.name!))
          .map((track) => track.country!)
      : countries;

  function handleOnClick(value: string) {
    setFilter((prev) => ({
      trackName:
        prev && prev.trackName.length > 0 && prev.trackName.includes(trackName!)
          ? prev.trackName.filter((c) => c !== trackName)
          : prev && prev.trackName
          ? [...prev.trackName, trackName]
          : [trackName],
      country:
        prev && prev.country.length > 0 && prev.country.includes(trackName!)
          ? prev.country.filter((c) => c !== trackName)
          : prev && prev.country
          ? [...prev.country, trackName]
          : [trackName],
    }));
  }
  const sessions: TrackSessionWithTrack[] = data?.sessions || [];
  const meta: PaginationMeta = data?.meta || {
    currentPage: 1,
    nextPage: null,
    totalPages: 0,
    totalCount: 0,
    remainingCount: 0,
  };

  if (error) {
    return <div className='text-center py-12'>Failed to load sessions.</div>;
  }
  if (isLoading) {
    return <div className='text-center py-12'>Loading sessions...</div>;
  }

  return (
    <div>
      <section className='container mx-auto px-4 py-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
              Your Sessions
            </h2>
            <p className='text-muted-foreground mt-1'>
              Select a session to view detailed analytics
            </p>
          </div>
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
                        {availableCountries.length > 0 &&
                          availableCountries.map((country) => (
                            <DropdownMenuItem
                              key={country}
                              textValue={country ?? undefined}
                              onClick={() =>
                                setFilter((prev) => ({
                                  trackName:
                                    prev &&
                                    prev.trackName.length > 0 &&
                                    prev.trackName.includes(country!)
                                      ? prev.trackName.filter(
                                          (c) => c !== country
                                        )
                                      : prev && prev.trackName
                                      ? [...prev.trackName, country]
                                      : [country],
                                  country:
                                    prev &&
                                    prev.country.length > 0 &&
                                    prev.country.includes(country!)
                                      ? prev.country.filter(
                                          (c) => c !== country
                                        )
                                      : prev && prev.country
                                      ? [...prev.country, country]
                                      : [country],
                                }))
                              }
                              className={cn(
                                filter &&
                                  filter.country.includes(country!) &&
                                  'bg-destructive'
                              )}>
                              {country}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Track</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {availableTracks &&
                          availableTracks.map((trackName) => (
                            <DropdownMenuItem
                              key={trackName}
                              textValue={trackName}
                              onClick={() =>
                                setFilter((prev) => ({
                                  trackName:
                                    prev &&
                                    prev.trackName.length > 0 &&
                                    prev.trackName.includes(trackName!)
                                      ? prev.trackName.filter(
                                          (c) => c !== trackName
                                        )
                                      : prev && prev.trackName
                                      ? [...prev.trackName, trackName]
                                      : [trackName],
                                  country:
                                    prev &&
                                    prev.country.length > 0 &&
                                    prev.country.includes(trackName!)
                                      ? prev.country.filter(
                                          (c) => c !== trackName
                                        )
                                      : prev && prev.country
                                      ? [...prev.country, trackName]
                                      : [trackName],
                                }))
                              }
                              className={cn(
                                filter &&
                                  filter.trackName.includes(trackName) &&
                                  'bg-destructive'
                              )}>
                              {trackName}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem>
                    Calendar
                    <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sorting</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
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
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant='ghost'
              size='sm'
              className='text-primary'
              onClick={() => setFilter({ country: [], trackName: [] })}>
              View All
              <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </div>
        </div>
        {sessions.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No sessions found. Upload your first session to get started!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={`${session.session_type} Session`}
                track={session.track ? session.track.name : 'Unknown Track'}
                date={new Date(session.session_date).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )}
                laps={session.total_laps}
                bestLap={formatLapTime(session.best_lap_time_seconds)}
                status='completed'
                imageUrl={
                  session.track ? session.track.image_url : '/default-track.jpg'
                }
              />
            ))}
          </div>
        )}
        ;
      </section>
      <section className='pb-6'>
        <AppPagination
          meta={meta}
          onPageChange={setCurrentPage}
          className='border-2'
        />
      </section>
    </div>
  );
}
