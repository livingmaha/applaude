import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle(/Applaude/);
});

test('allows a user to sign up', async ({ page }) => {
  await page.goto('http://localhost:5173/signup');

  // Fill out the form
  await page.getByPlaceholder('Username').fill('testuser');
  await page.getByPlaceholder('Email').fill(`testuser-${Date.now()}@example.com`);
  await page.getByPlaceholder('Password').fill('password123');
  
  // Click the sign-up button
  await page.getByRole('button', { name: /Sign Up/i }).click();

  // Expect to be redirected to the dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByRole('heading', { name: /Your Projects/i })).toBeVisible();
});
