import { defineConfig, devices } from '@playwright/test'

/*
 * Pruebas de la página armada (vite preview), como la sirve Vercel.
 * Chromium corre siempre. WebKit (el motor de Safari y de Chrome en iPhone) se suma con
 * PW_WEBKIT=1 después de `npx playwright install webkit`.
 */
const PORT = 4173
const includeWebKit = process.env['PW_WEBKIT'] === '1'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}/`,
    trace: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(includeWebKit ? [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }] : []),
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
})
