import type {
  AppStatsFilters,
  LapFilters,
  ProfileFilters,
  SessionFilters,
  TrackFilters,
} from '@/types';

export type MetaOptions = {
  page: number;
  limit: number;
  count: number;
  sort: string;
  dir: 'asc' | 'desc';
};

export type QueryFilters = {
  search?: string;
} & TrackFilters &
  AppStatsFilters &
  ProfileFilters &
  SessionFilters &
  LapFilters & { [key: string]: string | string[] | number[] | undefined };

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type MetaData = {
  filters: QueryFilters;
  meta: MetaOptions;
};
