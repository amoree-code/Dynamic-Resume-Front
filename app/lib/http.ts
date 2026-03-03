const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function attemptRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refreshToken');
      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      return null;
    }

    const data = await res.json();
    const newToken: string = data.accessToken;
    localStorage.setItem('access_token', newToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];
    return newToken;
  } finally {
    isRefreshing = false;
  }
}

export async function get<T>(path: string): Promise<T> {
  let token = getToken();
  let res = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    token = await attemptRefresh();
    if (!token) throw new Error('401 Unauthorized');
    res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function mutate<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  let token = getToken();
  if (!token) throw new Error('Not authenticated');

  const makeRequest = (t: string) =>
    fetch(`${API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${t}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await makeRequest(token);

  if (res.status === 401) {
    const newToken = await attemptRefresh();
    if (!newToken) throw new Error('401 Unauthorized');
    res = await makeRequest(newToken);
  }

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204 || res.headers.get('content-length') === '0')
    return undefined as T;
  return res.json();
}

export { API };
