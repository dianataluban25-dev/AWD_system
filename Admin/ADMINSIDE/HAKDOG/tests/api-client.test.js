import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient } from '../resources/js/api-client.js';

const storage = () => { const data = new Map(); return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }; };
test('Admin login token is used for every page of actual records', async () => {
    const calls = [];
    const api = createApiClient({ storage: storage(), fetcher: async (url, options) => {
        calls.push([url, options]);
        if (url.endsWith('/staff/login')) return new Response(JSON.stringify({ token: 'test-token', user: { is_admin: true } }));
        return new Response(JSON.stringify({ data: [{ order_number: url.endsWith('page=1') ? 'FIRST' : 'SECOND' }], links: { next: url.endsWith('page=1') ? '/api/staff/orders?page=2' : null } }));
    } });
    await api.login('admin@example.test', 'test-only-password');
    const rows = await api.all('staff/orders?active=1');
    assert.deepEqual(rows.map(row => row.order_number), ['FIRST', 'SECOND']);
    assert.equal(calls[1][1].headers.Authorization, 'Bearer test-token');
    assert.equal(calls[2][0], '/api/staff/orders?active=1&page=2');
    api.forget(); assert.equal(api.hasToken(), false);
});
test('Server validation and unavailable data propagate without sample fallback', async () => {
    const api = createApiClient({ storage: storage(), fetcher: async () => new Response(JSON.stringify({ errors: { stock: ['Insufficient stock.'] } }), { status: 422 }) });
    await assert.rejects(api.all('staff/products'), { message: 'Insufficient stock.', status: 422 });
});
