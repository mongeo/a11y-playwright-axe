import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { resolvePages } from '../utils/config';

for (const p of resolvePages()) {
  test(`axe WCAG 2.2 AA scan: ${p.name}`, async ({ page }, testInfo) => {
    const bp = new BasePage(page, p.url, p.name);
    await bp.open();
    const results = await bp.scan(testInfo);
    const summary = results.violations.map(v => `${v.id} (${v.impact}) x${v.nodes.length}`);
    expect(summary, 'axe violations').toEqual([]);
  });
}
