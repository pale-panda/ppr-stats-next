export const navLinksPublic = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const navLinksProtected = [
  { href: '/home', label: 'Home' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/tracks', label: 'Tracks' },
  { href: '/upload', label: 'Upload' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export const navLinks = {
  public: navLinksPublic,
  protected: navLinksProtected,
};
