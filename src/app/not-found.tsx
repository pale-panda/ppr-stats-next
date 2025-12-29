'use client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// En enkel lista att söka i. Fyll på med era riktiga routes.
type PageIndexItem = {
  title: string;
  href: string;
  keywords?: string[];
};

const PAGES: PageIndexItem[] = [
  { title: 'Home', href: '/', keywords: ['home', 'start'] },
  {
    title: 'Contact',
    href: '/contact',
    keywords: ['contact', 'support', 'help'],
  },
  {
    title: 'Sessions',
    href: '/sessions',
    keywords: ['sessions', 'track', 'dashboard'],
  },
  { title: 'Analytics', href: '/analytics', keywords: ['analytics', 'stats'] },
  {
    title: 'Upload Session',
    href: '/upload',
    keywords: ['upload', 'session', 'telemetry', 'data'],
  },
  {
    title: 'Tracks',
    href: '/tracks',
    keywords: ['tracks', 'circuits', 'racecourses'],
  },
  {
    title: 'User Settings',
    href: '/user/settings',
    keywords: ['user', 'settings', 'preferences', 'avatar', 'change'],
  },
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function scorePage(page: PageIndexItem, qRaw: string) {
  const q = normalize(qRaw);
  if (!q) return 0;

  const title = normalize(page.title);
  const href = normalize(page.href);
  const keywords = (page.keywords ?? []).map(normalize);

  // Snabb, deterministisk rankning (högre = bättre)
  if (title === q) return 100;
  if (href === q) return 95;
  if (title.startsWith(q)) return 80;
  if (href.startsWith(q)) return 75;
  if (title.includes(q)) return 60;
  if (href.includes(q)) return 55;
  if (keywords.some((k) => k === q)) return 50;
  if (keywords.some((k) => k.includes(q))) return 40;

  return 0;
}

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputId = 'page-search-input';

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return PAGES.map((p) => ({ page: p, score: scorePage(p, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.page);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // "/" fokuserar sökfältet (så länge man inte redan skriver i ett input)
      if (e.key === '/') {
        const el = e.target as HTMLElement | null;
        const tag = el?.tagName?.toLowerCase();
        const isTyping =
          tag === 'input' ||
          tag === 'textarea' ||
          (el as HTMLElement)?.isContentEditable;

        if (!isTyping) {
          e.preventDefault();
          document.getElementById(inputId)?.focus();
        }
      }

      // Esc rensar sökningen om vi står i sökfältet
      if (e.key === 'Escape') {
        const active = document.activeElement as HTMLElement | null;
        if (active?.id === inputId) setQuery('');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const onSubmitBestMatch = () => {
    if (results.length > 0) router.push(results[0].href);
  };

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>
          <div className='mb-4 flex items-center gap-4'>
            <h1 className='text-4xl font-light mask-radial-to-90%'>404</h1>
            <Separator orientation='vertical' className='min-h-16' />
            <h2 className='text-2xl font-semibold'>Page Not Found</h2>
          </div>
        </EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className='w-full sm:w-3/4'>
          <InputGroup>
            <InputGroupInput
              id={inputId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmitBestMatch();
                if (e.key === 'Escape') setQuery('');
              }}
              placeholder='Try searching for pages...'
              autoComplete='off'
              aria-label='Search pages'
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>

          {normalize(query) && (
            <div className='mt-2 rounded-md border bg-background p-2'>
              {results.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No matching pages.
                </p>
              ) : (
                <ul className='flex flex-col gap-1 text-left'>
                  {results.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className='block rounded px-2 py-1 text-sm hover:bg-muted'
                        title={r.title}>
                        <div className='grid grid-cols-1 md:grid-cols-2'>
                          <span className='font-medium'>{r.title}</span>
                          <span className='ml-4 text-muted-foreground'>
                            {r.href}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <EmptyDescription>
          Need help?{' '}
          <Link href='/contact' title='Contact support'>
            Contact support
          </Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
