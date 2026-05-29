import { test } from '@playwright/test';

test('Debug navigation', async ({ page }) => {
  await page.goto('https://gannino.github.io/your-wealth/');
  await page.waitForLoadState('networkidle');

  // Log all navigation links
  const navLinks = page.locator('nav a');
  const count = await navLinks.count();
  console.log('Navigation links count:', count);

  for (let i = 0; i < count; i++) {
    const text = await navLinks.nth(i).textContent();
    const href = await navLinks.nth(i).getAttribute('href');
    console.log(`Link ${i}: "${text}" -> ${href}`);
  }

  // Try to click Training link
  const trainingLink = page.locator('nav a:has-text("Training")');
  console.log('Training link visible:', await trainingLink.isVisible());

  if (await trainingLink.isVisible()) {
    await trainingLink.click();
    await page.waitForURL('/training/hub', { timeout: 5000 });
    console.log('Successfully navigated to training hub');

    // Check what's on the page
    const h1Text = await page.locator('h1').textContent();
    console.log('Training hub h1:', h1Text);
  }
});
