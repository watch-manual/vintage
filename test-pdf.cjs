const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const testPage = async (name) => {
    const page = await browser.newPage();
    if (name === 'MOBILE') {
      await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const ua = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
      await page.setUserAgent(ua);
    }
    page.on('console', msg => console.log(`[${name} CONSOLE]`, msg.type(), msg.text()));
    page.on('pageerror', err => console.log(`[${name} PAGEERROR]`, err.message));
    page.on('requestfailed', req => console.log(`[${name} REQUEST FAILED]`, req.url(), req.failure()?.errorText));
    page.on('response', resp => {
      if (resp.status() >= 400) {
        console.log(`[${name} RESPONSE ERROR]`, resp.status(), resp.url());
      }
    });
    await page.goto('https://vintage.watchdoc.workers.dev/caliber/7123A/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
    const html = await page.evaluate(() => document.querySelector('#pdf-canvas')?.parentElement?.innerHTML || 'no canvas');
    console.log(`[${name} CANVAS PARENT]`, html.substring(0, 300));
    await page.close();
  };

  await testPage('DESKTOP');
  await testPage('MOBILE');

  await browser.close();
})();
