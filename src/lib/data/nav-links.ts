import {
  ContactIcon,
  HomeIcon,
  MapIcon,
  UploadCloud,
  UserPen,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  altHref?: string;
};

export type NavItems = NavItem[];

export const navLinksPublic: NavItems = [
  { href: '/', label: 'Home', title: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About', title: 'About Us', icon: UserPen },
  {
    href: '/contact',
    label: 'Contact',
    title: 'Contact Us',
    icon: ContactIcon,
  },
];

export const navLinksProtected: NavItems = [
  { href: '/home', label: 'Home', title: 'Home', icon: HomeIcon, altHref: '/' },
  {
    href: '/sessions',
    label: 'Sessions',
    title: 'Racing Sessions',
    icon: UserPen,
    altHref: '/dashboard',
  },
  { href: '/tracks', label: 'Tracks', title: 'Racing Tracks', icon: MapIcon },
  {
    href: '/upload',
    label: 'Upload',
    title: 'Upload Telemetry',
    icon: UploadCloud,
  },
  {
    href: '/leaderboard',
    label: 'Leaderboard',
    title: 'Leaderboard',
    icon: UploadCloud,
  },
];

export interface NavLinks {
  public: NavItems;
  protected: NavItems;
}

export const navLinks: NavLinks = {
  public: navLinksPublic,
  protected: navLinksProtected,
};

type NavLinkHierarchyItem = {
  id: string;
  parent: string | null;
  href: string;
  label: string;
  title: string;
};

export const navLinksHierarchyPublic: NavLinkHierarchyItem[] = [
  {
    id: 'home',
    parent: null,
    href: '/',
    label: 'Home',
    title: 'Home',
  },
  {
    id: 'about',
    parent: 'home',
    href: '/about',
    label: 'About',
    title: 'About Us',
  },
  {
    id: 'contact',
    parent: 'home',
    href: '/contact',
    label: 'Contact',
    title: 'Contact Us',
  },
  {
    id: 'legal',
    parent: 'home',
    href: '/legal',
    label: 'Legal',
    title: 'Legal Information',
  },
  {
    id: 'privacy',
    parent: 'legal',
    href: '/legal/privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
  },
  {
    id: 'terms',
    parent: 'legal',
    href: '/legal/terms-of-service',
    label: 'Terms of Service',
    title: 'Terms of Service',
  },
];

export const navLinksHierarchyProtected: NavLinkHierarchyItem[] = [
  {
    id: 'home',
    parent: null,
    href: '/home',
    label: 'Home',
    title: 'Home',
  },
  {
    id: 'sessions',
    parent: 'home',
    href: '/sessions',
    label: 'Sessions',
    title: 'Racing Sessions',
  },
  {
    id: 'sessions-track',
    parent: 'sessions',
    href: '/sessions/:slug',
    label: 'Sessions',
    title: 'Racing Sessions by Track',
  },
  {
    id: 'sessions-month',
    parent: 'sessions-track',
    href: '/sessions/:slug/:yearMonth',
    label: 'Sessions',
    title: 'Racing Sessions by Month',
  },
  {
    id: 'sessions-id',
    parent: 'sessions-month',
    href: '/sessions/:slug/:yearMonth/:sessionId',
    label: 'Session Details',
    title: 'Racing Session Details',
  },
  {
    id: 'tracks',
    parent: 'home',
    href: '/tracks',
    label: 'Tracks',
    title: 'Racing Tracks',
  },
  {
    id: 'tracks-slug',
    parent: 'tracks',
    href: '/tracks/:slug',
    label: 'Track Details',
    title: 'Racing Track Details',
  },
  {
    id: 'analytics',
    parent: 'home',
    href: '/analytics',
    label: 'Analytics',
    title: 'Analyze Telemetry',
  },
  {
    id: 'upload',
    parent: 'home',
    href: '/upload',
    label: 'Upload',
    title: 'Upload Telemetry',
  },
  {
    id: 'leaderboard',
    parent: 'home',
    href: '/leaderboard',
    label: 'Leaderboard',
    title: 'Leaderboard',
  },
];

export interface NavLinkHierarchies {
  public: NavLinkHierarchyItem[];
  protected: NavLinkHierarchyItem[];
}

export const navLinksHierarchy: NavLinkHierarchies = {
  public: navLinksHierarchyPublic,
  protected: navLinksHierarchyProtected,
};
