import { test, expect } from '@playwright/test';
import AnnouncementsPage from '../../selectors/dme/announcements.page.js';
import SignInPage from '../../selectors/dme/signin.page.js';

let announcementsPage;
let signInPage;
const Announcements = require('../../features/dme/announcements.spec.js');

const { features } = Announcements;
const regionCases = features.slice(0, 2);

test.describe('Validate announcements block', () => {
  test.beforeEach(async ({ page }) => {
    announcementsPage = new AnnouncementsPage(page);
    signInPage = new SignInPage(page);
  });

  regionCases.forEach((feature) => {
    test(`${feature.name},${feature.tags}`, async ({ page }) => {
      await test.step('Go to Announcements page', async () => {
        await page.goto(`${feature.path}`);
        await page.waitForLoadState('domcontentloaded');
        await announcementsPage.signInButton.click();
      });

      await test.step('Sign in', async () => {
        await signInPage.signIn(page, `${feature.data.partnerLevel}`);
      });

      await test.step(`Verify card titled ${feature.data.announcementCardTitle} is present on page`, async () => {
        await announcementsPage.searchField.fill(`${feature.data.announcementCardTitle}`);
        const result = await announcementsPage.resultNumber.textContent();
        await expect(parseInt(result.split(' ')[0], 10)).toBe(1);
      });
    });
  });
});
