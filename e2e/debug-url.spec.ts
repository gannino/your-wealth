import { test } from '@playwright/test';

test('Debug URL routing', async ({ page }) => {
  await page.goto('https://gannino.github.io/your-wealth/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'homepage.png', fullPage: true });

  console.log('Current URL after load:', page.url());

  // Click Training link
  const trainingLink = page.locator('nav a:has-text("Training")');
  await trainingLink.click();

  // Wait for navigation (any URL change)
  await page.waitForLoadState('networkidle');
  console.log('URL after click:', page.url());

  // Check if we're on a training-related page
  const bodyText = await page.textContent('body');
  console.log('Page contains "Training Center":', bodyText?.includes('Training Center'));
});
