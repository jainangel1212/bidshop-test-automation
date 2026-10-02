import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  testMatch: '**/*.spec.ts',

  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'http://localhost:4000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  }
});