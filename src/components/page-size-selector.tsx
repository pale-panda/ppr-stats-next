import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { QueryOptions } from '@/db/types/db.types';
import { cn } from '@/lib/utils';
import {
  usePathname,
  useRouter,
  type ReadonlyURLSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageSizeSelectorProps {
  meta: QueryOptions;
  searchParams: ReadonlyURLSearchParams;
  className?: string;
}

const LIMIT_KEY = 'ppr-cookie-page-size-v1';
const LIMIT_EVENT = 'ppr:cookie-page-size-update';

function readLimitFromBrowser(): number | null {
  if (typeof window === 'undefined') return null;
  const limit = window.localStorage.getItem(LIMIT_KEY);
  return limit ? Number(limit) : null;
}

function writeLimitToBrowser(value: number) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(LIMIT_KEY, value.toString());

  const maxAgeDays = 7;
  document.cookie = `${LIMIT_KEY}=${value}; Path=/; Max-Age=${
    maxAgeDays * 24 * 60 * 60
  }; SameSite=Lax`;

  window.dispatchEvent(new Event(LIMIT_EVENT));
}

function nextLimit(current: number): number {
  if (current < 24) {
    return current * 2;
  }
  if (current < 60) {
    return current + 12;
  }
  return current + 24;
}

function generateLimits(start: number, max: number, currentLimit: number) {
  const limits = [start];
  let current = start;
  while (current < max) {
    current = nextLimit(current);
    limits.push(current);
  }

  limits.push(currentLimit);
  limits.push(max);
  limits.sort((a, b) => a - b);

  return Array.from(new Set(limits));
}

export function PageSizeSelector({
  meta,
  searchParams,
  className,
}: PageSizeSelectorProps) {
  const [limit, setLimit] = useState<number | null>(() =>
    readLimitFromBrowser()
  );

  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setLimit(readLimitFromBrowser());
    window.addEventListener(LIMIT_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(LIMIT_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const currentLimit =
    limit ??
    (searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : meta.limit);

  const limits = generateLimits(
    Math.min(meta.limit, 2),
    Math.max(meta.count, meta.limit <= meta.count ? meta.limit : meta.count),
    meta.limit
  );

  function handleSizeChange(newLimit: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('limit');
    params.delete('page');
    params.set('limit', newLimit.toString());
    params.sort();

    writeLimitToBrowser(newLimit);

    const qs = params.toString();
    replace(`${pathname}?${qs}`, {
      scroll: false,
    });
  }

  return (
    <div
      className={cn(
        'ml-auto flex flex-none items-center gap-2 justify-center w-full md:w-50 md:justify-end',
        className
      )}>
      <p className='text-sm font-medium text-nowrap'>Items per page</p>
      <Select
        value={currentLimit.toString()}
        onValueChange={(value) => handleSizeChange(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder={currentLimit.toString()} />
        </SelectTrigger>
        <SelectContent side='top'>
          {limits.map((limit) => {
            return (
              <SelectItem key={limit} value={`${limit}`}>
                {limit}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
