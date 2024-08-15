// @ts-check
const { devices } = require('@playwright/test');

const envs = require('../envs/envs.js');

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: '../tests/dme',
  outputDir: '../test-results',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : 3,
  /* Reporter to use. */
  reporter: process.env.CI
    ? [['github'], ['list'], ['../utils/reporters/base-reporter.js']]
    : [['html', { outputFolder: 'test-html-results' }], ['list'], ['../utils/reporters/base-reporter.js']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 60000,

    trace: 'on-first-retry',
    baseURL: 'https://tijana-test--dme-partners--adobecom.hlx.live',
    //     baseURL: process.env.PR_BRANCH_LIVE_URL_GH
    //       && !process.env.PR_BRANCH_LIVE_URL_GH.includes('stage--dme-partners')
    //       ? process.env.PR_BRANCH_LIVE_URL_GH : envs['@dme_stage'],
    extraHTTPHeaders: { authorization: `token ${process.env.HLX_API_KEY}` },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dme-live-chromium',
      use: {
        ...devices['Desktop Chrome'],
        bypassCSP: true,
        launchOptions: {
          args: ['--disable-web-security', '--disable-gpu'],
        },
      },
    },

    {
      name: 'dme-live-firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'dme-live-webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};
module.exports = config;
