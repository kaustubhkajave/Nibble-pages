// Tell IndexNow search engines (Bing, which ChatGPT search relies on, plus Yandex,
// Seznam and Naver) about changed pages. Run after a deploy is live:
//   node scripts/indexnow.mjs                 every URL in sitemap.xml
//   node scripts/indexnow.mjs /recipes/x/ ... only these paths or URLs
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const site = "https://cookwithnibble.com";
const root = resolve(import.meta.dirname, "..");
// The key file at the site root proves we own the host.
const keyFile = readdirSync(root).find(name => /^[0-9a-f]{32}\.txt$/.test(name));
if (!keyFile) throw new Error("IndexNow key file missing from the site root");
const key = readFileSync(resolve(root, keyFile), "utf8").trim();

const args = process.argv.slice(2);
const urls = args.length
  ? args.map(arg => new URL(arg, site).href)
  : [...readFileSync(resolve(root, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${keyFile}`, urlList: urls }),
});
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urls.length} URLs`);
if (!response.ok) process.exitCode = 1;
