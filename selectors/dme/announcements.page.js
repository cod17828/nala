export default class AnnouncementsPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.resultNumber = page.locator('.partner-cards-cards-results').nth(0);
    this.searchField = page.locator('.input');
  }
}
