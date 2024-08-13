import { test, expect } from '@playwright/test';
import AnnouncementsPage from '../../selectors/dme/announcements.page.js';
import SignInPage from '../../selectors/dme/signin.page.js';

let announcementsPage;
let singInPage;
const Announcements = require('../../features/dme/announcements.spec.js');

const { features } = Announcements;
const regionCases = features.slice(6, 18);
const partnerLevelCases = features.slice(20, 23);

const chimeraApi = '**/chimera-api/collection?**';

test.describe('Validate announcements block', () => {
  test.beforeEach(async ({ page }) => {
    announcementsPage = new AnnouncementsPage(page);
    singInPage = new SignInPage(page);
  });

  test(`${features[0].name},${features[0].tags}`, async ({ page, baseURL }) => {
    const { data } = features[0];
    await test.step('Go to Announcements page', async () => {
    page.on('console', msg => console.log(msg.text()));
    console.log('before', new Date(), baseURL);
    await page.goto(`${baseURL}${features[0].path}`);
    console.log('after', new Date());

    await page.evaluate(() => {
      console.log('second', new Date());
      if (document.querySelector('.card-title')) {
        window.cardsLoaded = true;
      } else {
        document.addEventListener('partner-cards-loaded', () => {
          window.cardsLoaded = true;
          console.log('third');
        });
      }

    });
    try {
      await page.waitForFunction(() => {
        return window.cardsLoaded;
      });
    } catch {
      const result = await announcementsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
      console.log('catch block', result);
    }


//     await page.route(chimeraApi, async route => {
//       const json = require('../../features/dme/announcments.json');
//       await route.fulfill({ json });
//     });
//     await page.goto(`${baseURL}${features[0].path}`);

    const result = await announcementsPage.resultNumber.textContent();
    await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);

    });

    await test.step('Enter Automation regression announcements card worldwide no1 in search field', async () => {
      await announcementsPage.searchField.fill(data.firstCardTitle);
      const result = await announcementsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfMatchingTitleCards);
    });

    await test.step('Clear search field on X', async () => {
      await announcementsPage.clearSearchSelector.click();
      const result = await announcementsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
    });

    await test.step('Enter Automation regression announcements card worldwide no2 in search field', async () => {
      await announcementsPage.searchField.fill(data.secondCardTitle);
      const result = await announcementsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfMatchingTitleCards);
    });

    await test.step('Clear all', async () => {
      await announcementsPage.clearAllSelector.click();
      const result = await announcementsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
    });

    await test.step('Enter Automation regression in search field', async () => {
      await announcementsPage.searchField.fill(data.searchCards);
      const result = await announcementsPage.resultNumber.textContent();
      await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfMatchingDescCards);
    });
  });

//   test(`${features[1].name},${features[1].tags}`, async ({ page, baseURL }) => {
//     const { data } = features[1];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${features[1].path}`);
//       await page.on('partner-cards-loaded', () => {
//         const result = announcementsPage.resultNumber.textContent();
//         expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//       });
//     });
//
//     await test.step('Select Oldest sort option', async () => {
//       await announcementsPage.searchField.fill(data.searchCards);
//       const result = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfMatchingDescCards);
//       await announcementsPage.sortBtn.click();
//       await announcementsPage.oldestOption.click();
//       const paginationText = await announcementsPage.paginationText.textContent();
//       await expect(paginationText.toLowerCase()).toBe(data.firstLoadResult);
//     });
//
//     await test.step('Load more cards', async () => {
//       await announcementsPage.loadMore.click();
//       let paginationText = await announcementsPage.paginationText.textContent();
//       await expect(paginationText.toLowerCase()).toBe(data.secondLoadResult);
//       await announcementsPage.loadMore.click();
//       paginationText = await announcementsPage.paginationText.textContent();
//       await expect(paginationText.toLowerCase()).toBe(data.thirdLoadResult);
//       await expect(await announcementsPage.loadMore).not.toBeVisible();
//       const firstCardDate = new Date(await announcementsPage.firstCardDate.textContent()).getTime();
//       const lastCardDate = new Date(await announcementsPage.lastCardDate.textContent()).getTime();
//       await expect(firstCardDate).toBeLessThan(lastCardDate);
//       await expect(await announcementsPage.cardCount.count()).toBe(data.numberOfMatchingDescCards);
//     });
//   });

//   test(`${features[2].name},${features[2].tags}`, async ({ page, baseURL }) => {
//     const { data } = features[2];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${features[2].path}`);
//       await page.on('partner-cards-loaded', () => {
//         const result = announcementsPage.resultNumber.textContent();
//         expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//       });
//       await announcementsPage.searchField.fill(data.searchCards);
//       const filteredCards = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(filteredCards.split(' ')[0], 10)).toBe(data.numberOfMatchingDescCards);
//     });
//
//     await test.step('Verify pagination buttons', async () => {
//       let paginationText = await announcementsPage.paginationText.textContent();
//       await expect(paginationText.toLowerCase()).toBe(data.firstPageResult);
//       const paginationPrevButton = await announcementsPage.paginationPrevButton;
//       await expect(paginationPrevButton).toHaveClass(/disabled/);
//       const paginationNextButton = await announcementsPage.paginationNextButton;
//       await expect(paginationNextButton).not.toHaveClass(/disabled/);
//       await expect(await announcementsPage.pageCount.count()).toBe(data.totalPageCount);
//       await announcementsPage.clickPageNumButton(data.pageButtonNumber);
//       paginationText = await announcementsPage.paginationText.textContent();
//       await expect(paginationText.toLowerCase()).toBe(data.secondPageResult);
//       await expect(paginationPrevButton).not.toHaveClass(/disabled/);
//       await expect(paginationNextButton).not.toHaveClass(/disabled/);
//       await paginationNextButton.click();
//       paginationText = await announcementsPage.paginationText.textContent();
//       await expect(paginationText.toLowerCase()).toBe(data.thirdPageResult);
//       await expect(paginationPrevButton).not.toHaveClass(/disabled/);
//       await expect(paginationNextButton).toHaveClass(/disabled/);
//     });
//   });
//
//   test(`${features[3].name},${features[3].tags}`, async ({ page, baseURL }) => {
//     const { data } = features[3];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${features[3].path}`);
//       await page.on('partner-cards-loaded', () => {
//         const result = announcementsPage.resultNumber.textContent();
//         expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//       });
//     });
//
//     await test.step('Test audience filter', async () => {
//       await announcementsPage.expandFilterOptions(data.filterAudience);
//       await announcementsPage.clickFilterOptions(data.filterSales);
//       const resultAfterSalesFilterApplied = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterSalesFilterApplied.split(' ')[0], 10)).toBe(data.cardsWithSales);
//       await announcementsPage.clickFilterOptions(data.filterPracticeLead);
//       const resultAfterPracticeLeadFilterApplied = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterPracticeLeadFilterApplied.split(' ')[0], 10)).toBe(data.cardsWithSalesAndPracticeLead);
//       await announcementsPage.clearFilter(data.filterAudience, data.numberOfAudienceFiltersSelected);
//       const resultAfterClearingAudienceFilter = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterClearingAudienceFilter.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//     });
//
//     await test.step('Test marketing filter', async () => {
//       await announcementsPage.expandFilterOptions(data.filterMarketing);
//       await announcementsPage.clickFilterOptions(data.filterAdvertising);
//       await announcementsPage.clickFilterOptions(data.filterSolutions);
//       const resultAfterMarketingFilter = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterMarketingFilter.split(' ')[0], 10)).toBe(data.cardsWithAdvertisingAndSolutions);
//       await announcementsPage.clickFilterOptions(data.filterSolutions);
//       const resultAfterClearingFilter = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterClearingFilter.split(' ')[0], 10)).toBe(data.cardsWithAdvertising);
//       await announcementsPage.clearSideBarFilterButton(data.filterAdvertising);
//       const resultAfterClearingAllFilters = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterClearingAllFilters.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//     });
//
//     await test.step('Test different filter combinations', async () => {
//       await announcementsPage.clickFilterOptions(data.filterProduct);
//       const resultAfterProductFilter = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterProductFilter.split(' ')[0], 10)).toBe(data.cardsWithProduct);
//       await announcementsPage.clickFilterOptions(data.filterSales);
//       const resultAfterSalesFilters = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterSalesFilters.split(' ')[0], 10)).toBe(data.cardsWithSales);
//       await announcementsPage.clearAllSelector.click();
//       const resultAfterClearingAllFilters = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterClearingAllFilters.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//     });
//
//     await test.step('Test date filter', async () => {
//       await announcementsPage.expandFilterOptions(data.filterDate);
//       await announcementsPage.clickDateFilterOptions(data.filterLastNinetyDays);
//       const resultAfterDateFilter = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultAfterDateFilter.split(' ')[0], 10)).toBe(data.cardsWithLastNinetyDays);
//       const firstCardTitle = await announcementsPage.firstCardTitle.textContent();
//       await expect(firstCardTitle).toBe(data.titleOfDateFilteredCard);
//     });
//   });
//
//   test(`${features[4].name},${features[4].tags}`, async ({ page, baseURL }) => {
//     const { data } = features[4];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${features[4].path}`);
//       await page.on('partner-cards-loaded', () => {
//          announcementsPage.searchField.fill(data.searchCardTitle);
//          const resultAfterSearch = announcementsPage.resultNumber.textContent();
//          expect(parseInt(resultAfterSearch.split(' ')[0], 10)).toBe(data.numberOfMatchingTitleCards);
//          console.log('sss', resultAfterSearch);
//       });
//     });
//
//     await test.step('Read now', async () => {
//       await announcementsPage.readCard.click();
//       const pages = await page.context().pages();
//       await expect(pages[0].url())
//         .toContain(data.expectedToSeeInURL);
//     });
//   });
//
//   test(`${features[5].name},${features[5].tags}`, async ({ page, baseURL }) => {
//     const { data } = features[5];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${features[5].path}`);
//       await page.on('partner-cards-loaded', () => {
//         const result = announcementsPage.resultNumber.textContent();
//         expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfPublicCards);
//       });
//     });
//
//     await test.step('Edge cases search bar', async () => {
//       await announcementsPage.searchField.fill(data.specialCharsTitleSearch);
//       const resultSpecialCharsCard = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultSpecialCharsCard.split(' ')[0], 10)).toBe(data.cardsWithSpecialChars);
//       await announcementsPage.searchField.fill(data.dateInPastTitleSearch);
//       const resultDateInPastCard = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultDateInPastCard.split(' ')[0], 10)).toBe(data.cardsWithDateInPast);
//       await announcementsPage.searchField.fill(data.eventEndedTitleSearch);
//       const resultEventEndedCard = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultEventEndedCard.split(' ')[0], 10)).toBe(data.cardsWithEventEnded);
//       await announcementsPage.searchField.fill(data.tooLongTitleSearch);
//       const resultWorldwideLongTitleCard = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultWorldwideLongTitleCard.split(' ')[0], 10)).toBe(data.cardsWithTooLongTitle);
//       await announcementsPage.searchField.fill(data.noCollectionTagTitleSearch);
//       const resultWithoutCollectionTagCard = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultWithoutCollectionTagCard.split(' ')[0], 10)).toBe(data.cardsWithoutCollectionTag);
//       await announcementsPage.clearAllSelector.click();
//       const firstCardTitle = await announcementsPage.firstCardTitle;
//       await expect(firstCardTitle).toBeEmpty();
//       await announcementsPage.searchField.fill(data.noTitleSearch);
//       const resultWithoutTitleCard = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultWithoutTitleCard.split(' ')[0], 10)).toBe(data.cardsWithoutTitle);
//     });
//   });
//
//   regionCases.forEach((feature) => {
//     test(`${feature.name},${feature.tags}`, async ({ page, context, baseURL }) => {
//       await test.step('Go to Announcements page', async () => {
//         await page.goto(`${baseURL}${feature.path}`);
//         await page.waitForLoadState('domcontentloaded');
//       });
//
//       await test.step('Sign in', async () => {
//         await singInPage.addCookie(
//           feature.data.partnerPortal,
//           feature.data.partnerLevel,
//           feature.data.permissionRegion,
//           `${baseURL}${feature.path}`,
//           context,
//         );
//         await page.reload();
//         await page.on('partner-cards-loaded', () => {});
//       });
//
//       await test.step(`Verify card titled ${feature.data.announcementCardTitle} is present on page`, async () => {
//         await announcementsPage.searchField.fill(`${feature.data.announcementCardTitle}`);
//         await announcementsPage.firstCardTitle.waitFor({ state: 'visible', timeout: 15000 });
//         const result = await announcementsPage.resultNumber.textContent();
//         await expect(parseInt(result.split(' ')[0], 10)).toBe(feature.data.numberOfMatchingTitleCards);
//       });
//     });
//   });
//
//   test(`${features[18].name},${features[18].tags}`, async ({ page, context, baseURL }) => {
//     const { data, path } = features[18];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${path}`);
//       await page.waitForLoadState('domcontentloaded');
//       await page.on('partner-cards-loaded', () => {});
//     });
//
//     await test.step(`Verify card titled ${data.announcementCardTitle} is present on page`, async () => {
//       await announcementsPage.searchField.fill(`${data.announcementCardTitle}`);
//       await announcementsPage.firstCardDate.waitFor({ state: 'visible', timeout: 15000 });
//       const result = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfMatchingTitleCardsNonLoggedIn);
//     });
//
//     await test.step('Sign in', async () => {
//       await singInPage.addCookie(
//         data.partnerPortal,
//         data.partnerLevel,
//         data.permissionRegion,
//         `${baseURL}${path}`,
//         context,
//       );
//       await page.reload();
//       await page.waitForLoadState('domcontentloaded');
//     });
//
//     await test.step(`Verify card titled ${data.announcementCardTitle} is not present on page after login`, async () => {
//       await announcementsPage.searchField.fill(`${data.announcementCardTitle}`);
//       const result = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(result.split(' ')[0], 10)).toBe(data.numberOfMatchingTitleCardsLoggedIn);
//     });
//   });
//
//   test(`${features[19].name},${features[19].tags}`, async ({ page, context, baseURL }) => {
//     const { data, path } = features[19];
//     await test.step('Go to Announcements page', async () => {
//       await page.goto(`${baseURL}${path}`);
//       await page.waitForLoadState('domcontentloaded');
//     });
//
//     await test.step('Sign in', async () => {
//       await singInPage.addCookie(
//         data.partnerPortal,
//         data.partnerLevel,
//         data.permissionRegion,
//         `${baseURL}${path}`,
//         context,
//       );
//       await page.reload();
//       await page.on('partner-cards-loaded', () => {});
//     });
//
//     await test.step(`Verify card titled ${data.platinumCardTitle} is present on page`, async () => {
//       const resultTotal = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultTotal.split(' ')[0], 10)).toBe(data.totalNumberOfCards);
//       await announcementsPage.searchField.fill(`${data.platinumCardTitle}`);
//       const resultSearch = await announcementsPage.resultNumber.textContent();
//       await expect(parseInt(resultSearch.split(' ')[0], 10)).toBe(data.numberOfMatchingTitleCards);
//     });
//   });
//
//   partnerLevelCases.forEach((feature) => {
//     test(`${feature.name},${feature.tags}`, async ({ page, context, baseURL }) => {
//       await test.step('Go to Announcements page', async () => {
//         await page.goto(`${baseURL}${feature.path}`);
//         await page.waitForLoadState('domcontentloaded');
//       });
//
//       await test.step('Sign in', async () => {
//         await singInPage.addCookie(
//           feature.data.partnerPortal,
//           feature.data.partnerLevel,
//           feature.data.permissionRegion,
//           `${baseURL}${feature.path}`,
//           context,
//         );
//         await page.reload();
//         await page.on('partner-cards-loaded', () => {});
//       });
//
//       await test.step(`Verify card titled ${feature.data.partnerLevelCardTitle} is present on page`, async () => {
//         const resultTotal = await announcementsPage.resultNumber.textContent();
//         await expect(parseInt(resultTotal.split(' ')[0], 10)).toBe(feature.data.totalNumberOfCards);
//         await announcementsPage.searchField.fill(`${feature.data.partnerLevelCardTitle}`);
//         const resultSearch = await announcementsPage.resultNumber.textContent();
//         await expect(parseInt(resultSearch.split(' ')[0], 10)).toBe(feature.data.numberOfPartnerLevelCards);
//       });
//
//       await test.step(`Verify card titled ${feature.data.higherPartnerLevelCardTitle} is not present on page`, async () => {
//         await announcementsPage.searchField.fill(`${feature.data.higherPartnerLevelCardTitle}`);
//         const resultSearch = await announcementsPage.resultNumber.textContent();
//         await expect(parseInt(resultSearch.split(' ')[0], 10)).toBe(feature.data.numberOfHigherPartnerLevelCards);
//       });
//     });
//   });
});
