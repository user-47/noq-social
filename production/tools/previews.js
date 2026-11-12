// Makes the 720x900 JPEG previews the site uses: site/batches/batch-N/full/*.png -> img/*.jpg.  node tools/previews.js <N or folder name, e.g. special-2026-27>
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const n = process.argv[2];
if (!n) throw new Error("usage: node tools/previews.js <batch number or folder name>");
const dir = path.join(__dirname, "..", "..", "site", "batches", /^\d+$/.test(n) ? `batch-${n}` : n), src = path.join(dir, "full"), out = path.join(dir, "img");
(async () => {
    fs.mkdirSync(out, { recursive: true });
    const b = await chromium.launch();
    const p = await b.newPage({ viewport: { width: 720, height: 900 } });
    for (const f of fs.readdirSync(src).filter((f) => f.endsWith(".png"))) {
        await p.setContent(`<body style="margin:0"><img src="data:image/png;base64,${fs.readFileSync(path.join(src, f)).toString("base64")}" style="width:720px;height:900px;display:block"></body>`);
        await p.waitForTimeout(50);
        await p.screenshot({ path: path.join(out, f.replace(".png", ".jpg")), type: "jpeg", quality: 84 });
        console.log("preview", f);
    }
    await b.close();
})();
