export default class SignInPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.signInButtonStageAdobe = page.locator('.profile-comp.secondary-button');
    this.profileIconButton = page.locator('.feds-profile-button');
    this.userNameDisplay = page.locator('.user-name');
    this.logoutButton = page.locator('[daa-ll="Sign Out"]');

    this.emailField = page.locator('#EmailPage-EmailField');
    this.emailPageContinueButton = page.locator('//button[@data-id="EmailPage-ContinueButton"]');
    this.passwordField = page.locator('#PasswordPage-PasswordField');
    this.passwordPageContinueButton = page.locator('//button[@data-id="PasswordPage-ContinueButton"]');
  }

  async signIn(page, partnerLevel) {
    const email = process.env.IMS_EMAIL.split(partnerLevel)[1].split(';')[0];
    await page.waitForLoadState('domcontentloaded');
    await this.emailField.fill(email);
    await this.emailPageContinueButton.click();
    await this.passwordField.fill(process.env.IMS_PASS);
    await this.passwordPageContinueButton.click();
  }

  async verifyRedirectAfterLogin({
    page, expect, newTab, newTabPage, feature, signInPage,
  }) {
      const url = `${feature.baseURL}`;
      await page.evaluate((navigationUrl) => {
        window.location.href = navigationUrl;
      }, url);

      await page.waitForLoadState('domcontentloaded');
      await signInPage.signInButtonStageAdobe.waitFor({ state: 'visible', timeout: 25000 })
      await signInPage.signInButtonStageAdobe.click();

      await this.signIn(page, `${feature.data.partnerLevel}`);
      await signInPage.userNameDisplay.waitFor({ state: 'visible', timeout: 20000 });

      await newTab.goto(`${feature.path}`);
      await newTabPage.profileIconButton.waitFor({ state: 'visible', timeout: 20000 });
      const pages = await page.context().pages();
      await expect(pages[1].url())
        .toContain(`${feature.data.expectedToSeeInURL}`);
  }
}
