export function createApiClient({ fetcher = fetch, storage = sessionStorage } = {}) {
    const tokenKey = 'elee.staff.token';
    async function request(path, { method = 'GET', body, token = storage.getItem(tokenKey) } = {}) {
        let requestBody = body;
        const isExistingForm = typeof FormData !== 'undefined' && body instanceof FormData;
        const hasFile = body && !isExistingForm && Object.values(body).some(value => typeof File !== 'undefined' && value instanceof File);
        if (hasFile) {
            requestBody = new FormData();
            Object.entries(body).forEach(([key, value]) => {
                if (value == null) return;
                requestBody.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
            });
        }
        const isForm = typeof FormData !== 'undefined' && requestBody instanceof FormData;
        const response = await fetcher(`/api/${path}`, {
            method, headers: { Accept: 'application/json', ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            ...(body ? { body: isForm ? requestBody : JSON.stringify(requestBody) } : {}), signal: AbortSignal.timeout(15000),
        });
        const data = response.status === 204 ? null : await response.json();
        if (!response.ok) {
            const error = new Error(Object.values(data?.errors || {}).flat()[0] || data?.message || 'Request failed. Please retry.');
            error.status = response.status;
            throw error;
        }
        return data;
    }
    return {
        request, hasToken: () => Boolean(storage.getItem(tokenKey)), forget: () => storage.removeItem(tokenKey),
        async login(email, password) {
            const result = await request('staff/login', { method: 'POST', token: null, body: { email, password } });
            storage.setItem(tokenKey, result.token);
            return result.user;
        },
        async all(path) {
            const rows = [];
            for (let page = 1; ; page++) {
                const data = await request(`${path}${path.includes('?') ? '&' : '?'}page=${page}`);
                rows.push(...data.data);
                if (!data.links?.next) return rows;
            }
        },
    };
}
