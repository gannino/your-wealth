/**
 * Test helpers for robust SPA navigation
 */
import type { Page } from '@playwright/test';

/**
 * Navigate and wait for route change with retry logic
 */
export async function navigateAndWait(
  page: Page,
  selector: string,
  expectedURL: string | RegExp,
  options: { timeout?: number; retries?: number } = {}
) {
  const { timeout = 10000, retries = 3 } = options;

  for (let i = 0; i < retries; i++) {
    try {
      // Click the navigation element
      await page.click(selector);

      // Wait for URL change
      await page.waitForURL(expectedURL, { timeout });

      // Wait for network idle to ensure page is loaded
      await page.waitForLoadState('networkidle', { timeout });

      // Wait a bit more for client-side rendering
      await page.waitForTimeout(500);

      return; // Success
    } catch (error) {
      console.log(`Navigation attempt ${i + 1} failed, retrying...`);

      if (i === retries - 1) {
        throw error; // Rethrow on last attempt
      }

      // Wait before retry
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Wait for element to be visible with retry logic
 */
export async function waitForVisible(
  page: Page,
  selector: string,
  options: { timeout?: number; retries?: number } = {}
) {
  const { timeout = 5000, retries = 3 } = options;

  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout });
      return; // Success
    } catch (error) {
      if (i === retries - 1) {
        throw error; // Rethrow on last attempt
      }

      await page.waitForTimeout(500);
    }
  }
}

/**
 * Click module card and wait for navigation
 */
export async function clickModuleCard(
  page: Page,
  moduleId: string,
  expectedURL: string | RegExp
) {
  await navigateAndWait(page, `[data-testid="module-card-${moduleId}"]`, expectedURL);
}
