export type AppRole = 'admin' | 'team' | 'user';

export function assertAdmin(role: AppRole) {
  if (role !== 'admin') {
    const err = new Error('Forbidden: admin only');
    // valfritt: (err as any).status = 403;
    throw err;
  }
}

export function assertUser(role: AppRole) {
  if (role !== 'user' && role !== 'admin' && role !== 'team') {
    const err = new Error('Forbidden: user only');
    // valfritt: (err as any).status = 403;
    throw err;
  }
}

export function assertTeam(role: AppRole) {
  if (role !== 'admin' && role !== 'team') {
    const err = new Error('Forbidden: team only');
    // valfritt: (err as any).status = 403;
    throw err;
  }
}

export function isAdmin(role: AppRole): boolean {
  return role === 'admin';
}

export function isTeam(role: AppRole): boolean {
  return role === 'admin' || role === 'team';
}

export function isUser(role: AppRole): boolean {
  return role === 'user' || role === 'admin' || role === 'team';
}
