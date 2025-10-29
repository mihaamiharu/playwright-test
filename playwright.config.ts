import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Point to the 'tests' folder
  testDir: './tests',

  // Run tests in parallel for speed
  fullyParallel: true,

  // Fail on CI if you accidentally left a test.only
  forbidOnly: !!process.env.CI,

  // This is our QA strategy: 2 retries on CI, 0 locally
  retries: process.env.CI ? 2 : 0,

  // Use 50% of CPU cores on CI
  workers: process.env.CI ? '50%' : undefined,

  // Use the HTML reporter
  reporter: 'html',

  use: {
    // This is our key debugging strategy
    trace: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});