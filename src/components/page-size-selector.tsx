import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { QueryOptions } from '@/db/types/db.types';
import { cn } from '@/lib/utils';
import { useRouter, type ReadonlyURLSearchParams } from 'next/navigation';

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
  const currentSize = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : meta.limit;

  const limits = [6, 12, 24, 36, 48, 60, 84, 108];

  function handleSizeChange(newLimit: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('limit');
    params.delete('page');

    params.sort();
    const qs = params.toString();
    replace(qs ? `?${qs}&limit=${newLimit}` : `?limit=${newLimit}`);
  }

  return (
    <div
      className={cn(
        'ml-auto flex flex-none items-center gap-2 justify-center w-full md:w-50 md:justify-end',
        className
      )}>
      <p className='text-sm font-medium text-nowrap'>Items per page</p>
      <Select
        value={currentSize.toString()}
        onValueChange={(value) => handleSizeChange(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder={currentSize.toString()} />
        </SelectTrigger>
        <SelectContent side='top'>
          {limits.map((limit) => (
            <SelectItem
              key={limit}
              value={`${limit}`}
              disabled={limit > meta.count}>
              {limit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
