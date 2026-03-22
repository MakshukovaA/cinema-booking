type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export default class ApiClient {
  private base: string;

  constructor(baseUrl?: string) {
    this.base = baseUrl ?? (process.env.REACT_APP_API_URL || '/api');
  }

  private async request<T>(
    path: string,
    method: HttpMethod = 'GET',
    body?: any,
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = path.startsWith('/api')
      ? path
      : `${this.base}${path.startsWith('/') ? path : '/' + path}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    const contentType = res.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message = (data as any)?.detail ?? res.statusText ?? 'Ошибка сети';
      const err: any = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data as T;
  }

  get<T>(path: string, token?: string) {
    return this.request<T>(path, 'GET', undefined, token);
  }

  post<T>(path: string, body?: any, token?: string) {
    return this.request<T>(path, 'POST', body, token);
  }

  put<T>(path: string, body?: any, token?: string) {
    return this.request<T>(path, 'PUT', body, token);
  }

  delete<T>(path: string, token?: string) {
    return this.request<T>(path, 'DELETE', undefined, token);
  }

  patch<T>(path: string, body?: any, token?: string) {
    return this.request<T>(path, 'PATCH', body, token);
  }
}