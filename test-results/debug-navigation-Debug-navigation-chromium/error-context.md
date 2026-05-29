# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: debug-navigation.spec.ts >> Debug navigation
- Location: e2e/debug-navigation.spec.ts:3:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/training/hub" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "Your Wealth" [ref=e7] [cursor=pointer]:
        - /url: /your-wealth/
        - generic [ref=e8]: Your Wealth
      - generic [ref=e9]:
        - link "Training" [active] [ref=e10] [cursor=pointer]:
          - /url: /your-wealth/training/hub
        - link "Assessments" [ref=e11] [cursor=pointer]:
          - /url: /your-wealth/assessments/blueprint
        - link "Financial Data" [ref=e12] [cursor=pointer]:
          - /url: /your-wealth/assessments/currency
        - link "Financial Plan" [ref=e13] [cursor=pointer]:
          - /url: /your-wealth/assessments/currency
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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Debug navigation', async ({ page }) => {
  4  |   await page.goto('https://gannino.github.io/your-wealth/');
  5  |   await page.waitForLoadState('networkidle');
  6  | 
  7  |   // Log all navigation links
  8  |   const navLinks = page.locator('nav a');
  9  |   const count = await navLinks.count();
  10 |   console.log('Navigation links count:', count);
  11 | 
  12 |   for (let i = 0; i < count; i++) {
  13 |     const text = await navLinks.nth(i).textContent();
  14 |     const href = await navLinks.nth(i).getAttribute('href');
  15 |     console.log(`Link ${i}: "${text}" -> ${href}`);
  16 |   }
  17 | 
  18 |   // Try to click Training link
  19 |   const trainingLink = page.locator('nav a:has-text("Training")');
  20 |   console.log('Training link visible:', await trainingLink.isVisible());
  21 | 
  22 |   if (await trainingLink.isVisible()) {
  23 |     await trainingLink.click();
> 24 |     await page.waitForURL('/training/hub', { timeout: 5000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
  25 |     console.log('Successfully navigated to training hub');
  26 | 
  27 |     // Check what's on the page
  28 |     const h1Text = await page.locator('h1').textContent();
  29 |     console.log('Training hub h1:', h1Text);
  30 |   }
  31 | });
  32 | 
```