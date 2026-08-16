const store = new Map();
const DEFAULT_TTL_MS = 30_000;

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

export function setCache(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache() {
  store.clear();
}

export function buildListCacheKey({ page, limit, titulo, descricao }) {
  return `noticias:list:${page}:${limit}:${titulo ?? ''}:${descricao ?? ''}`;
}
