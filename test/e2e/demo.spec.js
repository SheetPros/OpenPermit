const { test } = require('node:test');

// Playwright is not available in the offline test environment, so skip these tests
test.skip('E2E tests require Playwright', () => {});
