const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML length:', bodyHTML.length);
  if (bodyHTML.length < 1000) console.log(bodyHTML);
  await browser.close();
})();
