import {
  ContactIcon,
  HomeIcon,
  MapIcon,
  UploadCloud,
  UserPen,
} from 'lucide-react';

export type NavItems = {
  href: string;
  label: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[];

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
  { href: '/home', label: 'Home', title: 'Home', icon: HomeIcon },
  {
    href: '/sessions',
    label: 'Sessions',
    title: 'Racing Sessions',
    icon: UserPen,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    title: 'Analyze Telemetry',
    icon: UserPen,
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
