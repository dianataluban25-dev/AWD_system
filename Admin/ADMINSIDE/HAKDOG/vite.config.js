import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
export default defineConfig({
    base: '/admin-assets/', plugins: [{
        name: 'legacy-design-only', enforce: 'pre',
        load(id) {
            if (!id.includes('/legacy/') || !id.includes('?raw')) return null;
            const source = readFileSync(id.split('?')[0], 'utf8')
                .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<tbody\b([^>]*)>[\s\S]*?<\/tbody>/gi, '<tbody$1></tbody>');
            return `export default ${JSON.stringify(source)};`;
        },
    }, react()],
    server: { proxy: { '/api': 'http://127.0.0.1:8000' } },
    build: {
        outDir: fileURLToPath(new URL('../../../backend/public/admin-assets', import.meta.url)), emptyOutDir: true,
        rollupOptions: { output: { manualChunks: id => id.includes('node_modules') ? 'vendor' : undefined } },
    },
});
