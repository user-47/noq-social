// Shared kit for NO-Q 4:5 stills: brand tokens, app screens, iPhone 18 Pro + iPhone Duo mockups, post frame, renderer.
// A batch script defines `posts` ([{ id, slides: [html, ...] }]) and calls renderStills(posts, batchNumber).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SHOTS = path.join(__dirname, "..", "assets", "screens");
const ASSETS = path.join(__dirname, "..", "assets", "photos");
const LOGOS = path.join(__dirname, "..", "assets", "brand");

const uri = (file) => {
    const ext = path.extname(file).slice(1).toLowerCase();
    const type = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" }[ext];
    return `data:${type};base64,${fs.readFileSync(file).toString("base64")}`;
};
const shot = (name) => uri(path.join(SHOTS, `${name}.png`));
const photo = (name) => uri(path.join(ASSETS, name));
const LOGO_LIGHT = uri(path.join(LOGOS, "NO-QLogo-new.svg"));
const LOGO_TILE = uri(path.join(LOGOS, "NO-Q-Logo-Obsidian.png"));

// ---------- brand ----------
const C = { ink: "#121212", ink2: "#1a1b17", line: "#2e3029", text: "#f2f4ec", muted: "#a9ad9f", lime: "#cef24e" };

// ---------- iOS status bar ----------
const statusIcons = (color) => `
<svg width="74" height="14" viewBox="0 0 74 14" fill="${color}" aria-hidden="true">
  <rect x="0" y="9" width="3.2" height="5" rx="1"/><rect x="4.8" y="6.5" width="3.2" height="7.5" rx="1"/>
  <rect x="9.6" y="3.8" width="3.2" height="10.2" rx="1"/><rect x="14.4" y="1" width="3.2" height="13" rx="1"/>
  <path d="M30 3.2c2.7 0 5.2 1 7 2.8l1.3-1.3A11.7 11.7 0 0 0 30 1.3c-3.2 0-6.2 1.3-8.3 3.4L23 6a9.9 9.9 0 0 1 7-2.8Zm0 3.7c1.7 0 3.2.6 4.4 1.7l1.3-1.3A8 8 0 0 0 30 5c-2.2 0-4.2.9-5.7 2.3L25.6 8.6A6.2 6.2 0 0 1 30 6.9Zm0 3.7c.7 0 1.3.3 1.8.7L30 13.1l-1.8-1.8c.5-.4 1.1-.7 1.8-.7Z"/>
  <rect x="45" y="1.5" width="24" height="11" rx="3.4" fill="none" stroke="${color}" stroke-opacity=".45" stroke-width="1.2"/>
  <rect x="47" y="3.5" width="17" height="7" rx="2"/><path d="M70.5 5.3v3.4a1.8 1.8 0 0 0 0-3.4Z" fill-opacity=".45"/>
</svg>`;

// ---------- iPhone 18 Pro (71.9 x 150.0 mm; 6.3" 2622x1206 screen) ----------
const FINISH = {
    deepBlack: { edge: "linear-gradient(135deg,#4a4a4d,#1f1f22 40%,#3a3a3e 70%,#18181a)", btn: "#2a2a2d" },
    glacier: { edge: "linear-gradient(135deg,#d9e6ef,#9fb7c8 40%,#c8d8e4 70%,#8ea7b9)", btn: "#a9bfcf" },
    silver: { edge: "linear-gradient(135deg,#f1f1f0,#c4c4c2 40%,#e6e6e4 70%,#b4b4b2)", btn: "#cfcfcd" },
    burgundy: { edge: "linear-gradient(135deg,#7a2f3c,#4a1820 40%,#6b2532 70%,#3d131a)", btn: "#5a1d27" },
    starWhite: { edge: "linear-gradient(135deg,#ffffff,#c4c4c2 30%,#f4f4f2 55%,#a8a8a6 80%,#e6e6e4)", btn: "#d2d2d0" },
    nightSky: { edge: "linear-gradient(135deg,#46506a,#1e2332 40%,#3b4459 70%,#161a26)", btn: "#2a3042" },
};
// screen: {img, band: status-bar colour, ink: status text colour}
const iphone = ({ img, band = "#121212", ink = "#ffffff" }, { w = 440, finish = "deepBlack", style = "" } = {}) => {
    const f = FINISH[finish];
    const h = Math.round((w * 150.0) / 71.9);
    const edge = Math.round(w * 0.012);
    const bezel = Math.round(w * 0.016);
    const sw = w - 2 * (edge + bezel);
    const statusH = Math.round((sw * 54) / 402);
    const r = Math.round(w * 0.18);
    const btn = (side, top, height) =>
        `<i style="position:absolute;${side}:-${Math.round(w * 0.009)}px;top:${Math.round(h * top)}px;width:${Math.round(w * 0.012)}px;height:${Math.round(h * height)}px;background:${f.btn};border-radius:3px"></i>`;
    return `
<div class="device" style="position:relative;width:${w}px;height:${h}px;${style}">
  ${btn("left", 0.135, 0.04)}${btn("left", 0.205, 0.07)}${btn("left", 0.29, 0.07)}
  ${btn("right", 0.235, 0.105)}
  <i style="position:absolute;right:-${Math.round(w * 0.006)}px;top:${Math.round(h * 0.52)}px;width:${Math.round(w * 0.008)}px;height:${Math.round(h * 0.075)}px;background:${f.btn};border-radius:3px;filter:brightness(.8)"></i>
  <div style="position:absolute;inset:0;border-radius:${r}px;background:${f.edge};padding:${edge}px;box-shadow:0 40px 80px rgba(0,0,0,.55),0 8px 24px rgba(0,0,0,.4)">
    <div style="width:100%;height:100%;border-radius:${r - edge}px;background:#050505;padding:${bezel}px">
      <div style="position:relative;width:100%;height:100%;border-radius:${r - edge - bezel}px;overflow:hidden;background:${band}">
        <div style="height:${statusH}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${Math.round(sw * 0.085)}px 0 ${Math.round(sw * 0.11)}px;color:${ink};font:600 ${Math.round(sw * 0.042)}px -apple-system,'SF Pro Text','Inter',sans-serif">
          <span>9:41</span><span style="transform:scale(${(sw / 402).toFixed(2)});transform-origin:right center">${statusIcons(ink)}</span>
        </div>
        <img src="${img}" style="display:block;width:100%;height:calc(100% - ${statusH}px);object-fit:cover;object-position:top">
        <i style="position:absolute;left:50%;top:${Math.round(sw * 0.027)}px;transform:translateX(-50%);width:${Math.round(sw * 0.313)}px;height:${Math.round(sw * 0.092)}px;background:#000;border-radius:999px"></i>
      </div>
    </div>
  </div>
</div>`;
};

// ---------- iPhone Duo, unfolded (164.6 x 117.8 mm; ~1.4:1 inner screen with a centre crease) ----------
const duo = (img, { w = 940, finish = "starWhite", style = "" } = {}) => {
    const f = FINISH[finish];
    const h = Math.round((w * 117.8) / 164.6);
    const edge = Math.round(w * 0.007);
    const bezel = Math.round(w * 0.012);
    const sw = w - 2 * (edge + bezel);
    const statusH = Math.round((sw * 38) / 1200);
    const r = Math.round(w * 0.055);
    return `
<div class="device" style="position:relative;width:${w}px;height:${h}px;${style}">
  <i style="position:absolute;right:${Math.round(w * 0.1)}px;top:-${Math.round(w * 0.006)}px;width:${Math.round(w * 0.07)}px;height:${Math.round(w * 0.008)}px;background:${f.btn};border-radius:3px"></i>
  <i style="position:absolute;right:${Math.round(w * 0.2)}px;top:-${Math.round(w * 0.006)}px;width:${Math.round(w * 0.045)}px;height:${Math.round(w * 0.008)}px;background:${f.btn};border-radius:3px"></i>
  <div style="position:absolute;inset:0;border-radius:${r}px;background:${f.edge};padding:${edge}px;box-shadow:0 40px 90px rgba(0,0,0,.55),0 10px 28px rgba(0,0,0,.4)">
    <div style="width:100%;height:100%;border-radius:${r - edge}px;background:#050505;padding:${bezel}px">
      <div style="position:relative;width:100%;height:100%;border-radius:${r - edge - bezel}px;overflow:hidden;background:#111210">
        <div style="height:${statusH}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${Math.round(sw * 0.03)}px;color:#fff;font:600 ${Math.round(sw * 0.016)}px -apple-system,'SF Pro Text','Inter',sans-serif">
          <span>9:41</span><span style="transform:scale(${(sw / 1100).toFixed(2)});transform-origin:right center">${statusIcons("#ffffff")}</span>
        </div>
        <img src="${img}" style="display:block;width:100%;height:calc(100% - ${statusH}px);object-fit:cover;object-position:top left">
        <i style="position:absolute;top:0;bottom:0;left:50%;width:${Math.round(sw * 0.03)}px;transform:translateX(-50%);background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.035) 45%,rgba(0,0,0,.09) 55%,rgba(255,255,255,0) 100%)"></i>
      </div>
    </div>
  </div>
</div>`;
};

// ---------- screens ----------
const S = {
    event: { img: shot("c1-guest-event-vendors"), band: "#121212" },
    menu: { img: shot("c2-guest-store-menu"), band: "#121212" },
    product: { img: shot("c3-guest-product"), band: "#191919" },
    checkout: { img: shot("c4-guest-checkout"), band: "#ffffff", ink: "#121212" },
    confirmed: { img: shot("c5-guest-order-confirmed"), band: "#191919" },
};
const D = {
    menu: shot("v3-vendor-menu"),
    store: shot("v2-vendor-storefront-qr"),
    orders: shot("v4-vendor-orders"),
    invites: shot("v1-vendor-event-invites"),
    eventQr: shot("o2-organiser-event-qr"),
    roster: shot("o3-organiser-invite-vendors"),
    insights: shot("o4-organiser-insights"),
};
const P = {
    festival: photo("at-festivals-optimized.jpg"),
    tent: photo("how-it-works/vip-qr-code-optimized.jpg"),
    banner: photo("how-it-works/no-q-rollup-banner-optimized.jpg"),
};

// ---------- frame ----------
const TAG = { guests: "For guests", vendors: "For vendors", organizers: "For organizers", all: "How NO-Q works" };
const frame = ({ body, tag, page, bg = "dark", glow = "50% 70%" }) => {
    const light = bg === "lime";
    const fg = light ? C.ink : C.text;
    return `
<div class="post" style="background:${light ? C.lime : `radial-gradient(circle at ${glow}, rgba(206,242,78,.16), rgba(206,242,78,0) 46%), ${C.ink}`};color:${fg}">
  <header>
    <img src="${light ? LOGO_TILE : LOGO_LIGHT}" alt="NO-Q" style="height:${light ? 64 : 44}px;border-radius:${light ? 12 : 0}px">
    ${tag ? `<span class="tag" style="border-color:${light ? "rgba(18,18,18,.35)" : "rgba(206,242,78,.5)"};color:${light ? C.ink : C.lime}">${TAG[tag]}</span>` : ""}
  </header>
  ${body}
  <footer style="color:${light ? "rgba(18,18,18,.7)" : C.muted}">
    <span>no-q.ca</span>${page ? `<span class="pager">${page}</span>` : ""}
  </footer>
</div>`;
};
const h = (text, size = 84) => `<h1 style="font-size:${size}px">${text}</h1>`;
const sub = (text, extra = "") => `<p class="sub" style="${extra}">${text}</p>`;
const step = (n, onLime = false) => `<span class="step" style="${onLime ? "background:#121212;color:#cef24e" : ""}">${n}</span>`;

const CSS = `
*{box-sizing:border-box;margin:0}
body{background:#000}
.post{position:relative;width:1080px;height:1350px;overflow:hidden;font-family:Inter,Arial,sans-serif;padding:64px 64px 0}
header{position:relative;z-index:3;display:flex;justify-content:space-between;align-items:center;height:60px;margin-bottom:56px}
.tag{font:600 22px Inter,sans-serif;letter-spacing:2px;text-transform:uppercase;border:2px solid;border-radius:999px;padding:10px 20px}
footer{position:absolute;z-index:3;left:64px;right:64px;bottom:44px;display:flex;justify-content:space-between;font:600 24px Inter,sans-serif}
.pager{font-variant-numeric:tabular-nums}
.stack{position:relative;z-index:2;display:flex;flex-direction:column}
h1{font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;line-height:1.02;letter-spacing:-1.5px;text-wrap:balance}
.sub{font-size:34px;line-height:1.35;max-width:880px;color:inherit;opacity:.82}
.step{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:${C.lime};color:${C.ink};font:700 32px 'Space Grotesk',sans-serif}
.swipe{font:700 34px 'Space Grotesk',sans-serif;margin-top:40px}
.cta{display:inline-block;align-self:flex-start;background:${C.ink};color:${C.lime};font:700 34px 'Space Grotesk',sans-serif;padding:22px 36px;border-radius:999px;margin-top:40px}
.photo{border-radius:32px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.photo img{width:100%;height:100%;object-fit:cover;display:block}
.device{z-index:1}
`;

// Renders each slide at 1080x1350 CSS px, deviceScaleFactor 2 -> 2160x2700 PNG, into site/batches/batch-N/full/.
// Carousel slides are <id>-1.png ... <id>-N.png; single images <id>.png. Pass a post id as the first CLI arg to render one post.
async function renderStills(posts, batch, only = process.argv[2]) {
    const out = path.join(__dirname, "..", "..", "site", "batches", /^\d+$/.test(String(batch)) ? `batch-${batch}` : String(batch), "full");
    fs.mkdirSync(out, { recursive: true });
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
    for (const post of posts.filter((p) => !only || p.id === only)) {
        for (const [i, slide] of post.slides.entries()) {
            await page.setContent(
                `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap"><style>${CSS}</style></head><body>${slide}</body></html>`,
                { waitUntil: "networkidle" }
            );
            await page.evaluate(() => document.fonts.ready);
            const name = post.slides.length > 1 ? `${post.id}-${i + 1}.png` : `${post.id}.png`;
            await page.locator(".post").screenshot({ path: path.join(out, name) });
            console.log("saved", name);
        }
    }
    await browser.close();
}

module.exports = { C, S, D, P, LOGO_LIGHT, LOGO_TILE, iphone, duo, frame, h, sub, step, CSS, renderStills };
