import { test } from '@playwright/test';

test('Screenshot deployed homepage', async ({ page }) => {
  await page.goto('https://gannino.github.io/your-wealth/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'deployed-homepage.png', fullPage: true });

  // Log page content for debugging
  const content = await page.textContent('body');
  console.log('Page contains:', content?.substring(0, 500));
});
