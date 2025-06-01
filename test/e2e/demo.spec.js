const { test, expect } = require('@playwright/test');

// Simple placeholder test to ensure Playwright can run in CI
test('E2E tests require Playwright', async ({ page }) => {
  // Minimal test to verify Playwright is working
  await page.goto('data:text/html,<h1>Test</h1>');
  await expect(page.locator('h1')).toHaveText('Test');
});
