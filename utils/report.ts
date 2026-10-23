import fs from 'fs';
import path from 'path';
import type { AxeResults } from 'axe-core';

const OUT = path.join(__dirname, '..', 'reports', 'axe');

/** Writes JSON + a standalone HTML summary for one scanned page. */
export function writeAxeReport(name: string, results: AxeResults): string {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(results, null, 2));
  const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  const rows = results.violations.map(v => `<tr><td>${esc(v.id)}</td><td>${v.impact ?? ''}</td>
<td>${esc(v.help)}</td><td>${v.tags.filter(t => t.startsWith('wcag')).join(', ')}</td><td>${v.nodes.length}</td>
<td><ul>${v.nodes.slice(0, 5).map(n => `<li><code>${esc(n.target.join(' '))}</code></li>`).join('')}</ul></td></tr>`).join('\n');
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Accessibility report: ${esc(name)}</title>
<style>body{font-family:sans-serif;margin:2rem}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:.4rem;text-align:left;vertical-align:top}th{background:#1f3a5f;color:#fff}.ok{color:#0a6b2d}.bad{color:#a40000}</style></head>
<body><h1>Accessibility report: ${esc(name)}</h1><p>URL: ${esc(results.url)}<br>Scanned: ${results.timestamp}<br>Engine: axe-core ${results.testEngine.version}</p>
<p class="${results.violations.length ? 'bad' : 'ok'}"><strong>${results.violations.length}</strong> rule violations, <strong>${results.passes.length}</strong> rules passed, <strong>${results.incomplete.length}</strong> need manual review.</p>
<table><thead><tr><th scope="col">Rule</th><th scope="col">Impact</th><th scope="col">Description</th><th scope="col">WCAG tags</th><th scope="col">Nodes</th><th scope="col">Sample targets</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No violations found.</td></tr>'}</tbody></table></body></html>`;
  const file = path.join(OUT, `${name}.html`);
  fs.writeFileSync(file, html);
  return file;
}
