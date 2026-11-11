// Puts PNGs side by side into one image for quick review: node montage.js out.png a.png b.png ...
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const [out, ...files] = process.argv.slice(2);
  const imgs = files.map(f => `<figure><img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}"><figcaption>${require("path").basename(f,".png")}</figcaption></figure>`).join("");
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400 * files.length, height: 900 } });
  await p.setContent(`<style>body{margin:0;display:flex;gap:8px;background:#ddd;font:14px sans-serif}figure{margin:0;width:390px}img{width:390px;display:block}</style>${imgs}`);
  await p.screenshot({ path: out, fullPage: true }); await b.close();
})();
