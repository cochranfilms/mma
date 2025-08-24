/* Lightweight helpers around Vercel KV (Upstash Redis). */

type SlotsState = { month: string; remaining: number };

export function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export function getKvKey(): string {
  return process.env.SLOTS_KV_KEY || 'mma:slots';
}

export async function kvGetSlots(): Promise<SlotsState | null> {
  if (!isKvConfigured()) return null;
  // Import on demand to avoid bundling when not configured
  const { kv } = await import('@vercel/kv');
  const raw = await kv.get<string | null>(getKvKey());
  if (!raw) return null;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (
      parsed &&
      typeof (parsed as any).remaining === 'number' &&
      typeof (parsed as any).month === 'string'
    ) {
      return parsed as SlotsState;
    }
  } catch {}
  return null;
}

export async function kvSetSlots(next: SlotsState): Promise<void> {
  if (!isKvConfigured()) return;
  const { kv } = await import('@vercel/kv');
  await kv.set(getKvKey(), JSON.stringify(next));
}


