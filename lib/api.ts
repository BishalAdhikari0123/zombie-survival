const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
}

export const authApi = {
    register: (userData: any) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    login: (credentials: any) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
};

export const gameApi = {
    saveSession: (sessionData: { score: number; waveReached: number; duration: number }) =>
        apiRequest('/game/session', {
            method: 'POST',
            body: JSON.stringify(sessionData),
        }),
    getLeaderboard: (limit = 10) =>
        apiRequest(`/game/leaderboard?limit=${limit}`),
    getHistory: (limit = 20) =>
        apiRequest(`/game/history?limit=${limit}`),
};
