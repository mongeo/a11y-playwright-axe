import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
  constructor(page: Page, url: string) { super(page, url, 'registration'); }
  menuButton() { return this.page.getByRole('button', { name: 'Menu' }); }
  submitButton() { return this.page.getByRole('button', { name: 'Register' }); }
  field(label: string) { return this.page.getByLabel(label); }
}
