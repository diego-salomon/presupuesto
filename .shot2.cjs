const { chromium } = require('@playwright/test');
// args: url out width height dsf fullpage(0/1) mobile(0/1) [waitMs]
const [, , url, out, w, h, dsf, full, mobile, waitMs] = process.argv;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: +w, height: +h },
    deviceScaleFactor: +dsf,
    isMobile: mobile === '1',
    hasTouch: mobile === '1',
  });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(waitMs ? +waitMs : 2000);
  await p.screenshot({ path: out, fullPage: full === '1' });
  await b.close();
  console.log('ok ' + out);
})().catch(e => { console.error(e.message); process.exit(1); });
