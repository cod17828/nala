import { test, expect } from '@playwright/test';
import SignInPage from '../../selectors/dx/signin.page.js';

let signInPage;
const signin = require('../../features/dx/signin.spec.js');

const { features } = signin;

const sppSubmittedInReview = {
  partnerLevel: 'spp-submitted-in-review:',
  status: 'submitted in review',
  expectedLandingPageURL: '/solutionpartners/error/submitted-in-review',
};

const sppDeactivated = {
  partnerLevel: 'spp-deactivated:',
  status: 'contact inactive',
  expectedLandingPageURL: '/solutionpartners/error/contact-inactive',
};

const sppExpired = {
  partnerLevel: 'spp-expired:',
  status: 'account expired',
  expectedLandingPageURL: '/solutionpartners/error/account-expired',
};

test.describe('Validate news block', () => {
  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
  });

  function getEmail(imsCredentials, partnerLevel) {
    return imsCredentials.split(partnerLevel)[1].split(';')[0];
  }

  async function signIn(page, partnerLevel) {
    await signInPage.IMSEmailPage.waitFor({ state: 'visible', timeout: 10000 });
    const email = getEmail(process.env.IMS_EMAIL, partnerLevel);
    await signInPage.emailField.fill(email);
    await signInPage.emailPageContinueButton.click();
    await page.waitForLoadState('domcontentloaded');
    await signInPage.IMSPasswordPage.waitFor({ state: 'visible', timeout: 10000 });
    await signInPage.passwordField.fill(process.env.IMS_PASS);
    await signInPage.passwordPageContinueButton.click();
    await page.waitForLoadState('domcontentloaded');
  }

  async function verifyLandingPageAfterLogin({ page, baseURL, partnerLevel, status, expectedLandingPageURL }) {
    await test.step('Go to public home page', async () => {
      await page.goto(`${baseURL}${features[8].path}`);
      await page.waitForLoadState('domcontentloaded');
      await signInPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signIn(page, partnerLevel);
    });

    await test.step(`Verify redirection to ${status} page after successful login`, async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url()).toContain(expectedLandingPageURL);
    });
  }

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to public home page', async () => {
      await page.goto(`${baseURL}${features[0].path}`);
      await page.waitForLoadState('domcontentloaded');
      await signInPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signIn(page, 'spp-platinum:');
    });

    await test.step('Verify redirection to protected home page after successful login', async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('/solutionpartners/drafts/automation/regression/protected-home');
    });

    await test.step('Logout', async () => {
      await signInPage.profileIconButton.click();
      await signInPage.logoutButton.click();
    });

    // Test passes up until this point - expected to fail after because redirection after logout is not configured

    await test.step('Verify redirection to public home page after logout', async () => {
      await signInPage.signInButton.waitFor({ state: 'visible', timeout: 10000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('/solutionpartners/drafts/automation/regression/public-page');
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to public home page', async () => {
      await page.goto(`${baseURL}${features[1].path}`);
      await page.waitForLoadState('domcontentloaded');
      const joinNowButton = await signInPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
      const explorePastArticlesButton = await signInPage.explorePastArticles;
      await expect(explorePastArticlesButton).toBeVisible();
      const newsletterLink = await signInPage.newsletterLink;
      await expect(newsletterLink).toBeHidden();
      await signInPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signIn(page, 'spp-gold:');
    });

    await test.step('Verify restricted news after successful login', async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('/solutionpartners/drafts/automation/regression/partner-news');
      const joinNowButton = await signInPage.joinNowButton;
      await expect(joinNowButton).toBeHidden(); // this step fails - the logged in user can still see the Join now
      const explorePastArticlesButton = await signInPage.explorePastArticles;
      await expect(explorePastArticlesButton).toBeVisible();
      const newsletterLink = await signInPage.newsletterLink;
      await expect(newsletterLink).toBeVisible();
    });

    await test.step('Logout', async () => {
      await signInPage.profileIconButton.click();
      await signInPage.logoutButton.click();
    });

    await test.step('Verify public news page after logout', async () => {
      await signInPage.signInButton.waitFor({ state: 'visible', timeout: 10000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('/solutionpartners/drafts/automation/regression/partner-news');
      const joinNowButton = await signInPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
      const explorePastArticlesButton = await signInPage.explorePastArticles;
      await expect(explorePastArticlesButton).toBeVisible();
      const newsletterLink = await signInPage.newsletterLink;
      await expect(newsletterLink).toBeHidden();
    });
  });

  test(`${features[2].name},${features[2].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Go to stage.adobe.com', async () => {
      const url = `${features[2].baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInPage.signInButtonStageAdobe.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with spp community user', async () => {
      await signIn(page, 'spp-community:');
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
    });

    await test.step('Open public page in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${baseURL}${features[2].path}`);
      const newTabPage = new SignInPage(newTab);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain('/solutionpartners/drafts/automation/regression/protected-home');
    });
  });

  test(`${features[3].name},${features[3].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Go to stage.adobe.com', async () => {
      const url = `${features[3].baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInPage.signInButtonStageAdobe.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with spp platinum user', async () => {
      await signIn(page, 'spp-platinum:');
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
    });

    await test.step('Open restricted page in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${baseURL}${features[3].path}`);
      const newTabPage = new SignInPage(newTab);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain('/solutionpartners/drafts/automation/regression/protected-home');
    });
  });

  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to public home page', async () => {
      await page.goto(`${baseURL}${features[4].path}`);
      await page.waitForLoadState('domcontentloaded');
      await signInPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signIn(page, 'tpp-platinum:');
    });

    await test.step('Verify redirection to contact not found page after successful login', async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('/solutionpartners/error/contact-not-found');
    });

    await test.step('Logout', async () => {
      await signInPage.profileIconButton.click();
      await signInPage.logoutButton.click();
    });

    await test.step('Go to public news page', async () => {
      await page.goto(`${baseURL}${features[4].newsPath}`);
      await page.waitForLoadState('domcontentloaded');
      await signInPage.signInButton.click();
    });

    await test.step('Sign in', async () => {
      await signIn(page, 'tpp-platinum:');
    });

    await test.step('Verify redirection to contact not found page after successful login', async () => {
      await signInPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('/solutionpartners/error/contact-not-found');
    });
  });

  test(`${features[5].name},${features[5].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Go to stage.adobe.com', async () => {
      const url = `${features[5].baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInPage.signInButtonStageAdobe.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with tpp platinum user', async () => {
      await signIn(page, 'tpp-platinum:');
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
    });

    await test.step('Open protected home page in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${baseURL}${features[5].path}`);
      const newTabPage = new SignInPage(newTab);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain('/solutionpartners/error/contact-not-found');
      const signInButton = await signInPage.signInButton;
      await expect(signInButton).toBeHidden();
    });
  });

  test(`${features[6].name},${features[6].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Go to stage.adobe.com', async () => {
      const url = `${features[6].baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await signInPage.signInButtonStageAdobe.click();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Sign in with tpp platinum user', async () => {
      await signIn(page, 'tpp-platinum:');
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 15000 });
    });

    await test.step('Open public page in a new tab', async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${baseURL}${features[6].path}`);
      const newTabPage = new SignInPage(newTab);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain('/solutionpartners/error/contact-not-found');
      const signInButton = await newTabPage.signInButton;
      await expect(signInButton).toBeHidden();
      const joinNowButton = await newTabPage.joinNowButton;
      await expect(joinNowButton).toBeVisible();
    });
  });

  test(`${features[7].name},${features[7].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to protected home page', async () => {
      await page.goto(`${baseURL}${features[7].path}`);
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain('https://auth-stg1.services.adobe.com/');
    });
  });

  test(`${features[8].name},${features[8].tags}`, async ({ page, baseURL }) => {
    await verifyLandingPageAfterLogin({
      page,
      baseURL,
      partnerLevel: sppSubmittedInReview.partnerLevel,
      status: sppSubmittedInReview.status,
      expectedLandingPageURL: sppSubmittedInReview.expectedLandingPageURL,
    });
  });

  test(`${features[9].name},${features[9].tags}`, async ({ page, baseURL }) => {
    await verifyLandingPageAfterLogin({
      page,
      baseURL,
      partnerLevel: sppDeactivated.partnerLevel,
      status: sppDeactivated.status,
      expectedLandingPageURL: sppDeactivated.expectedLandingPageURL,
    });
  });

  test(`${features[10].name},${features[10].tags}`, async ({ page, baseURL }) => {
    await verifyLandingPageAfterLogin({
      page,
      baseURL,
      partnerLevel: sppExpired.partnerLevel,
      status: sppExpired.status,
      expectedLandingPageURL: sppExpired.expectedLandingPageURL,
    });
  });
});
