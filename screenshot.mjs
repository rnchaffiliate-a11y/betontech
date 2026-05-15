import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, "temporary screenshots");

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] ? `-${process.argv[3]}` : "";

// Find next available N so we never overwrite
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}${label}.png`))) n++;
const outPath = path.join(screenshotDir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
