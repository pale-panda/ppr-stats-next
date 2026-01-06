export type AppRole = 'admin' | 'user';

export function assertAdmin(role: AppRole) {
  if (role !== 'admin') {
    const err = new Error('Forbidden: admin only');
    // valfritt: (err as any).status = 403;
    throw err;
  }
}

export function assertUser(role: AppRole) {
  if (role !== 'user' && role !== 'admin') {
    const err = new Error('Forbidden: user only');
    // valfritt: (err as any).status = 403;
    throw err;
  }
}

export function isAdmin(role: AppRole): boolean {
  return role === 'admin';
}

export function isUser(role: AppRole): boolean {
  return role === 'user' || role === 'admin';
}
