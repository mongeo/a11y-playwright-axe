import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { outputFolder: 'reports/html', open: 'never' }], ['json', { outputFile: 'reports/results.json' }]],
  use: { trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.A11Y_URLS ? undefined : {
    command: 'npx http-server demo-site -p 4173 -s', url: 'http://localhost:4173/fixed/index.html', reuseExistingServer: true,
  },
});
