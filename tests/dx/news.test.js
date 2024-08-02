import { test, expect } from '@playwright/test';
import NewsPage from '../../selectors/dx/news.page.js';
import SignInPage from '../../selectors/dx/signin.page.js';

let newsPage;
let signInPage;
const News = require('../../features/dx/news.spec.js');

const { features } = News;

const chimeraApi = '**/chimera-api/collection?**';
test.describe('Validate news block', () => {
  test.beforeEach(async ({ page }) => {
    newsPage = new NewsPage(page);
    signInPage = new SignInPage(page);
  });

  async function findCardsForPartnerLevel(page, path, cardPartnerLevel, partnerLevel, partnerPortal, resultTotal, cardLevelAbove, context) {
    await test.step('Click Sign In', async () => {
      await page.goto(path);
      await page.waitForResponse(chimeraApi);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
      await newsPage.searchField.fill(cardPartnerLevel);
      const resultCardPartnerLevel = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultCardPartnerLevel.split(' ')[0], 10)).toBe(0);
      await signInPage.addCookie(partnerPortal, partnerLevel, path, context);
      await page.reload();
      await page.waitForResponse(chimeraApi);
    });

    await test.step('Find automation regression cards for current partner level', async () => {
      const resultAll = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAll.split(' ')[0], 10)).toBe(resultTotal);
      await newsPage.searchField.fill(cardPartnerLevel);
      const resultCardPartnerLevel = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultCardPartnerLevel.split(' ')[0], 10)).toBe(1);
      await newsPage.searchField.fill(cardLevelAbove);
      const resultCardPartnerLevelAbove = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultCardPartnerLevelAbove.split(' ')[0], 10)).toBe(0);
    });
  }

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to News page', async () => {
      console.log('url: ', baseURL + features[0].path);
      await page.goto(`${baseURL}${features[0].path}`);
      await page.waitForResponse(chimeraApi);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
    });

    await test.step('Enter Automation regression news card SPP Public no1 in search field', async () => {
      await newsPage.searchField.fill(features[0].data.publicCard1);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(1);
    });

    await test.step('Clear search field on X', async () => {
      await newsPage.clearSearchSelector.click();
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
    });

    await test.step('Enter Automation regression news card SPP Public no2 in search field', async () => {
      await newsPage.searchField.fill(features[0].data.publicCard2);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(1);
    });

    await test.step('Clear all', async () => {
      await newsPage.clearAllSelector.click();
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
    });

    await test.step('Enter This is automation in search field', async () => {
      await newsPage.searchField.fill(features[0].data.cardDescription);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(7);
    });
  });

  test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to News page', async () => {
      await page.goto(`${baseURL}${features[1].path}`);
      await page.waitForResponse(chimeraApi);
      await newsPage.firstCardDate.waitFor({ state: 'visible', timeout: 20000 });
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
    });

    await test.step('Select Oldest sort option', async () => {
      await newsPage.searchField.fill(features[1].data.cardTitle);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(8);
      await newsPage.sortBtn.click();
      await newsPage.oldestOption.click();
      const paginationText = await newsPage.paginationText.textContent();
      await expect(paginationText.toLowerCase()).toBe(features[1].data.firstLoadResult);
    });

    await test.step('Load more cards', async () => {
      await newsPage.loadMore.click();
      let paginationText = await newsPage.paginationText.textContent();
      await expect(paginationText.toLowerCase()).toBe(features[1].data.secondLoadResult);
      await newsPage.loadMore.click();
      paginationText = await newsPage.paginationText.textContent();
      await expect(paginationText.toLowerCase()).toBe(features[1].data.thirdLoadResult);
      await expect(await newsPage.loadMore).not.toBeVisible();
      const firstCardDate = new Date(await newsPage.firstCardDate.textContent()).getTime();
      const lastCardDate = new Date(await newsPage.lastCardDate.textContent()).getTime();
      await expect(firstCardDate).toBeLessThan(lastCardDate);
      await expect(await newsPage.cardCount.count()).toBe(8);
    });
  });

  test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to News page', async () => {
      await page.goto(`${baseURL}${features[2].path}`);
      await page.waitForResponse(chimeraApi);
      await newsPage.firstCardDate.waitFor({ state: 'visible', timeout: 20000 });
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
    });

    await test.step('Test applications filter', async () => {
      await newsPage.expandFilterOptions(features[2].data.filterApplication);
      await newsPage.clickFilterOptions(features[2].data.filterCampaign);
      const resultAfterCampaignFilterApplied = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterCampaignFilterApplied.split(' ')[0], 10)).toBe(1);
      await newsPage.clickFilterOptions(features[2].data.filterAnalytics);
      const resultAfterAnalyticsFilterApplied = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterAnalyticsFilterApplied.split(' ')[0], 10)).toBe(2);
      await newsPage.clearFilter(features[2].data.filterApplication, '2');
      const resultAfterClearingApplicationsFilter = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterClearingApplicationsFilter.split(' ')[0], 10)).toBe(9);
      await newsPage.expandFilterOptions(features[2].data.filterApplication);
    });

    await test.step('Test audience filter', async () => {
      await newsPage.expandFilterOptions(features[2].data.filterAudience);
      await newsPage.clickFilterOptions(features[2].data.filterTechnical);
      const resultAfterTechnical = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterTechnical.split(' ')[0], 10)).toBe(1);
      await newsPage.clearSideBarFilterButton(features[2].data.filterTechnical);
      const resultAfterClearingFilter = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterClearingFilter.split(' ')[0], 10)).toBe(9);
      await newsPage.expandFilterOptions(features[2].data.filterAudience);
    });

    await test.step('Test region filter', async () => {
      await newsPage.expandFilterOptions(features[2].data.filterRegion);
      await newsPage.clickFilterOptions(features[2].data.filterAmericas);
      await newsPage.clickFilterOptions(features[2].data.filterJapan);
      const resultAfterRegionFilters = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterRegionFilters.split(' ')[0], 10)).toBe(3);
      await newsPage.clickFilterOptions(features[2].data.filterAmericas);
      const resultAfterUncheckingAmericas = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterUncheckingAmericas.split(' ')[0], 10)).toBe(1);
    });

    await test.step('Test topic filter', async () => {
      await newsPage.expandFilterOptions(features[2].data.filterTopic);
      await newsPage.clickFilterOptions(features[2].data.filterSolutions);
      const resultAfterTopicFilter = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterTopicFilter.split(' ')[0], 10)).toBe(1);
      await newsPage.clearAllSelector.click();
      const resultAfterClearingAllFilters = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterClearingAllFilters.split(' ')[0], 10)).toBe(9);
    });
  });

  test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to News page', async () => {
      await page.goto(`${baseURL}${features[3].path}`);
      await page.waitForLoadState('domcontentloaded');
      await newsPage.searchField.fill(features[3].data.cardTitle);
      await newsPage.firstCardTitle.waitFor({ state: 'visible', timeout: 10000 });
      const resultAfterSearch = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAfterSearch.split(' ')[0], 10)).toBe(1);
    });

    await test.step('Read now', async () => {
      await newsPage.readCard.click();
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${features[3].data.expectedToSeeInURL}`);
    });
  });

  test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
    await test.step('Go to News page', async () => {
      await page.goto(`${baseURL}${features[4].path}`);
      await page.waitForResponse(chimeraApi);
      await newsPage.firstCardDate.waitFor({ state: 'visible', timeout: 20000 });
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
    });

    await test.step('Edge cases search bar', async () => {
      await newsPage.searchField.fill(features[4].data.dateInPast);
      const resultDateInPastCard = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultDateInPastCard.split(' ')[0], 10)).toBe(1);
      await newsPage.searchField.fill(features[4].data.publicCard6);
      const resultSppPublicCardNo6 = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultSppPublicCardNo6.split(' ')[0], 10)).toBe(1);
      await newsPage.searchField.fill(features[4].data.cardWithSpecialChars);
      const resultSpecialCharsCard = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultSpecialCharsCard.split(' ')[0], 10)).toBe(1);
      await newsPage.searchField.fill(features[4].data.cardWithoutNewsCollection);
      const resultWithoutNewsTagCard = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultWithoutNewsTagCard.split(' ')[0], 10)).toBe(0);
      await newsPage.clearAllSelector.click();
      const firstCardTitle = await newsPage.firstCardTitle;
      await expect(firstCardTitle).toBeEmpty();
      await newsPage.searchField.fill(features[4].data.cardWithoutTitle);
      const resultWithoutTitleCard = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultWithoutTitleCard.split(' ')[0], 10)).toBe(0);
    });
  });

  test(`${features[5].name},${features[5].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Click Sign In', async () => {
      await page.goto(`${baseURL}${features[5].path}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForResponse(chimeraApi);
      await newsPage.firstCardDate.waitFor({ state: 'visible', timeout: 20000 });
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(9);
      await newsPage.searchField.fill(features[5].data.platinumCard);
      const resultPlatinum = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultPlatinum.split(' ')[0], 10)).toBe(0);
      await signInPage.addCookie(features[5].data.partnerPortal, features[5].data.partnerLevel, baseURL + features[5].path, context);

      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForResponse(chimeraApi);
    });

    await test.step('Find platinum automation regression cards', async () => {
      await newsPage.firstCardDate.waitFor({ state: 'visible', timeout: 20000 });
      const resultAll = await newsPage.resultNumber.textContent();
      await expect(parseInt(resultAll.split(' ')[0], 10)).toBe(14);
      await newsPage.searchField.fill(features[5].data.platinumCard);
      const result = await newsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(1);
    });

    await test.step('Read now', async () => {
      await newsPage.readCard.click();
      const pages = await page.context().pages();
      await expect(pages[0].url())
        .toContain(`${features[5].data.expectedToSeeInURL}`);
    });
  });

  test(`${features[6].name},${features[6].tags}`, async ({ page, context, baseURL }) => {
    await findCardsForPartnerLevel(
      page,
      baseURL + features[6].path,
      features[6].data.cardPartnerLevel,
      features[6].data.partnerLevel,
      features[6].data.partnerPortal,
      features[6].data.resultTotal,
      features[6].data.cardLevelAbove,
      context,
    );
  });

  test(`${features[7].name},${features[7].tags}`, async ({ page, context, baseURL }) => {
    await findCardsForPartnerLevel(
      page,
      baseURL + features[7].path,
      features[7].data.cardPartnerLevel,
      features[7].data.partnerLevel,
      features[7].data.partnerPortal,
      features[7].data.resultTotal,
      features[7].data.cardLevelAbove,
      context,
    );
  });

  test(`${features[8].name},${features[8].tags}`, async ({ page, context, baseURL }) => {
    await findCardsForPartnerLevel(
      page,
      baseURL + features[8].path,
      features[8].data.cardPartnerLevel,
      features[8].data.partnerLevel,
      features[8].data.partnerPortal,
      features[8].data.resultTotal,
      features[8].data.cardLevelAbove,
      context,
    );
  });

  test(`${features[9].name},${features[9].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Click Sign In', async () => {
      await findCardsForPartnerLevel(
        page,
        baseURL + features[9].path,
        features[9].data.cardPartnerLevel,
        features[9].data.partnerLevel,
        features[9].data.partnerPortal,
        features[9].data.resultTotal,
        features[9].data.cardLevelAbove,
        context,
      );
    });
  });

  test(`${features[10].name},${features[10].tags}`, async ({ page, context, baseURL }) => {
    await test.step('Go to stage.adobe.com', async () => {
      await page.goto(`${baseURL}${features[10].path}`);
      await signInPage.addCookie(features[10].data.partnerPortal, features[10].data.partnerLevel, baseURL + features[10].path, context);
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step(`Open ${features[10].path} in a new tab`, async () => {
      const newTab = await context.newPage();
      await newTab.goto(`${features[10].path}`);
      const newTabPage = new NewsPage(newTab);
      await newTab.waitForResponse(chimeraApi);
      const resultCards = await newTabPage.resultNumber.textContent();
      await expect(parseInt(resultCards.split(' ')[0], 10)).toBe(9);
    });
  });
});
