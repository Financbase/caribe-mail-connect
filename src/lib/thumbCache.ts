import { get, set, del, keys } from 'idb-keyval';

type Entry = { url: string; ts: number; filePath: string; placeholder?: string };

const STORE_PREFIX = 'docThumb:';
const META_KEY = 'docThumb:__meta';
const DEFAULT_MAX = 500; // LRU cap
const DEFAULT_TTL_MS = 55 * 60 * 1000; // 55m

type Meta = { max: number; ttl: number };

const getMeta = async (): Promise<Meta> => {
  const m = (await get(META_KEY)) as Meta | undefined;
  return m ?? { max: DEFAULT_MAX, ttl: DEFAULT_TTL_MS };
};

export async function setLimits(max = DEFAULT_MAX, ttl = DEFAULT_TTL_MS) {
  await set(META_KEY, { max, ttl } as Meta);
}

export async function getThumb(id: string): Promise<Entry | undefined> {
  const entry = (await get(STORE_PREFIX + id)) as Entry | undefined;
  if (!entry) return undefined;
  const { ttl } = await getMeta();
  if (Date.now() - entry.ts > ttl) {
    // expired
    await del(STORE_PREFIX + id);
    return undefined;
  }
  // touch for LRU
  entry.ts = Date.now();
  await set(STORE_PREFIX + id, entry);
  return entry;
}

export async function setThumb(id: string, entry: Entry) {
  const { max } = await getMeta();
  await evictIfNeeded(max);
  await set(STORE_PREFIX + id, { ...entry, ts: Date.now() });
}

export async function setPlaceholder(id: string, placeholder: string) {
  const existing = (await get(STORE_PREFIX + id)) as Entry | undefined;
  if (existing) {
    existing.placeholder = placeholder;
    existing.ts = Date.now();
    await set(STORE_PREFIX + id, existing);
  } else {
    await set(STORE_PREFIX + id, { url: '', ts: Date.now(), filePath: '', placeholder });
  }
}

export async function getPlaceholder(id: string): Promise<string | undefined> {
  const e = (await get(STORE_PREFIX + id)) as Entry | undefined;
  return e?.placeholder;
}

async function evictIfNeeded(max: number) {
  const allKeys = (await keys()) as IDBValidKey[];
  const docKeys = allKeys.filter(k => typeof k === 'string' && (k as string).startsWith(STORE_PREFIX)) as string[];
  if (docKeys.length < max) return;
  // LRU eviction by ts - fetch entries, sort, delete oldest
  const entries: { key: string; ts: number }[] = [];
  for (const k of docKeys) {
    const e = (await get(k)) as Entry | undefined;
    if (e) entries.push({ key: k, ts: e.ts || 0 });
  }
  entries.sort((a, b) => a.ts - b.ts);
  const toDelete = entries.slice(0, Math.max(0, entries.length - max + 1));
  await Promise.all(toDelete.map(e => del(e.key)));
}

export async function clearThumbs() {
  const allKeys = (await keys()) as IDBValidKey[];
  const docKeys = allKeys.filter(k => typeof k === 'string' && (k as string).startsWith(STORE_PREFIX)) as string[];
  await Promise.all(docKeys.map(k => del(k)));
}
