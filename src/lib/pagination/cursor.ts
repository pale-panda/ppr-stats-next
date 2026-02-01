export type Cursor = { t: string; id: string };

export function encodeCursor(cursor: Cursor): string {
  const json = JSON.stringify(cursor);
  return Buffer.from(json).toString('base64url');
}

export function decodeCursor(value: string | null | undefined): Cursor | null {
  if (!value) return null;
  try {
    const json = Buffer.from(value, 'base64url').toString('utf-8');
    const parsed = JSON.parse(json) as Partial<Cursor>;
    if (!parsed?.t || !parsed?.id) return null;
    return { t: parsed.t, id: parsed.id };
  } catch {
    return null;
  }
}
