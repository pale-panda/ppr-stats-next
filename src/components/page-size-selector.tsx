import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PaginationMeta } from '@/types';
import { useRouter, type ReadonlyURLSearchParams } from 'next/navigation';

interface PageSizeSelectorProps {
  meta: PaginationMeta;
  searchParams: ReadonlyURLSearchParams;
  className?: string;
}

export function PageSizeSelector({
  meta,
  searchParams,
  className,
}: PageSizeSelectorProps) {
  const { replace } = useRouter();
  const currentSize = searchParams.get('size')
    ? Number(searchParams.get('size'))
    : meta.size;
  const sizes = [6, 12, 24, 36, 48, 60, 84, 108];

  function handleSizeChange(newSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('size');
    params.delete('page');

    params.sort();
    const qs = params.toString();
    replace(qs ? `?${qs}&size=${newSize}` : `?size=${newSize}`);
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
          {sizes.map((pageSize) => (
            <SelectItem
              key={pageSize}
              value={`${pageSize}`}
              disabled={pageSize > meta.totalCount}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
