import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';

interface AppBreadcrumbProps {
  firstLinks?: { href: string; label: string; isActive: boolean }[];
  dropdownLinks?: { href: string; label: string; isActive: boolean }[];
  lastLinks?: { href: string; label: string; isActive: boolean }[];
}

export function AppBreadcrumb({ ...props }: AppBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {props.firstLinks &&
          props.firstLinks.map((link, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}

        {props.dropdownLinks && props.dropdownLinks.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center gap-1'>
                  <BreadcrumbEllipsis className='size-4' />
                  <span className='sr-only'>Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  {props.dropdownLinks.map((link, index) => (
                    <DropdownMenuItem asChild key={index}>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {props.lastLinks &&
          props.lastLinks.map((link, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {link.isActive ? (
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
