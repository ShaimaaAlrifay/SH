import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e)));

await page.goto('http://localhost:5173/SH/');
await page.waitForTimeout(1000);
for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(30); }

// step through the whole work beat, sampling every frag's rendered box at its peak opacity
const frags = ['f1','f2','f3','f4','f5','f6','f7'];
const results = {};
for (let i = 0; i < 260; i++) {
  await page.mouse.wheel(0, 55);
  await page.waitForTimeout(20);
  for (const id of frags) {
    if (results[id]) continue;
    const info = await page.evaluate((fid) => {
      const el = document.getElementById(fid);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const op = parseFloat(cs.opacity);
      if (op < 0.999) return null;
      const t = cs.transform;
      if (t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)') return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    }, id);
    if (info) results[id] = info;
  }
  if (Object.keys(results).length === frags.length) break;
}
console.log(JSON.stringify(results, null, 2));
console.log('ERRORS:', JSON.stringify(errors));
await browser.close();
