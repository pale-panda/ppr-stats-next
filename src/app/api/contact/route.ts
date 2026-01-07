import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(320),
  message: z.string().trim().min(10).max(2000),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid form data',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Intentionally no side effects yet (email/DB integration can be added later).
  return NextResponse.json({ ok: true });
}
