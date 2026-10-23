import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { config, resolvePages } from '../utils/config';

const reg = resolvePages().find(p => p.name === 'registration');
test.skip(!reg, 'registration page not in target');

test.describe('Keyboard navigation (WCAG 2.1.1, 2.4.3, 2.4.7)', () => {
  test('focus order matches expected DOM/visual order', async ({ page }) => {
    const rp = new RegistrationPage(page, reg!.url);
    await rp.open();
    expect(await rp.tabSequence()).toEqual(config.expectedFocusOrder.registration);
  });

  test('interactive controls are reachable and operable by keyboard', async ({ page }) => {
    const rp = new RegistrationPage(page, reg!.url);
    await rp.open();
    await expect(rp.menuButton()).toBeVisible();
    await rp.menuButton().focus();
    await expect(rp.menuButton()).toBeFocused();
    await expect(rp.submitButton()).toBeVisible();
  });

  test('focused elements show a visible focus indicator', async ({ page }) => {
    const rp = new RegistrationPage(page, reg!.url);
    await rp.open();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await rp.focusIsVisible()).toBe(true);
  });

  test('skip link moves focus to main content (2.4.1)', async ({ page }) => {
    const rp = new RegistrationPage(page, reg!.url);
    await rp.open();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  });
});
