import { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';
import { config } from '../utils/config';
import { writeAxeReport } from '../utils/report';

export class BasePage {
  constructor(readonly page: Page, readonly url: string, readonly name: string) {}

  async open() { await this.page.goto(this.url); }

  /** Run axe with the configured WCAG 2.2 AA tag set; attaches JSON to the Playwright report. */
  async scan(testInfo?: TestInfo): Promise<AxeResults> {
    const results = await new AxeBuilder({ page: this.page }).withTags(config.tags).analyze();
    const file = writeAxeReport(`${this.name}-${process.env.A11Y_TARGET ?? 'fixed'}`, results);
    if (testInfo) {
      await testInfo.attach('axe-results', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
      await testInfo.attach('axe-report', { path: file, contentType: 'text/html' });
    }
    return results;
  }

  /** Tab through the page and return an accessible label for each focused element. */
  async tabSequence(max = 30): Promise<string[]> {
    const seen: string[] = [];

    for (let i = 0; i < max; i++) {
      await this.page.keyboard.press('Tab');
      const label = await this.page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') return el.id || el.tagName;
        return (el.getAttribute('aria-label') || el.innerText || el.id || el.tagName).trim();
      });
      if (!label || seen.includes(label)) break;
      seen.push(label);
    }
    return seen;
  }

  /** True if the focused element has a visible focus indicator (outline or box-shadow). */
  async focusIsVisible(): Promise<boolean> {
    return this.page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
    });
  }
}
