import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "temporary screenshots");
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

const wBox = await page.$('#layer-section').then(el => el.boundingBox());

// Layer 1: AB ploča
const t1 = wBox.y + wBox.height * 0.07;
await page.evaluate(y => window.scrollTo(0, y), t1);
await wait(900);
let sy = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: path.join(dir, 'new-l1.png'), clip:{x:0,y:sy,width:1440,height:900}});
console.log('L1 at', sy);

// Layer 2: Izolacija
const t2 = wBox.y + wBox.height * 0.30;
await page.evaluate(y => window.scrollTo(0, y), t2);
await wait(900);
sy = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: path.join(dir, 'new-l2.png'), clip:{x:0,y:sy,width:1440,height:900}});
console.log('L2 at', sy);

// Layer 4: Estrih (main)
const t4 = wBox.y + wBox.height * 0.65;
await page.evaluate(y => window.scrollTo(0, y), t4);
await wait(900);
sy = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: path.join(dir, 'new-l4.png'), clip:{x:0,y:sy,width:1440,height:900}});
console.log('L4 at', sy);

// Exploded view
const t5 = wBox.y + wBox.height * 0.93;
await page.evaluate(y => window.scrollTo(0, y), t5);
await wait(900);
sy = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: path.join(dir, 'new-exploded.png'), clip:{x:0,y:sy,width:1440,height:900}});
console.log('Exploded at', sy);

// Mobile layer view
await page.setViewport({ width: 390, height: 844 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
const mBox = await page.$('#layer-section').then(el => el.boundingBox());
const mt = mBox.y + mBox.height * 0.63;
await page.evaluate(y => window.scrollTo(0, y), mt);
await wait(900);
sy = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: path.join(dir, 'new-mob-estrih.png'), clip:{x:0,y:sy,width:390,height:844}});
console.log('Mobile estrih at', sy);

await browser.close();
console.log('Done.');
