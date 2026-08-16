import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 640 });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise(r=>setTimeout(r,1500));
await page.screenshot({ path: '/tmp/opencode/auth-small.png', type: 'png' });
console.log('done');
