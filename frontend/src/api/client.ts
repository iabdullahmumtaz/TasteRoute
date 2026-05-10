const base = import.meta.env.VITE_API_URL || 'http://localhost:6020';
const API = base.endsWith('/api') ? base : `${base.replace(/\/$/, '')}/api`;

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tasteroute_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText);
  return data as T;
}
