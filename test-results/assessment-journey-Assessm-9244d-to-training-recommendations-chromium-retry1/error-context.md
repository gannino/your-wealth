# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment-journey.spec.ts >> Assessment Journey >> should navigate from results to training recommendations
- Location: e2e/assessment-journey.spec.ts:51:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "Your Wealth" [ref=e7] [cursor=pointer]:
        - /url: /
        - generic [ref=e8]: Your Wealth
      - generic [ref=e9]:
        - link "Training" [ref=e10] [cursor=pointer]:
          - /url: /training/hub
        - link "Assessments" [ref=e11] [cursor=pointer]:
          - /url: /assessments/blueprint
        - link "Financial Data" [ref=e12] [cursor=pointer]:
          - /url: /assessments/currency
        - link "Financial Plan" [ref=e13] [cursor=pointer]:
          - /url: /assessments/currency
        - button "Clear Data" [ref=e14] [cursor=pointer]
  - main [ref=e15]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Training Center" [level=1] [ref=e19]
        - paragraph [ref=e20]: Build your foundation before assessments
      - generic [ref=e21]:
        - heading "Why Complete Training?" [level=2] [ref=e22]
        - generic [ref=e23]:
          - generic [ref=e24]:
            - generic [ref=e25]: 🎯
            - generic [ref=e26]:
              - heading "Accurate Results" [level=3] [ref=e27]
              - paragraph [ref=e28]: Understanding key concepts leads to more accurate self-assessment
          - generic [ref=e29]:
            - generic [ref=e30]: 💡
            - generic [ref=e31]:
              - heading "Better Decisions" [level=3] [ref=e32]
              - paragraph [ref=e33]: Learn proven principles that guide successful financial planning
          - generic [ref=e34]:
            - generic [ref=e35]: ⚡
            - generic [ref=e36]:
              - heading "Faster Progress" [level=3] [ref=e37]
              - paragraph [ref=e38]: Build the mental framework that accelerates your wealth journey
      - generic [ref=e39]:
        - generic [ref=e40] [cursor=pointer]:
          - generic [ref=e41]:
            - generic [ref=e42]: 🏛️
            - generic [ref=e43]:
              - 'heading "Module 1: Foundation" [level=3] [ref=e44]'
              - paragraph [ref=e45]: 12-15 min
          - paragraph [ref=e46]: Master your money psychology and establish your financial baseline. Uncover the 80/20 principle and your personal money story.
          - generic [ref=e49]:
            - generic [ref=e50]: Not Started
            - generic [ref=e51]: Start →
        - generic [ref=e52] [cursor=pointer]:
          - generic [ref=e53]:
            - generic [ref=e54]: 💡
            - generic [ref=e55]:
              - 'heading "Module 2: Myth-Busting" [level=3] [ref=e56]'
              - paragraph [ref=e57]: 12-15 min
          - paragraph [ref=e58]: Shatter the 9 financial myths that destroy wealth. Understand hidden fees and the power of index funds.
          - generic [ref=e61]:
            - generic [ref=e62]: Not Started
            - generic [ref=e63]: Start →
        - generic [ref=e64] [cursor=pointer]:
          - generic [ref=e65]:
            - generic [ref=e66]: ♟️
            - generic [ref=e67]:
              - 'heading "Module 3: Strategy" [level=3] [ref=e68]'
              - paragraph [ref=e69]: 15-18 min
          - paragraph [ref=e70]: Master asset allocation and core investment principles. Learn the Three-Bucket system and Core Four approach.
          - generic [ref=e73]:
            - generic [ref=e74]: Not Started
            - generic [ref=e75]: Start →
        - generic [ref=e76] [cursor=pointer]:
          - generic [ref=e77]:
            - generic [ref=e78]: 🎯
            - generic [ref=e79]:
              - 'heading "Module 4: Execution" [level=3] [ref=e80]'
              - paragraph [ref=e81]: 12-15 min
          - paragraph [ref=e82]: Select investments and advisors wisely. Learn to distinguish brokers from fiduciaries and ask the right questions.
          - generic [ref=e85]:
            - generic [ref=e86]: Not Started
            - generic [ref=e87]: Start →
        - generic [ref=e88] [cursor=pointer]:
          - generic [ref=e89]:
            - generic [ref=e90]: 🏆
            - generic [ref=e91]:
              - 'heading "Module 5: Mastery" [level=3] [ref=e92]'
              - paragraph [ref=e93]: 10-12 min
          - paragraph [ref=e94]: Navigate market volatility and master long-term psychology. Learn the Seven Freedom Facts and bear market strategies.
          - generic [ref=e97]:
            - generic [ref=e98]: Not Started
            - generic [ref=e99]: Start →
      - generic [ref=e101]:
        - paragraph [ref=e102]: Training is optional but recommended for best results.
        - generic [ref=e103]:
          - button "Back to Home" [ref=e104] [cursor=pointer]
          - button "Begin Assessments →" [ref=e105] [cursor=pointer]
  - contentinfo [ref=e106]:
    - paragraph [ref=e108]: © 2026 Your Wealth. All data stored locally in your browser.
```

# Test source

```ts
  1   | /**
  2   |  * Assessment Journey E2E Tests
  3   |  *
  4   |  * Tests complete assessment user journey:
  5   |  * 1. Navigate to assessments
  6   |  * 2. Complete blueprint assessment
  7   |  * 3. View assessment results
  8   |  * 4. Get module recommendations
  9   |  * 5. Navigate from results to recommended training
  10  |  */
  11  | 
  12  | import { test, expect } from '@playwright/test';
  13  | import { navigateAndWait, clickModuleCard } from './test-helpers';
  14  | 
  15  | test.describe('Assessment Journey', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await page.goto('/');
  18  |   });
  19  | 
  20  |   test('should navigate to blueprint assessment', async ({ page }) => {
  21  |     // Look for assessment link in navigation or home page
  22  |     const assessmentLink = page.locator('text=Assessments, text=Take Assessment, text=Blueprint');
  23  |     
  24  |     if (await assessmentLink.first().isVisible()) {
  25  |       await assessmentLink.first().click();
  26  |       
  27  |       // Should see assessment form
  28  |       await expect(page.locator('text=Blueprint, text=Assessment, text=Financial').first()).toBeVisible();
  29  |     } else {
  30  |       test.skip('Assessment link not available - may need navigation adjustment');
  31  |     }
  32  |   });
  33  | 
  34  |   test('should display training hub with all modules accessible', async ({ page }) => {
  35  |     await page.goto('/training/hub');
  36  |     await page.waitForLoadState('networkidle');
  37  | 
  38  |     // Verify we're on training hub using data-testid
  39  |     await expect(page.locator('[data-testid="training-hub-title"]')).toBeVisible();
  40  | 
  41  |     // Verify module cards exist using data-testid
  42  |     await expect(page.locator('[data-testid="module-card-module-1-foundation"]')).toBeVisible();
  43  |     await expect(page.locator('[data-testid="module-card-module-2-mythbusting"]')).toBeVisible();
  44  |     await expect(page.locator('[data-testid="module-card-module-3-strategy"]')).toBeVisible();
  45  | 
  46  |     // Verify first module is clickable
  47  |     const firstModule = page.locator('[data-testid="module-card-module-1-foundation"]');
  48  |     await expect(firstModule).toBeVisible();
  49  |   });
  50  | 
  51  |   test('should navigate from results to training recommendations', async ({ page }) => {
  52  |     // Start at training hub
  53  |     await page.goto('/training/hub');
  54  |     
  55  |     // Click on a module (click the module card)
  56  |     const moduleCard = page.locator('div').filter({ hasText: 'Module 1: Foundation' }).first();
  57  |     await moduleCard.click();
> 58  |     await page.waitForURL(/\/training\/module-1/);
      |                ^ TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
  59  |     
  60  |     // Should see module content
  61  |     await expect(page.locator('text=Module 1, text=Foundation, text=Welcome').first()).toBeVisible();
  62  |     
  63  |     // Should be able to navigate back to hub
  64  |     const backButton = page.locator('button:has-text("Back"), button:has-text("←")');
  65  |     if (await backButton.isVisible()) {
  66  |       await backButton.click();
  67  |       await page.waitForURL('/training/hub');
  68  |     }
  69  |   });
  70  | 
  71  |   test('should display personalized tips based on progress', async ({ page }) => {
  72  |     await page.goto('/training/hub');
  73  |     
  74  |     // Check for tips section or personalized recommendations
  75  |     const tipsSection = page.locator('text=Tips, text=Recommend, text=Personalized');
  76  |     
  77  |     if (await tipsSection.first().isVisible()) {
  78  |       // Should see some guidance text
  79  |       await expect(tipsSection.first()).toBeVisible();
  80  |     }
  81  |   });
  82  | });
  83  | 
  84  | test.describe('Full App Journey', () => {
  85  |   test('should complete new user onboarding journey', async ({ page }) => {
  86  |     await page.goto('/');
  87  |     await page.waitForLoadState('networkidle');
  88  | 
  89  |     // Should see welcome page with navigation
  90  |     await expect(page.locator('span:has-text("Your Wealth")').first()).toBeVisible();
  91  |     await expect(page.locator('[data-testid="nav-training"]').first()).toBeVisible();
  92  | 
  93  |     // Navigate to training hub using helper
  94  |     await navigateAndWait(page, '[data-testid="nav-training"]', /training/);
  95  | 
  96  |     // Check if we're on a training-related page
  97  |     const currentUrl = page.url();
  98  |     expect(currentUrl).toContain('training');
  99  |   });
  100 | 
  101 |   test('should maintain state between page navigations', async ({ page }) => {
  102 |     // Start at training hub
  103 |     await page.goto('/training/hub');
  104 |     await page.waitForLoadState('networkidle');
  105 | 
  106 |     // Navigate to Module 1 using helper
  107 |     await clickModuleCard(page, 'module-1-foundation', /\/training\/module-1/);
  108 | 
  109 |     // Navigate back
  110 |     await page.goBack();
  111 |     await page.waitForURL(/\/training\/hub/);
  112 |     await page.waitForLoadState('networkidle');
  113 | 
  114 |     // Navigate forward
  115 |     await page.goForward();
  116 |     await page.waitForURL(/\/training\/module-1/);
  117 |     await page.waitForLoadState('networkidle');
  118 | 
  119 |     // State should be maintained
  120 |     await expect(page.locator('h3:has-text("Module 1: Foundation")').first()).toBeVisible();
  121 |   });
  122 | 
  123 |   test('should handle browser refresh gracefully', async ({ page }) => {
  124 |     await page.goto('/training/hub');
  125 |     await page.waitForLoadState('networkidle');
  126 | 
  127 |     // Refresh page
  128 |     await page.reload();
  129 |     await page.waitForLoadState('networkidle');
  130 | 
  131 |     // Should still see training hub using data-testid
  132 |     await expect(page.locator('[data-testid="training-hub-title"]')).toBeVisible();
  133 |   });
  134 | 
  135 |   test('should be responsive on mobile viewport', async ({ page }) => {
  136 |     // Set mobile viewport
  137 |     await page.setViewportSize({ width: 375, height: 667 });
  138 |     await page.goto('/training/hub');
  139 |     await page.waitForLoadState('networkidle');
  140 | 
  141 |     // Should still see content using data-testid
  142 |     await expect(page.locator('[data-testid="training-hub-title"]')).toBeVisible();
  143 | 
  144 |     // Mobile menu should work if present
  145 |     const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], .hamburger, .menu-button');
  146 |     if (await menuButton.isVisible()) {
  147 |       await menuButton.click();
  148 |       await page.waitForTimeout(500);
  149 |     }
  150 |   });
  151 | });
  152 | 
  153 | test.describe('Accessibility', () => {
  154 |   test('should have proper heading hierarchy', async ({ page }) => {
  155 |     await page.goto('/training/hub');
  156 |     
  157 |     // Check for h1 heading
  158 |     const h1 = page.locator('h1');
```