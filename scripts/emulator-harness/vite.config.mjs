// LOCAL TEST ONLY: runs the real app with src/firebase.js swapped for the emulator version. No service worker.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const swap = () => ({
    name: 'swap-firebase',
    enforce: 'pre',
    load(id) { if (id === '\0pwa-stub') return 'export const registerSW = () => () => {};'; return null; },
    async resolveId(source, importer) {
        if (source === 'virtual:pwa-register') return '\0pwa-stub';
        if (!importer || !/firebase(\.js)?$/.test(source) || !/^(\.\.?\/)+firebase(\.js)?$/.test(source)) return null;
        const r = await this.resolve(source, importer, { skipSelf: true });
        if (r && r.id.split(path.sep).join('/').endsWith('/src/firebase.js')) return path.join(here, 'firebase.emu.js');
        return null;
    },
});
export default defineConfig({ root, plugins: [swap(), react()], server: { port: 5198, strictPort: true, host: '127.0.0.1' }, cacheDir: path.join(here, '.vite-cache') });
