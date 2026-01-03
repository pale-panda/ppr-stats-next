import type { MetaOptions, QueryFilters } from '@/db/types/db.types.js';
import { DEFAULT_PAGE_LIMIT } from '@/lib/data/constants';
import type { SearchParams } from '@/types';

type InFilter = {
  column: string;
  values?: (string | number)[] | string | number | undefined;
};

type QueryWithIn<T> = {
  in: (column: string, values: (string | number)[]) => T;
  eq: (column: string, value: string | number | (string | number)[]) => T;
};

export function applyInFilters<T extends QueryWithIn<T>>(
  q: T,
  filters: InFilter[]
) {
  for (const f of filters) {
    const vals = Array.isArray(f.values)
      ? f.values.filter(Boolean)
      : f.values !== undefined && f.values !== null
      ? [f.values]
      : [];

    if (vals.length > 0) {
      q = q.in(f.column, vals);
    }
  }

  return q;
}

export function asArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export function asString(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export function asInt(
  v: string | string[] | undefined,
  fallback: number
): number {
  const s = asString(v);
  const n = s ? Number(s) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function normalizeSort(
  v: string | string[] | undefined
): MetaOptions['sort'] {
  const s = asString(v);
  if (s) return s;
  return 'id';
}

export function normalizeDir(
  v: string | string[] | undefined
): MetaOptions['dir'] {
  const s = asString(v)?.toLowerCase();
  return s === 'asc' ? 'asc' : 'desc';
}

export function normalizeQuery(searchParams: SearchParams): {
  filters: QueryFilters;
  options: MetaOptions;
} {
  const queryObject: { filters: QueryFilters; options: MetaOptions } = {
    filters: {},
    options: {
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
      count: 0,
      sort: 'id',
      dir: 'desc',
    },
  };

  Object.keys(searchParams).forEach((key) => {
    const value = searchParams[key];
    if (Array.isArray(value)) {
      searchParams[key] = value.filter((v) => v !== undefined && v !== null);
    }
    if (value === undefined || value === null || value === '') {
      delete searchParams[key];
    }
  });

  queryObject.filters = searchParams ? { ...searchParams } : {};

  queryObject.options.page = asInt(searchParams.page, 1);
  queryObject.options.limit = asInt(searchParams.limit, DEFAULT_PAGE_LIMIT);
  queryObject.options.sort = normalizeSort(searchParams.sort);
  queryObject.options.dir = normalizeDir(searchParams.dir);

  return {
    filters: queryObject.filters,
    options: queryObject.options,
  };
}
