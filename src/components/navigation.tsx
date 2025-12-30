'use client';

import { Separator } from '@/components/ui/separator';
import { type NavItems } from '@/lib/data/nav-links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  navLinks: NavItems;
}

export function Navigation({ navLinks }: NavigationProps) {
  const pathname = usePathname();
  return (
    <nav
      role='navigation'
      className='hidden md:flex items-center justify-between gap-0 md:gap-2 lg:gap-6'>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'flex flex-col group h-16 px-2 lg:px-4 py-5.5 text-sm font-medium hover:text-foreground transition-colors hover:bg-linear-to-b hover:from-transparent hover:to-muted/30',
            pathname.startsWith(link.href)
              ? 'bg-linear-to-b from-transparent to-muted/30 text-foreground transition-colors'
              : 'text-muted-foreground'
          )}
          aria-current={pathname.startsWith(link.href) ? 'page' : undefined}>
          {link.label}
          <Separator className='w-max mt-5 h-px opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-radial group-hover:from-primary/80 group-hover:to-transparent' />
        </Link>
      ))}
    </nav>
  );
}
