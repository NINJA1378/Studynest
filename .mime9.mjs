import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
const page = await browser.newPage();
page.on('request', r => { const rt = r.resourceType(); if (['script','xhr','fetch','other','manifest'].includes(rt)) { r.continue?.(); } });
page.on('response', r => {
  const ct = r.headers()['content-type'] || '';
  if (/text\/html/.test(ct)) {
    console.log('HTML RESP:', r.status(), r.request().resourceType(), '|', r.url().slice(0,120));
  }
});
await page.goto('http://localhost:3000', { waitUntil:'networkidle0', timeout:60000 }).catch(()=>{});
await new Promise(r=>setTimeout(r,4000));
await browser.close();
