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

interface PageSizeSelectorProps {
  meta: QueryOptions;
  searchParams: ReadonlyURLSearchParams;
  className?: string;
}

export function PageSizeSelector({
  meta,
  searchParams,
  className,
}: PageSizeSelectorProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const currentLimit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : meta.limit;

  const limits = [6, 12, 24, 36, 48, 60, 84, 108];

  function handleSizeChange(newLimit: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('limit');
    params.delete('page');
    params.set('limit', newLimit.toString());
    params.sort();
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
            return limit <= meta.count || limit === currentLimit ? (
              <SelectItem key={limit} value={`${limit}`}>
                {limit}
              </SelectItem>
            ) : null;
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
