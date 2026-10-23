import fs from 'fs';
import path from 'path';

export interface PageEntry { name: string; path: string }
export interface Target { baseURL: string; pages: PageEntry[] }
export interface A11yConfig { tags: string[]; targets: Record<string, Target>; expectedFocusOrder: Record<string, string[]> }

export const config: A11yConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'a11y.config.json'), 'utf-8'));

/** Target chosen by A11Y_TARGET env var (default "fixed"). A11Y_URLS="url1,url2" overrides with ad-hoc URLs. */
export function resolvePages(): { name: string; url: string }[] {
  if (process.env.A11Y_URLS) {
    return process.env.A11Y_URLS.split(',').map((u, i) => ({ name: `url-${i + 1}`, url: u.trim() }));
  }
  const t = config.targets[process.env.A11Y_TARGET ?? 'fixed'];
  if (!t) throw new Error(`Unknown A11Y_TARGET ${process.env.A11Y_TARGET}`);
  return t.pages.map(p => ({ name: p.name, url: new URL(p.path, t.baseURL).toString() }));
}
