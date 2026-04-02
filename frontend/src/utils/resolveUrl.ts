export const getApiOrigin = () => {
  const env = process.env.REACT_APP_API_ORIGIN;
  if (env) return env.replace(/\/$/, '');
  try {
    const u = new URL(window.location.href);
    const port = u.port === '3000' ? '8000' : u.port;
    return `${u.protocol}//${u.hostname}${port ? ':' + port : ''}`;
  } catch {
    return 'http://localhost:8000';
  }
};

export const resolveImageUrl = (src?: string | null): string | undefined => {
  if (!src) return undefined;
  const s = String(src).trim();
  if (!s) return undefined;

  if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;

  const origin = getApiOrigin();
  if (s.startsWith('/')) return origin + s;
  return origin + '/' + s;
};