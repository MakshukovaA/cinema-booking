const RAW_API_BASE = 'http://localhost:8000';

export const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  return fetch(buildApiUrl(path), {
    credentials: 'same-origin',
    cache: 'no-store',
    ...init,
    headers,
  });
}

export async function apiJson<T = any>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  if (response.status === 304) {
    throw new Error('API 304: Not Modified (кеш отключён, но сервер вернул 304)');
  }

  return response.json() as Promise<T>;
}