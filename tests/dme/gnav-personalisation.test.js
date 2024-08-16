import { test, expect } from '@playwright/test';
import GnavPersonalisationPage from '../../selectors/dme/gnav-personalisation.page.js';
import SignInPage from '../../selectors/dme/signin.page.js';

let gnavPersonalisationPage;
let singInPage;
const gnav = require('../../features/dme/gnav-personalisation.spec.js');

const { features } = gnav;

test.describe('Validate Public GNav', () => {
  test.beforeEach(async ({ page }) => {
    gnavPersonalisationPage = new GnavPersonalisationPage(page);
    singInPage = new SignInPage(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL, browserName }) => {
    const { path } = features[0];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify public GNav is loaded in non-logged in scenarios', async () => {
      const publicGnav = await gnavPersonalisationPage.publicGnavHeader;
      await expect(publicGnav).toBeVisible();
      const joinNowButton = await gnavPersonalisationPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
      if ( browserName==='chromium' ) {
        const signInButton = await gnavPersonalisationPage.signInButton;
        await expect(signInButton).toBeVisible();
      }
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[1];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify protected GNav is loaded when member user is logged in', async () => {
      const protectedGnav = await gnavPersonalisationPage.protectedGnavHeader;
      await expect(protectedGnav).toBeVisible();
      const joinNowButton = await gnavPersonalisationPage.joinNowButton;
      await expect(joinNowButton).toBeHidden();
    });
  });

  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[2];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify public GNav is loaded when non-member user is logged in', async () => {
      const publicGnav = await gnavPersonalisationPage.publicGnavHeader;
      await expect(publicGnav).toBeVisible();
      const joinNowButton = await gnavPersonalisationPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
    });
  });

  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    const { data, path } = features[3];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeHidden();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
    });
  });

  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[4];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeHidden();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
    });
  });

  test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[5];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeVisible();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
      const registeredLevelBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementRegisteredId);
      await expect(registeredLevelBlock).toBeVisible();
      await expect(registeredLevelBlock).toHaveText(data.h3ElementRegisteredText);
      const resellerBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementResellerId);
      await expect(resellerBlock).toBeVisible();
      await expect(resellerBlock).toHaveText(data.h3ElementResellerText);
    });
  });

  test(`${features[6].name},${features[6].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[6];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeVisible();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
      const certifiedLevelBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementCertifiedId);
      await expect(certifiedLevelBlock).toBeVisible();
      await expect(certifiedLevelBlock).toHaveText(data.h3ElementCertifiedText);
      const resellerBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementResellerId);
      await expect(resellerBlock).toBeVisible();
      await expect(resellerBlock).toHaveText(data.h3ElementResellerText);
    });
  });

  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[7];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeVisible();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
      const goldLevelBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementGoldId);
      await expect(goldLevelBlock).toBeVisible();
      await expect(goldLevelBlock).toHaveText(data.h3ElementGoldText);
      const goldDistributorBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementGoldDistributorId);
      await expect(goldDistributorBlock).toBeVisible();
      await expect(goldDistributorBlock).toHaveText(data.h3ElementGoldDistributorText);
      const resellerBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementResellerId);
      await expect(resellerBlock).toBeVisible();
      await expect(resellerBlock).toHaveText(data.h3ElementResellerText);
    });
  });

  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[8];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeVisible();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
      const platinumFirstBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementPlatinumFirstId);
      await expect(platinumFirstBlock).toBeVisible();
      await expect(platinumFirstBlock).toHaveText(data.h3ElementPlatinumFirstText);
      const platinumSecondBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementPlatinumSecondId);
      await expect(platinumSecondBlock).toBeVisible();
      await expect(platinumSecondBlock).toHaveText(data.h3ElementPlatinumSecondText);
      const resellerBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementResellerId);
      await expect(resellerBlock).toBeVisible();
      await expect(resellerBlock).toHaveText(data.h3ElementResellerText);
    });
  });

  test(`${features[9].name},${features[9].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[9];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeHidden();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
      const platinumFirstBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementPlatinumFirstId);
      await expect(platinumFirstBlock).toBeVisible();
      await expect(platinumFirstBlock).toHaveText(data.h3ElementPlatinumFirstText);
      const platinumSecondBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementPlatinumSecondId);
      await expect(platinumSecondBlock).toBeVisible();
      await expect(platinumSecondBlock).toHaveText(data.h3ElementPlatinumSecondText);
      const platinumSecondDescriptionText = gnavPersonalisationPage.getParagraphByH3ElementId(data.h3ElementPlatinumSecondId, 1);
      await expect(platinumSecondDescriptionText).not.toHaveText(data.platinumSecondDescriptionText);
      const resellerBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementResellerId);
      await expect(resellerBlock).toBeVisible();
      await expect(resellerBlock).toHaveText(data.h3ElementResellerText);
    });
  });

  test(`${features[10].name},${features[10].tags}`, async ({ page, baseURL, context }) => {
    const { data, path } = features[10];
    await test.step('Go to CPP page', async () => {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Set partner_data cookie', async () => {
      await singInPage.addCookie(
        data.partnerData,
        `${baseURL}${path}`,
        context,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Verify personalised page', async () => {
      const welcomeMessage = await gnavPersonalisationPage.welcomeFirstName;
      await expect(welcomeMessage).toBeVisible();
      const memberStatus = gnavPersonalisationPage.getH3ElementById(data.h3ElementId);
      await expect(memberStatus).toBeVisible();
      await expect(memberStatus).toHaveText(data.h3ElementText);
      const distributorLevelBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementDistributorId);
      await expect(distributorLevelBlock).toBeVisible();
      await expect(distributorLevelBlock).toHaveText(data.h3ElementDistributorText);
      const goldDistributorBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementGoldDistributorId);
      await expect(goldDistributorBlock).toBeVisible();
      await expect(goldDistributorBlock).toHaveText(data.h3ElementGoldDistributorText);
      const resellerBlock = gnavPersonalisationPage.getH3ElementById(data.h3ElementResellerId);
      await expect(resellerBlock).toBeHidden();
    });
  });
});
