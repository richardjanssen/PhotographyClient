import { test as base } from '@playwright/test';

import { LoginPage } from './fixtures/login-page';

// Declare the types of your fixtures.
interface RiesjFixtures {
    loginPage: LoginPage;
}

export const test = base.extend<RiesjFixtures>({
    loginPage: async ({ page }, use) => {
        const todoPage = new LoginPage(page);
        await use(todoPage);
    }
});
export { expect } from '@playwright/test';
