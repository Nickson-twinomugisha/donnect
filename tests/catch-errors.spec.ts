import { test, expect } from '@playwright/test';

test('catch console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  if (errors.length > 0) {
    console.error("PAGE ERRORS FOUND:");
    console.error(errors.join("\n"));
  } else {
    console.log("No console errors found.");
  }
});
