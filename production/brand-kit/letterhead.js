// NO-Q letterhead: US Letter (8.5 x 11 in), white paper, print-safe margins (no bleed).
// From production/:  node brand-kit/letterhead.js
// Writes site/kit/letterhead/: NO-Q-letterhead.pdf (blank), NO-Q-letterhead-sample.pdf,
// NO-Q-letterhead.docx (editable Word template, header/footer as images), and PNG previews.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const docx = require("docx");

const OUT = path.join(__dirname, "..", "..", "site", "kit", "letterhead");
const LOGOS = path.join(__dirname, "..", "assets", "brand");
const svgUri = (f) => `data:image/svg+xml;base64,${fs.readFileSync(path.join(LOGOS, f)).toString("base64")}`;
const LOGO_DARK = svgUri("No-Q_logo_light.svg"); // dark wordmark, for white paper

const C = { ink: "#121212", text: "#2b2d27", muted: "#6b6f63", line: "#e3e5dc", lime: "#cef24e", lime2: "#b8d945" };

// Contact details: only what's public on no-q.ca. Change here if you add a phone or street address.
const CONTACT = ["no-q.ca", "contact@no-q.ca", "Calgary, Alberta"];

// The logo's chevron, reused as a quiet motif.
const chev = (fill, op = 1) => `<path d="M6.5 10.2L0 0h4.6l6.5 10.2L4.6 21.5H0z" fill="${fill}" fill-opacity="${op}"/>`;
const chevrons = (w, fills, ops = [1, 1]) =>
    `<svg width="${w}" height="${(w * 21.5) / 21.2}" viewBox="0 0 21.2 21.5" aria-hidden="true">${chev(fills[0], ops[0])}<g transform="translate(10.1 0)">${chev(fills[1], ops[1])}</g></svg>`;

const HEAD = `
<div class="lh-head">
  <img class="logo" src="${LOGO_DARK}" alt="NO-Q">
  <div class="contact">${CONTACT.map((c) => `<span>${c}</span>`).join("")}</div>
</div>
<div class="rule"><i></i></div>`;

const FOOT = `
<div class="lh-foot">
  <span class="tag">${chevrons(13, [C.lime2, C.ink])}Mobile ordering for busy events and venues.</span>
  <span class="pill">no-q.ca</span>
</div>`;

const CSS = `
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:Inter,Arial,sans-serif;color:${C.text};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet{position:relative;width:8.5in;height:11in;overflow:hidden;background:#fff;page-break-after:always}
.lh-head{position:absolute;left:.75in;right:.75in;top:.6in;display:flex;justify-content:space-between;align-items:flex-start}
.logo{height:34px;display:block}
.contact{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font:500 9pt/1.35 Inter,sans-serif;color:${C.muted};letter-spacing:.1px}
.contact span:first-child{color:${C.ink};font-weight:600}
.rule{position:absolute;left:.75in;right:.75in;top:1.42in;height:1px;background:${C.line}}
.rule i{position:absolute;left:0;top:-1px;width:.9in;height:3px;border-radius:2px;background:${C.lime}}
.mark{position:absolute;right:-.55in;bottom:1.05in}
.lh-foot{position:absolute;left:.75in;right:.75in;bottom:.5in;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${C.line};padding-top:10px;font:500 8.5pt Inter,sans-serif;color:${C.muted}}
.lh-foot .tag{display:flex;align-items:center;gap:8px}
.pill{background:${C.lime};color:${C.ink};font:700 8.5pt 'Space Grotesk',sans-serif;padding:3px 10px;border-radius:999px;letter-spacing:.2px}
.body{position:absolute;left:.75in;right:.75in;top:1.85in;bottom:1.1in;font-size:10.5pt;line-height:1.55}
.body p{margin-bottom:11pt}
.body .date{color:${C.muted};margin-bottom:18pt}
.body .to{margin-bottom:18pt}
.body h2{font:700 15pt/1.2 'Space Grotesk',sans-serif;letter-spacing:-.3px;color:${C.ink};margin-bottom:12pt}
.body .sig{margin-top:22pt}
.body .sig b{display:block;color:${C.ink};font-weight:600}
`;

const sheet = (inner = "") => `<div class="sheet">${HEAD}<div class="mark">${chevrons(330, [C.lime, C.ink], [0.26, 0.045])}</div>${inner}${FOOT}</div>`;

// Sample letter: fictional recipient from the demo world (docs/brand.md). No invented claims.
const SAMPLE = `
<div class="body">
  <p class="date">November 13, 2026</p>
  <p class="to">Riverbend Events<br>Riverbend Commons, 1200 Riverside Dr SW<br>Calgary, AB T2P 0A1</p>
  <h2>Mobile ordering for Riverbend Night Market</h2>
  <p>Hello Riverbend team,</p>
  <p>Thank you for taking the time to talk with us about next June’s Riverbend Night Market. Here’s a short summary of how NO-Q would work on the night.</p>
  <p>You publish the event and print one event QR code. Guests scan it with their phone camera, browse every vendor and pay by card. There’s no app to download. Each vendor gets their own storefront QR and sees every order live on their dashboard, so guests can wait at their table instead of in a line.</p>
  <p>You invite all of your vendors with one link, and after the event you’ll see sales, orders and your busiest hour in Event insights.</p>
  <p>We’d be glad to set up a walkthrough with your team. Reply to this letter or write to contact@no-q.ca.</p>
  <p class="sig">Warm regards,<br><br><b>The NO-Q team</b>no-q.ca</p>
</div>`;

const page = (sheets) =>
    `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap"><style>${CSS}</style></head><body>${sheets}</body></html>`;

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await chromium.launch();
    const p = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
    const load = async (html) => {
        await p.setContent(html, { waitUntil: "networkidle" });
        await p.evaluate(() => document.fonts.ready);
    };

    await load(page(sheet()));
    await p.pdf({ path: path.join(OUT, "NO-Q-letterhead.pdf"), width: "8.5in", height: "11in", printBackground: true });
    await p.locator(".sheet").screenshot({ path: path.join(OUT, "preview-blank.png") });

    await load(page(sheet(SAMPLE)));
    await p.pdf({ path: path.join(OUT, "NO-Q-letterhead-sample.pdf"), width: "8.5in", height: "11in", printBackground: true });
    await p.locator(".sheet").screenshot({ path: path.join(OUT, "preview-sample.png") });

    // Header and footer bands for the Word template, at 300 dpi-ish (3x).
    const p3 = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 3.125 });
    await p3.setContent(page(sheet()), { waitUntil: "networkidle" });
    await p3.evaluate(() => document.fonts.ready);
    const headPng = await p3.screenshot({ clip: { x: 0, y: 0, width: 816, height: 1.5 * 96 } });
    const footPng = await p3.screenshot({ clip: { x: 0, y: 1056 - 0.85 * 96, width: 816, height: 0.85 * 96 } });
    // Faint chevron mark as a floating image behind the text.
    const markPng = await p3.locator(".mark").screenshot({ omitBackground: true });
    await browser.close();

    const { Document, Packer, Paragraph, TextRun, Header, Footer, ImageRun, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType } = docx;
    const EMU = 914400;
    const floating = (data, wIn, hIn, xIn, yIn, behind = true) =>
        new ImageRun({
            type: "png",
            data,
            transformation: { width: wIn * 96, height: hIn * 96 },
            floating: {
                horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: Math.round(xIn * EMU) },
                verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yIn * EMU) },
                wrap: { type: TextWrappingType.NONE },
                behindDocument: behind,
                allowOverlap: true,
            },
        });
    const markW = 330 / 96, markH = (330 * 21.5) / 21.2 / 96;
    const font = "Inter";
    const para = (text, opts = {}) => new Paragraph({ spacing: { after: 200, line: 300 }, children: [new TextRun({ text, font, size: 21, color: "2B2D27", ...opts })] });
    const doc = new Document({
        creator: "NO-Q",
        title: "NO-Q letterhead",
        styles: { default: { document: { run: { font, size: 21, color: "2B2D27" }, paragraph: { spacing: { after: 200, line: 300 } } } } },
        sections: [
            {
                properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 2660, bottom: 1580, left: 1080, right: 1080, header: 0, footer: 0 } } },
                headers: { default: new Header({ children: [new Paragraph({ children: [floating(headPng, 8.5, 1.5, 0, 0), floating(markPng, markW, markH, 8.5 + 0.55 - markW, 11 - 1.05 - markH)] })] }) },
                footers: { default: new Footer({ children: [new Paragraph({ children: [floating(footPng, 8.5, 0.85, 0, 11 - 0.85)] })] }) },
                children: [
                    para("Month DD, 2026", { color: "6B6F63" }),
                    new Paragraph({ spacing: { after: 200, line: 300 }, children: ["Recipient name", "Organization", "Street address", "Calgary, AB  Postal code"].map((text, i) => new TextRun({ text, font, size: 21, color: "2B2D27", break: i ? 1 : 0 })) }),
                    new Paragraph({ spacing: { before: 200, after: 240 }, children: [new TextRun({ text: "Subject line", font: "Space Grotesk", bold: true, size: 30, color: "121212" })] }),
                    para("Hello,"),
                    para("Start typing your letter here. The NO-Q header and footer are part of the page, so they repeat on every page and stay out of the way of your text."),
                    para("Warm regards,"),
                    para("Your name", { bold: true, color: "121212" }),
                    para("NO-Q · no-q.ca"),
                ],
            },
        ],
    });
    fs.writeFileSync(path.join(OUT, "NO-Q-letterhead.docx"), await Packer.toBuffer(doc));
    console.log("saved letterhead to", OUT);
})();
