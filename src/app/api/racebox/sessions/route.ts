import * as cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const BASE = 'https://www.racebox.pro';

const EXPORT_FORM =
  'csvFormat=custom&timeFormat=utc&speedFormat=kph&altitudeFormat=m&newLineFormat=crlf&extendedHeader=1&addLapSectorEventsInHeader=1&includeEntryExit=1&bikeMode=on';

async function fetchWithCookies(
  jar: CookieJar,
  url: string,
  init?: RequestInit
): Promise<Response> {
  const cookie = await jar.getCookieString(url);
  const headers = new Headers(init?.headers);

  if (cookie) headers.set('cookie', cookie);
  if (!headers.has('user-agent')) {
    headers.set('user-agent', 'Mozilla/5.0 (compatible; NextjsRaceboxBot/1.0)');
  }

  const res = await fetch(url, {
    ...init,
    headers,
    redirect: 'manual',
  });

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    // Kan innehålla flera cookies i samma header
    const cookies = setCookie.split(/,(?=[^;]+=[^;]+)/);
    for (const c of cookies) {
      await jar.setCookie(c, url);
    }
  }

  // Följ redirects manuellt
  if ([301, 302, 303, 307, 308].includes(res.status)) {
    const location = res.headers.get('location');
    if (!location) return res;

    const nextUrl = location.startsWith('http')
      ? location
      : new URL(location, url).toString();

    const nextMethod = (res.status === 303 ? 'GET' : init?.method) ?? 'GET';
    const nextInit: RequestInit = {
      ...init,
      method: nextMethod,
    };

    if (
      nextMethod.toUpperCase() === 'GET' ||
      nextMethod.toUpperCase() === 'HEAD'
    ) {
      // Body on GET/HEAD triggers runtime errors when following redirects.
      delete nextInit.body;
    }

    return fetchWithCookies(jar, nextUrl, nextInit);
  }

  return res;
}

async function login(jar: CookieJar, email: string, password: string) {
  const body = new URLSearchParams({ email, password }).toString();

  const res = await fetchWithCookies(jar, `${BASE}/webapp/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'text/html,application/xhtml+xml',
      origin: BASE,
      referer: `${BASE}/webapp/login`,
    },
    body,
  });

  if (!res.ok) throw new Error(`Login misslyckades (${res.status})`);
}

function extractSessionPaths(html: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();

  $("a[href^='/webapp/session/']").each((_, el) => {
    const href = $(el).attr('href');
    if (href) links.add(href);
  });

  // ex: /webapp/session/68c6d581d3005b2d7407e182
  return [...links];
}

function extractSessionId(sessionPath: string): string | null {
  const m = sessionPath.match(/^\/webapp\/session\/([a-f0-9]{24})$/i);
  return m?.[1] ?? null;
}

async function fetchAllSessionPaths(jar: CookieJar, pageNo?: string) {
  const all = new Set<string>();
  let page = pageNo ? parseInt(pageNo) || 1 : 1;

  while (true) {
    if (pageNo && page > parseInt(pageNo)) break;

    const url = `${BASE}/webapp/sessions?page=${page}`;
    const res = await fetchWithCookies(jar, url, {
      method: 'GET',
      headers: { accept: 'text/html' },
    });

    const html = await res.text();
    if (!res.ok)
      throw new Error(`Fel vid sessions page ${page}: ${res.status}`);

    const paths = extractSessionPaths(html);
    const before = all.size;
    paths.forEach((p) => all.add(p));

    // stop när sidan inte ger nya
    if (paths.length === 0 || all.size === before) break;

    page += 1;
    if (page > 500) break; // skydd
  }

  return [...all];
}

async function downloadCsvForSession(
  jar: CookieJar,
  sessionPath: string,
  outDir: string
) {
  const sessionId = extractSessionId(sessionPath);
  if (!sessionId)
    return { sessionPath, ok: false, reason: 'Invalid session path' };

  const exportUrl = `${BASE}${sessionPath}/export/csv`;

  const res = await fetchWithCookies(jar, exportUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'text/csv,*/*',
      origin: BASE,
      referer: `${BASE}${sessionPath}`,
    },
    body: EXPORT_FORM,
  });

  if (!res.ok) {
    const snippet = await res.text().catch(() => '');
    return {
      sessionId,
      sessionPath,
      ok: false,
      reason: `HTTP ${res.status}`,
      snippet: snippet.slice(0, 200),
    };
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const filename = `${sessionId}.csv`;
  const filepath = path.join(outDir, filename);

  await fs.writeFile(filepath, buf);
  return { sessionId, sessionPath, ok: true, filepath, bytes: buf.length };
}

// enkel concurrency-limit
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const idx = i++;
        if (idx >= items.length) break;
        results[idx] = await fn(items[idx], idx);
      }
    }
  );

  await Promise.all(workers);
  return results;
}

export async function GET(_req: NextRequest) {
  const page = _req.nextUrl.searchParams.get('page') ?? undefined;
  const email = process.env.RACEBOX_EMAIL;
  const password = process.env.RACEBOX_PASSWORD;

  if (!email || !password) {
    return Response.json(
      { error: 'Saknar env vars: RACEBOX_EMAIL och/eller RACEBOX_PASSWORD' },
      { status: 500 }
    );
  }

  const jar = new CookieJar();
  await login(jar, email, password);

  const sessionPaths = await fetchAllSessionPaths(jar, page);

  // tmp dir (cross-platform)
  const outDir = path.join(os.tmpdir(), 'racebox-csv');
  await fs.mkdir(outDir, { recursive: true });

  // Ladda ner med concurrency (justera vid behov)
  const results = await mapLimit(sessionPaths, 5, (p) =>
    downloadCsvForSession(jar, p, outDir)
  );

  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  return Response.json({
    outDir,
    totalSessionsFound: sessionPaths.length,
    downloaded: ok.length,
    failed: failed.length,
    // om du inte vill returnera massa data, ta bort dessa:
    failures: failed.slice(0, 20),
    sampleFiles: ok.slice(0, 10),
  });
}
