// NO-Q complimentary (business) cards: North American 3.5 x 2 in, with 0.125 in bleed (3.75 x 2.25 in files).
// From production/:  node brand-kit/business-cards.js
// Writes site/kit/business-cards/:
//   <slug>-print.pdf   2 pages (front, back) at bleed size, for the printer
//   <slug>-front.png / <slug>-back.png   600 dpi, with bleed
//   <slug>-proof.png   both sides trimmed, for checking
// Add a person to PEOPLE and re-run. Only put details on a card that the person has confirmed.
const { chromium } = require("playwright");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { C } = require("../lib/stills-kit");

const OUT = path.join(__dirname, "..", "..", "site", "kit", "business-cards");
const LOGOS = path.join(__dirname, "..", "assets", "brand");
const svgUri = (f) => `data:image/svg+xml;base64,${fs.readFileSync(path.join(LOGOS, f)).toString("base64")}`;
const LOGO_LIGHT = svgUri("NO-QLogo-new.svg");

// slug: file name. phone is optional; leave "" to omit the line.
const PEOPLE = [
    { slug: "template", name: "Your Name", title: "Title", email: "name@no-q.ca", phone: "" },
    { slug: "general", name: "NO-Q", title: "Mobile ordering for events and venues", email: "contact@no-q.ca", phone: "", company: true },
];
const SITE = "no-q.ca";
const QR_URL = "https://www.no-q.ca";

// 96 CSS px per inch. Trim 336 x 192, bleed 12 px each side.
const B = 12, W = 336 + 2 * B, H = 192 + 2 * B;

const chevrons = (w, a, b, op = 1) =>
    `<svg width="${w}" height="${(w * 21.5) / 21.2}" viewBox="0 0 21.2 21.5" aria-hidden="true" style="opacity:${op}"><path d="M6.5 10.2L0 0h4.6l6.5 10.2L4.6 21.5H0z" fill="${a}"/><path d="M16.6 10.2L10.1 0h4.6l6.5 10.2-6.5 11.3h-4.6z" fill="${b}"/></svg>`;

const front = (p) => `
<div class="side front">
  <div class="chev">${chevrons(230, C.lime, C.lime2, 0.13)}</div>
  <img class="logo" src="${LOGO_LIGHT}" alt="NO-Q">
  <div class="who">
    <div class="name ${p.company ? "co" : ""}">${p.company ? "Lines are so last year." : p.name}</div>
    <div class="title">${p.title}</div>
  </div>
  <div class="contact">
    ${p.phone ? `<span>${p.phone}</span>` : ""}
    <span>${p.email}</span>
    <span class="site">${SITE}</span>
  </div>
  <div class="loc">Calgary, Alberta</div>
</div>`;

const back = (qrSvg) => `
<div class="side back">
  <div class="line">
    <div class="big">Scan.<br>Order.<br>Skip the line.</div>
    <div class="small">Mobile ordering for busy events and venues. No app download.</div>
  </div>
  <div class="qr">${qrSvg}<span>${SITE}</span></div>
</div>`;

const CSS = `
@page{size:${W / 96}in ${H / 96}in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.side{position:relative;width:${W}px;height:${H}px;overflow:hidden;page-break-after:always;font-family:Inter,Arial,sans-serif}
/* safe area: 0.125 in inside trim = ${2 * B}px from the file edge */
.front{background:radial-gradient(circle at 92% 8%,rgba(206,242,78,.16),rgba(206,242,78,0) 45%),${C.ink};color:${C.text}}
.chev{position:absolute;right:-70px;top:-6px}
.logo{position:absolute;left:${2 * B + 2}px;top:${2 * B + 2}px;height:22px}
.who{position:absolute;left:${2 * B + 2}px;top:78px;right:${2 * B}px}
.name{font:700 17px/1.05 'Space Grotesk',sans-serif;letter-spacing:-.4px}
.name.co{color:${C.lime}}
.title{font:500 8px/1.3 Inter,sans-serif;color:${C.muted};margin-top:4px;letter-spacing:.2px}
.contact{position:absolute;left:${2 * B + 2}px;bottom:${2 * B + 2}px;display:flex;flex-direction:column;gap:2px;font:500 7.5px/1.25 Inter,sans-serif;color:${C.text}}
.contact .site{color:${C.lime};font-weight:700}
.loc{position:absolute;right:${2 * B + 2}px;bottom:${2 * B + 2}px;font:500 7px Inter,sans-serif;color:${C.muted}}
.back{background:${C.lime};color:${C.ink};display:flex;align-items:center;justify-content:space-between;padding:0 ${2 * B + 4}px}
.big{font:700 21px/1 'Space Grotesk',sans-serif;letter-spacing:-.7px}
.small{font:500 7px/1.35 Inter,sans-serif;margin-top:9px;max-width:150px;opacity:.75}
.qr{display:flex;flex-direction:column;align-items:center;gap:4px;font:700 7.5px 'Space Grotesk',sans-serif}
.qr svg{width:92px;height:92px;display:block}
`;

const fonts = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap">`;
const doc = (body, extra = "") => `<html><head>${fonts}<style>${CSS}${extra}</style></head><body>${body}</body></html>`;

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const qrSvg = await QRCode.toString(QR_URL, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#121212", light: "#0000" } });
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 600 / 96 });
    const load = async (html) => {
        await page.setContent(html, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
    };
    for (const p of PEOPLE) {
        await load(doc(front(p) + back(qrSvg)));
        await page.pdf({ path: path.join(OUT, `${p.slug}-print.pdf`), width: `${W / 96}in`, height: `${H / 96}in`, printBackground: true });
        const sides = page.locator(".side");
        await sides.nth(0).screenshot({ path: path.join(OUT, `${p.slug}-front.png`) });
        await sides.nth(1).screenshot({ path: path.join(OUT, `${p.slug}-back.png`) });

        // Proof: both sides trimmed, rounded like a real card, on a light table.
        const proof = `<div class="table">${[front(p), back(qrSvg)].map((s) => `<div class="trim">${s}</div>`).join("")}</div>`;
        const extra = `body{background:#e9ebe4}.table{display:flex;gap:28px;padding:28px;background:#e9ebe4;width:fit-content}.trim{width:336px;height:192px;overflow:hidden;border-radius:6px;box-shadow:0 10px 24px rgba(0,0,0,.18)}.trim .side{margin:-${B}px}`;
        const pp = await browser.newPage({ viewport: { width: 800, height: 260 }, deviceScaleFactor: 3 });
        await pp.setContent(doc(proof, extra), { waitUntil: "networkidle" });
        await pp.evaluate(() => document.fonts.ready);
        await pp.locator(".table").screenshot({ path: path.join(OUT, `${p.slug}-proof.png`) });
        await pp.close();
        console.log("saved", p.slug);
    }
    await browser.close();
})();
