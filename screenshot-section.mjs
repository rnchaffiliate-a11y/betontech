import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, "temporary screenshots");
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

const url = process.argv[2] || "http://localhost:3000";
const scrollY = parseInt(process.argv[3] || "0", 10);
const label = process.argv[4] ? `-${process.argv[4]}` : "";

let n = 1;
while (fs.existsSync(path.join(screenshotDir, `section-${n}${label}.png`))) n++;
const outPath = path.join(screenshotDir, `section-${n}${label}.png`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });

// Scroll and trigger scroll events
await page.evaluate((sy) => {
  window.scrollTo(0, sy);
  window.dispatchEvent(new Event('scroll'));
}, scrollY);

await new Promise(r => setTimeout(r, 500));

// Trigger scroll events multiple times to let animations settle
await page.evaluate((sy) => {
  for (let i = 0; i <= 10; i++) {
    const pos = sy * (i / 10);
    window.scrollTo(0, pos);
    window.dispatchEvent(new Event('scroll'));
  }
  window.scrollTo(0, sy);
  window.dispatchEvent(new Event('scroll'));
}, scrollY);

await new Promise(r => setTimeout(r, 800));

await page.screenshot({ path: outPath });
await browser.close();
console.log(`Saved: ${outPath}`);
