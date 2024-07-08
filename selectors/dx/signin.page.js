export default class SignInPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.signInButtonStageAdobe = page.locator('.profile-comp.secondary-button');
    this.profileIconButton = page.locator('.feds-profile-button');
    this.joinNowButton = page.locator('a:has-text("Join now")');
    this.explorePastArticles = page.locator('a:has-text("Explore past articles")');
    this.newsletterLink = page.locator('a:has-text("product newsletter")');
    this.logoutButton = page.locator('[daa-ll="Sign Out"]');
    this.userNameDisplay = page.locator('.user-name');

    this.IMSEmailPage = page.locator('form#EmailForm');
    this.emailField = page.locator('#EmailPage-EmailField');
    this.emailPageContinueButton = page.locator('//button[@data-id="EmailPage-ContinueButton"]');
    this.IMSPasswordPage = page.locator('form#PasswordForm');
    this.passwordField = page.locator('#PasswordPage-PasswordField');
    this.passwordPageContinueButton = page.locator('//button[@data-id="PasswordPage-ContinueButton"]');
  }
}
