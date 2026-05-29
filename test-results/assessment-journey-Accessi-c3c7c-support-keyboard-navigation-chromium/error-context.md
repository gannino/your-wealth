# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assessment-journey.spec.ts >> Accessibility >> should support keyboard navigation
- Location: e2e/assessment-journey.spec.ts:183:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator(':focus')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator(':focus')

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
  - heading "Training Center" [level=1]
  - paragraph: Build your foundation before assessments
  - heading "Why Complete Training?" [level=2]
  - text: 🎯
  - heading "Accurate Results" [level=3]
  - paragraph: Understanding key concepts leads to more accurate self-assessment
  - text: 💡
  - heading "Better Decisions" [level=3]
  - paragraph: Learn proven principles that guide successful financial planning
  - text: ⚡
  - heading "Faster Progress" [level=3]
  - paragraph: Build the mental framework that accelerates your wealth journey
  - text: 🏛️
  - 'heading "Module 1: Foundation" [level=3]'
  - paragraph: 12-15 min
  - paragraph: Master your money psychology and establish your financial baseline. Uncover the 80/20 principle and your personal money story.
  - text: Not Started Start → 💡
  - 'heading "Module 2: Myth-Busting" [level=3]'
  - paragraph: 12-15 min
  - paragraph: Shatter the 9 financial myths that destroy wealth. Understand hidden fees and the power of index funds.
  - text: Not Started Start → ♟️
  - 'heading "Module 3: Strategy" [level=3]'
  - paragraph: 15-18 min
  - paragraph: Master asset allocation and core investment principles. Learn the Three-Bucket system and Core Four approach.
  - text: Not Started Start → 🎯
  - 'heading "Module 4: Execution" [level=3]'
  - paragraph: 12-15 min
  - paragraph: Select investments and advisors wisely. Learn to distinguish brokers from fiduciaries and ask the right questions.
  - text: Not Started Start → 🏆
  - 'heading "Module 5: Mastery" [level=3]'
  - paragraph: 10-12 min
  - paragraph: Navigate market volatility and master long-term psychology. Learn the Seven Freedom Facts and bear market strategies.
  - text: Not Started Start →
  - paragraph: Training is optional but recommended for best results.
  - button "Back to Home"
  - button "Begin Assessments →"
- contentinfo:
  - paragraph: © 2026 Your Wealth. All data stored locally in your browser.
```

# Test source

```ts
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
> 193 |     await expect(focusedElement).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  194 |   });
  195 | });
  196 | 
```