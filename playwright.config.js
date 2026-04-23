import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3456',
    headless: true
  },
  webServer: {
    command: 'npx serve public -l 3456',
    port: 3456,
    reuseExistingServer: true
  }
});
