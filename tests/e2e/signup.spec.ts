import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('allows a user to sign up', async ({ page }) => {
    await page.goto('/signup');

    // Fill out the form
    await page.getByPlaceholder('Email').fill(`testuser-${Date.now()}@example.com`);
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByPlaceholder('Confirm Password').fill('password123');

    // Click the sign-up button
    await page.getByRole('button', { name: /Sign Up/i }).click();

    // Expect to be redirected to the dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome/i })).toBeVisible();
  });

  test('allows a user to log in', async ({ page }) => {
    // First, sign up a user to ensure the user exists
    const email = `testuser-${Date.now()}@example.com`;
    await page.goto('/signup');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByPlaceholder('Confirm Password').fill('password123');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await page.waitForURL(/.*dashboard/);
    await page.getByRole('button', { name: /Logout/i }).click();
    await page.waitForURL(/.*login/);


    // Now, log in
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: /Login/i }).click();

    // Expect to be redirected to the dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome/i })).toBeVisible();
  });
});

test.describe('Critical User Flows', () => {
    test.beforeEach(async ({ page }) => {
        const email = `testuser-${Date.now()}@example.com`;
        await page.goto('/signup');
        await page.getByPlaceholder('Email').fill(email);
        await page.getByPlaceholder('Password').fill('password123');
        await page.getByPlaceholder('Confirm Password').fill('password123');
        await page.getByRole('button', { name: /Sign Up/i }).click();
        await page.waitForURL(/.*dashboard/);
    });

    test('allows a user to create a project', async ({ page }) => {
        await page.goto('/create-project');

        await page.getByLabel('Project Name').fill('My E2E Project');
        await page.getByLabel('Source URL').fill('https://example.com');
        await page.getByRole('button', { name: 'Start Building' }).click();

        await expect(page).toHaveURL(/.*\/project\/\d+/);
        await expect(page.getByRole('heading', { name: /My E2E Project/i })).toBeVisible();
    });

    test('allows a user to request a testimonial', async ({ page }) => {
        // This test assumes a project has been created and the user can navigate to it.
        // This is a placeholder for the actual implementation of testimonial requests.
    });

    test('allows a user to upload and manage a mobile app', async ({ page }) => {
        // This is a placeholder for the actual implementation of app uploads.
    });
});
