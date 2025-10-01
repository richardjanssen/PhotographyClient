import { test, expect } from 'playwright/test';

test('has RIESJ as title', async ({ loginPage, page }) => {
    await loginPage.goto();
    await expect(page).toHaveTitle(/RIESJ/);
});

test('credentials can be filled', async ({ loginPage }) => {
    await loginPage.goto();

    const someUsername = 'someUsername';
    const somePassword = 'somePassword';
    await loginPage.fillCredentials(someUsername, somePassword);

    await expect(loginPage.username).toHaveValue(someUsername);
    await expect(loginPage.password).toHaveValue(somePassword);
});
