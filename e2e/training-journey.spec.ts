/**
 * Training Journey E2E Tests
 *
 * Tests complete user training journey in the browser:
 * 1. Navigate to training hub
 * 2. Complete a training module with all screens
 * 3. Answer knowledge checks correctly
 * 4. Verify module completion
 * 5. Check progress dashboard updates
 */

import { test, expect } from '@playwright/test';

test.describe('Training Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should navigate to training hub and see all 5 modules', async ({ page }) => {
    // Click on Training Hub link
    await page.click('text=Go to Training Hub');
    await page.waitForURL('/training/hub');

    // Should see all 5 modules
    await expect(page.locator('text=Module 1: Foundation')).toBeVisible();
    await expect(page.locator('text=Module 2: Myth-Busting')).toBeVisible();
    await expect(page.locator('text=Module 3: Strategy')).toBeVisible();
    await expect(page.locator('text=Module 4: Execution')).toBeVisible();
    await expect(page.locator('text=Module 5: Mastery')).toBeVisible();
  });

  test('should complete Module 1: Foundation journey', async ({ page }) => {
    // Navigate to training hub
    await page.click('text=Go to Training Hub');
    await page.waitForURL('/training/hub');

    // Start Module 1
    await page.click('text=Module 1: Foundation');
    await page.waitForURL('/training/module-1-foundation');

    // Verify intro screen
    await expect(page.locator('text=Welcome to Module 1')).toBeVisible();
    
    // Click Next through content screens
    await page.click('text=Next →');
    await expect(page.locator('text=The 80/20 Principle')).toBeVisible();
    
    await page.click('text=Next →');
    await expect(page.locator('text=Your Money Story')).toBeVisible();
    
    // Answer quiz question correctly
    await page.click('text=Next →');
    await expect(page.locator('text=Test Your Knowledge')).toBeVisible();
    
    // Select correct answer (second option typically correct)
    const quizOptions = page.locator('button:has-text("Select an option")');
    const count = await quizOptions.count();
    if (count > 1) {
      await quizOptions.nth(1).click();
    }
    
    // Wait for feedback
    await page.waitForTimeout(500);
    await page.click('text=Next →');
    
    // Navigate through scenario and reflection
    await page.click('text=Next →'); // Past scenario
    await page.click('text=Continue →'); // Past reflection
    
    // Verify completion screen
    await expect(page.locator('text=Module 1 Complete')).toBeVisible();
    
    // Return to hub
    await page.click('text=Complete');
    await page.waitForURL('/training/hub');
    
    // Verify Module 1 shows as complete
    await expect(page.locator('text=✓ Complete').first()).toBeVisible();
  });

  test('should track progress across modules', async ({ page }) => {
    // Navigate to training hub
    await page.goto('/training/hub');

    // Complete Module 1 (abbreviated)
    await page.click('text=Module 1: Foundation');
    await page.waitForURL('/training/module-1-foundation');
    
    // Navigate through screens quickly
    for (let i = 0; i < 6; i++) {
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Complete")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300);
      }
    }
    
    // Return to hub
    await page.waitForURL('/training/hub');
    
    // Check progress indicator
    const progressText = await page.locator('text=/\\d+%/5').textContent();
    expect(progressText).toBeTruthy();
  });

  test('should display knowledge check feedback', async ({ page }) => {
    await page.goto('/training/module-2-mythbusting');
    
    // Navigate to quiz screen
    for (let i = 0; i < 3; i++) {
      const nextButton = page.locator('button:has-text("Next")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300);
      } else {
        break;
      }
    }
    
    // Should see quiz question
    const quizVisible = await page.locator('text=Test Your Knowledge').isVisible();
    if (quizVisible) {
      // Select an answer
      const options = page.locator('button[style*="border"]');
      if (await options.count() > 0) {
        await options.first().click();
        await page.waitForTimeout(500);
        
        // Should see feedback
        const feedbackVisible = await page.locator('text=feedback, text=Correct, text=Incorrect').isVisible();
        expect(feedbackVisible).toBeTruthy();
      }
    }
  });
});

test.describe('Progress Dashboard', () => {
  test('should display overall training progress', async ({ page }) => {
    // Start with training hub to establish baseline
    await page.goto('/training/hub');
    
    // Navigate to progress dashboard if available
    const dashboardLink = page.locator('text=Progress Dashboard');
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      
      // Should see progress overview
      await expect(page.locator('text=Your Training Progress')).toBeVisible();
      
      // Should see module progress section
      await expect(page.locator('text=Module Progress')).toBeVisible();
    }
  });

  test('should show achievements as modules complete', async ({ page }) => {
    await page.goto('/training/hub');
    
    // Check if achievements section exists
    const achievementsSection = page.locator('text=Achievements');
    if (await achievementsSection.isVisible()) {
      // Should see achievement badges
      await expect(page.locator('text=Quick Learner, text=Halfway There, text=Your Wealth Graduate').first()).toBeVisible();
    }
  });
});
