# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: training-journey.spec.ts >> Training Journey >> should track progress across modules
- Location: e2e/training-journey.spec.ts:83:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
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
      - generic [ref=e19]:
        - generic [ref=e20]: Screen 1 of 7
        - generic [ref=e21]: 14%
      - generic [ref=e24]:
        - heading "Welcome to Foundation" [level=1] [ref=e25]
        - paragraph [ref=e26]: Your Money Mindset
        - generic [ref=e27]:
          - generic [ref=e28]:
            - paragraph [ref=e29]:
              - text: Welcome to
              - strong [ref=e30]: "Module 1: Foundation"
              - text: — the starting point of your financial mastery journey.
            - paragraph [ref=e31]: In this module, you'll discover how your beliefs about money shape every financial decision you make.
            - generic [ref=e32]:
              - heading "What You'll Learn:" [level=3] [ref=e33]
              - list [ref=e34]:
                - listitem [ref=e35]: The 80/20 principle and why psychology drives results
                - listitem [ref=e36]: How your money story was formed
                - listitem [ref=e37]: How to identify and transform limiting beliefs
                - listitem [ref=e38]: The mindset shifts that create lasting wealth
            - generic [ref=e39]:
              - heading "⏱️ Time Investment" [level=3] [ref=e40]
              - paragraph [ref=e41]: Approximately 12-15 minutes to complete this module
            - paragraph [ref=e42]: Ready to begin building your financial foundation? Let's get started.
          - generic [ref=e43]:
            - button "← Back" [ref=e44] [cursor=pointer]
            - button "Continue →" [ref=e45] [cursor=pointer]
  - contentinfo [ref=e46]:
    - paragraph [ref=e48]: © 2026 Your Wealth. All data stored locally in your browser.
```

# Test source

```ts
  1   | /**
  2   |  * Training Journey E2E Tests
  3   |  *
  4   |  * Tests complete user training journey in the browser:
  5   |  * 1. Navigate to training hub
  6   |  * 2. Complete a training module with all screens
  7   |  * 3. Answer knowledge checks correctly
  8   |  * 4. Verify module completion
  9   |  * 5. Check progress dashboard updates
  10  |  */
  11  | 
  12  | import { test, expect } from '@playwright/test';
  13  | import { navigateAndWait, clickModuleCard } from './test-helpers';
  14  | 
  15  | test.describe('Training Journey', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     // Navigate to the app
  18  |     await page.goto('/');
  19  |   });
  20  | 
  21  |   test('should navigate to training hub and see all 5 modules', async ({ page }) => {
  22  |     // Navigate using helper with retry logic
  23  |     await navigateAndWait(page, '[data-testid="nav-training"]', '/training/hub');
  24  | 
  25  |     // Should see training hub title
  26  |     await expect(page.locator('[data-testid="training-hub-title"]')).toBeVisible();
  27  | 
  28  |     // Verify module cards exist using data-testid
  29  |     await expect(page.locator('[data-testid="module-card-module-1-foundation"]')).toBeVisible();
  30  |     await expect(page.locator('[data-testid="module-card-module-2-mythbusting"]')).toBeVisible();
  31  |     await expect(page.locator('[data-testid="module-card-module-3-strategy"]')).toBeVisible();
  32  |     await expect(page.locator('[data-testid="module-card-module-4-execution"]')).toBeVisible();
  33  |     await expect(page.locator('[data-testid="module-card-module-5-mastery"]')).toBeVisible();
  34  |   });
  35  | 
  36  |   test('should complete Module 1: Foundation journey', async ({ page }) => {
  37  |     // Navigate to training hub using helper
  38  |     await navigateAndWait(page, '[data-testid="nav-training"]', '/training/hub');
  39  | 
  40  |     // Start Module 1 using helper
  41  |     await clickModuleCard(page, 'module-1-foundation', '/training/module-1-foundation');
  42  | 
  43  |     // Verify intro screen
  44  |     await expect(page.locator('text=Welcome to Module 1')).toBeVisible();
  45  |     
  46  |     // Click Next through content screens
  47  |     await page.click('text=Next →');
  48  |     await expect(page.locator('text=The 80/20 Principle')).toBeVisible();
  49  |     
  50  |     await page.click('text=Next →');
  51  |     await expect(page.locator('text=Your Money Story')).toBeVisible();
  52  |     
  53  |     // Answer quiz question correctly
  54  |     await page.click('text=Next →');
  55  |     await expect(page.locator('text=Test Your Knowledge')).toBeVisible();
  56  |     
  57  |     // Select correct answer (second option typically correct)
  58  |     const quizOptions = page.locator('button:has-text("Select an option")');
  59  |     const count = await quizOptions.count();
  60  |     if (count > 1) {
  61  |       await quizOptions.nth(1).click();
  62  |     }
  63  |     
  64  |     // Wait for feedback
  65  |     await page.waitForTimeout(500);
  66  |     await page.click('text=Next →');
  67  |     
  68  |     // Navigate through scenario and reflection
  69  |     await page.click('text=Next →'); // Past scenario
  70  |     await page.click('text=Continue →'); // Past reflection
  71  |     
  72  |     // Verify completion screen
  73  |     await expect(page.locator('text=Module 1 Complete')).toBeVisible();
  74  |     
  75  |     // Return to hub
  76  |     await page.click('text=Complete');
  77  |     await page.waitForURL('/training/hub');
  78  |     
  79  |     // Verify Module 1 shows as complete
  80  |     await expect(page.locator('text=✓ Complete').first()).toBeVisible();
  81  |   });
  82  | 
  83  |   test('should track progress across modules', async ({ page }) => {
  84  |     // Navigate to training hub
  85  |     await page.goto('/training/hub');
  86  |     await page.waitForLoadState('networkidle');
  87  | 
  88  |     // Complete Module 1 using helper
  89  |     await clickModuleCard(page, 'module-1-foundation', '/training/module-1-foundation');
  90  |     
  91  |     // Navigate through screens quickly
  92  |     for (let i = 0; i < 6; i++) {
  93  |       const nextButton = page.locator('button:has-text("Next"), button:has-text("Complete")');
  94  |       if (await nextButton.isVisible()) {
  95  |         await nextButton.click();
  96  |         await page.waitForTimeout(300);
  97  |       }
  98  |     }
  99  |     
  100 |     // Return to hub
> 101 |     await page.waitForURL('/training/hub');
      |                ^ TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
  102 |     
  103 |     // Check progress indicator
  104 |     const progressText = await page.locator('text=/\\d+%/5').textContent();
  105 |     expect(progressText).toBeTruthy();
  106 |   });
  107 | 
  108 |   test('should display knowledge check feedback', async ({ page }) => {
  109 |     await page.goto('/training/module-2-mythbusting');
  110 |     
  111 |     // Navigate to quiz screen
  112 |     for (let i = 0; i < 3; i++) {
  113 |       const nextButton = page.locator('button:has-text("Next")');
  114 |       if (await nextButton.isVisible()) {
  115 |         await nextButton.click();
  116 |         await page.waitForTimeout(300);
  117 |       } else {
  118 |         break;
  119 |       }
  120 |     }
  121 |     
  122 |     // Should see quiz question
  123 |     const quizVisible = await page.locator('text=Test Your Knowledge').isVisible();
  124 |     if (quizVisible) {
  125 |       // Select an answer
  126 |       const options = page.locator('button[style*="border"]');
  127 |       if (await options.count() > 0) {
  128 |         await options.first().click();
  129 |         await page.waitForTimeout(500);
  130 |         
  131 |         // Should see feedback
  132 |         const feedbackVisible = await page.locator('text=feedback, text=Correct, text=Incorrect').isVisible();
  133 |         expect(feedbackVisible).toBeTruthy();
  134 |       }
  135 |     }
  136 |   });
  137 | });
  138 | 
  139 | test.describe('Progress Dashboard', () => {
  140 |   test('should display overall training progress', async ({ page }) => {
  141 |     // Start with training hub to establish baseline
  142 |     await page.goto('/training/hub');
  143 |     
  144 |     // Navigate to progress dashboard if available
  145 |     const dashboardLink = page.locator('text=Progress Dashboard');
  146 |     if (await dashboardLink.isVisible()) {
  147 |       await dashboardLink.click();
  148 |       
  149 |       // Should see progress overview
  150 |       await expect(page.locator('text=Your Training Progress')).toBeVisible();
  151 |       
  152 |       // Should see module progress section
  153 |       await expect(page.locator('text=Module Progress')).toBeVisible();
  154 |     }
  155 |   });
  156 | 
  157 |   test('should show achievements as modules complete', async ({ page }) => {
  158 |     await page.goto('/training/hub');
  159 |     
  160 |     // Check if achievements section exists
  161 |     const achievementsSection = page.locator('text=Achievements');
  162 |     if (await achievementsSection.isVisible()) {
  163 |       // Should see achievement badges
  164 |       await expect(page.locator('text=Quick Learner, text=Halfway There, text=Your Wealth Graduate').first()).toBeVisible();
  165 |     }
  166 |   });
  167 | });
  168 | 
```