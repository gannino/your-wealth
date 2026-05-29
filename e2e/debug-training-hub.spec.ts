import { test } from '@playwright/test';

test('Debug training hub page', async ({ page }) => {
  await page.goto('https://gannino.github.io/your-wealth/training/hub');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'training-hub.png', fullPage: true });

  // Check for training hub title
  const title = await page.locator('h1').textContent();
  console.log('Page title:', title);

  // Check for modules
  const moduleText = await page.textContent('body');
  console.log('Contains "Module 1: Foundation":', moduleText?.includes('Module 1: Foundation'));

  // List all h2 elements
  const headings = await page.locator('h2, h3').allTextContents();
  console.log('Headings:', headings);
});
