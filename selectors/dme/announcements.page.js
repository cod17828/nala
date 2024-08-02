export default class AnnouncementsPage {
  constructor(page) {
    this.page = page;
    this.signInButton = page.locator('button[daa-ll="Sign In"].feds-signIn');
    this.resultNumber = page.locator('.partner-cards-cards-results').nth(0);
    this.searchField = page.locator('.input');
    this.clearSearchSelector = page.locator('[aria-label="Reset"]');
    this.clearAllSelector = page.locator('[aria-label="Clear all"]');
    this.firstCardTitle = page.locator('.card-title').nth(0);
    this.firstCardDate = page.locator('.card-date').nth(0);
    this.lastCardDate = page.locator('.card-date').nth(5);
    this.sortBtn = page.locator('.sort-btn');
    this.oldestOption = page.getByRole('button', { name: 'oldest' });
    this.paginationText = page.locator('.pagination-total-results');
    this.loadMore = page.locator('[aria-label="Load more"]');
    this.cardCount = page.locator('.card-wrapper');
    this.pageCount = page.locator('.page-btn');
    this.readCard = page.locator('.card-btn');
    this.paginationPrevButton = page.locator('button.pagination-prev-btn');
    this.paginationNextButton = page.locator('button.pagination-next-btn');
    this.pageNumButton = page.locator('button.page-btn');
  }

  async clickPageNumButton(pageNum) {
    await this.page.locator(`button[aria-label="Page ${pageNum}"]`).click();
  }

  async expandFilterOptions(filterSection) {
    await this.page.locator(`[aria-label="${filterSection}"]`).click();
  }

  async clickFilterOptions(filterOption) {
    await this.page.locator(`sp-checkbox:text-is("${filterOption}")`).click();
  }

  async clickDateFilterOptions(dateFilterOption) {
    await this.page.locator(`button[aria-label="${dateFilterOption}"]`).click();
  }

  async clearSideBarFilterButton(filterButton) {
    await this.page.locator(`[aria-label="${filterButton}"]`).click();
  }

  async clearFilter(filter, number) {
    await this.page.locator(`[aria-label="${filter}"] + [aria-label="${number}"]`).click();
  }
}
