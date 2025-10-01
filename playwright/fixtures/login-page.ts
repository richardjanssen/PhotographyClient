import type { Page, Locator } from '@playwright/test';

export class LoginPage {
    public readonly username: Locator;
    public readonly password: Locator;

    constructor(public readonly page: Page) {
        this.username = this.page.getByPlaceholder('Username');
        this.password = this.page.getByPlaceholder('Password');
    }

    async goto(): Promise<void> {
        await this.page.goto('/login');
    }

    async fillCredentials(username: string, password: string): Promise<void> {
        await this.username.fill(username);
        await this.password.fill(password);
    }
}
