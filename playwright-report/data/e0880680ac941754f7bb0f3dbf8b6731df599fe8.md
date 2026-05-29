# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment-journey.spec.ts >> Full App Journey >> should maintain state between page navigations
- Location: e2e/assessment-journey.spec.ts:101:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h3:has-text("Module 1: Foundation")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h3:has-text("Module 1: Foundation")').first()

```

```yaml
- navigation:
  - link "Your Wealth":
    - /url: /
  - link "Training":
    - /url: /training/hub
  - link "Assessments":
    - /url: /assessments/blueprint
  - link "Financial Data":
    - /url: /assessments/currency
  - link "Financial Plan":
    - /url: /assessments/currency
  - button "Clear Data"
- main:
  - text: Screen 1 of 7 14%
  - heading "Welcome to Foundation" [level=1]
  - paragraph: Your Money Mindset
  - paragraph:
    - text: Welcome to
    - strong: "Module 1: Foundation"
    - text: — the starting point of your financial mastery journey.
  - paragraph: In this module, you'll discover how your beliefs about money shape every financial decision you make.
  - heading "What You'll Learn:" [level=3]
  - list:
    - listitem: The 80/20 principle and why psychology drives results
    - listitem: How your money story was formed
    - listitem: How to identify and transform limiting beliefs
    - listitem: The mindset shifts that create lasting wealth
  - heading "⏱️ Time Investment" [level=3]
  - paragraph: Approximately 12-15 minutes to complete this module
  - paragraph: Ready to begin building your financial foundation? Let's get started.
  - button "← Back"
  - button "Continue →"
- contentinfo:
  - paragraph: © 2026 Your Wealth. All data stored locally in your browser.
```

# Test source

```ts
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
  58  |     await page.waitForURL(/\/training\/module-1/);
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
> 120 |     await expect(page.locator('h3:has-text("Module 1: Foundation")').first()).toBeVisible();
      |                                                                               ^ Error: expect(locator).toBeVisible() failed
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
  159 |     await expect(h1).toBeVisible();
  160 |     
  161 |     // Should have meaningful text
  162 |     const h1Text = await h1.textContent();
  163 |     expect(h1Text?.length).toBeGreaterThan(0);
  164 |   });
  165 | 
  166 |   test('should have accessible button labels', async ({ page }) => {
  167 |     await page.goto('/training/hub');
  168 |     
  169 |     // Check buttons have accessible names
  170 |     const buttons = page.locator('button');
  171 |     const count = await buttons.count();
  172 |     
  173 |     for (let i = 0; i < Math.min(count, 5); i++) {
  174 |       const button = buttons.nth(i);
  175 |       const textContent = await button.textContent();
  176 |       const ariaLabel = await button.getAttribute('aria-label');
  177 |       
  178 |       // Each button should have either text or aria-label
  179 |       expect(textContent || ariaLabel).toBeTruthy();
  180 |     }
  181 |   });
  182 | 
  183 |   test('should support keyboard navigation', async ({ page }) => {
  184 |     await page.goto('/training/hub');
  185 |     
  186 |     // Tab through interactive elements
  187 |     await page.keyboard.press('Tab');
  188 |     await page.keyboard.press('Tab');
  189 |     await page.keyboard.press('Tab');
  190 |     
  191 |     // Focus should be visible (indicated by focus outline or similar)
  192 |     const focusedElement = page.locator(':focus');
  193 |     await expect(focusedElement).toBeVisible();
  194 |   });
  195 | });
  196 | 
```