const RAW_API_BASE =
  (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ||
  'http://backend:8000/api';

export const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(buildApiUrl(path), init);
}

export async function apiJson<T = any>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  return response.json() as Promise<T>;
}