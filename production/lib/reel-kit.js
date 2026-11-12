// Shared kit for NO-Q Reels: assets, devices (iPhone 18 Pro, iPhone Duo with 3D unfold), type helpers, renderer.
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const SHOTS = path.join(__dirname, "..", "assets", "screens");
const ASSETS = path.join(__dirname, "..", "assets", "photos");
const LOGOS = path.join(__dirname, "..", "assets", "brand");

const uri = (file) => {
    const ext = path.extname(file).slice(1).toLowerCase();
    const type = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" }[ext];
    return `data:${type};base64,${fs.readFileSync(file).toString("base64")}`;
};
const shot = (n) => uri(path.join(SHOTS, `${n}.png`));
const photo = (n) => uri(path.join(ASSETS, n));

const LOGO = uri(path.join(LOGOS, "NO-QLogo-new.svg"));
const LOGO_TILE = uri(path.join(LOGOS, "NO-Q-Logo-Obsidian.png"));
const QR = fs.readFileSync(path.join(__dirname, "..", "assets", "qr.svg"), "utf8");

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
    crowd: photo("at-festivals-optimized.jpg"),
    tent: photo("how-it-works/vip-qr-code-optimized.jpg"),
    banner: photo("how-it-works/no-q-rollup-banner-optimized.jpg"),
};

const FINISH = {
    deepBlack: { edge: "linear-gradient(135deg,#4a4a4d,#1f1f22 40%,#3a3a3e 70%,#18181a)", btn: "#2a2a2d", back: "linear-gradient(145deg,#2a2a2d,#141416)" },
    glacier: { edge: "linear-gradient(135deg,#d9e6ef,#9fb7c8 40%,#c8d8e4 70%,#8ea7b9)", btn: "#a9bfcf", back: "linear-gradient(145deg,#b9cddb,#8ea7b9)" },
    silver: { edge: "linear-gradient(135deg,#f1f1f0,#c4c4c2 40%,#e6e6e4 70%,#b4b4b2)", btn: "#cfcfcd", back: "linear-gradient(145deg,#e4e4e2,#bdbdbb)" },
    burgundy: { edge: "linear-gradient(135deg,#7a2f3c,#4a1820 40%,#6b2532 70%,#3d131a)", btn: "#5a1d27", back: "linear-gradient(145deg,#5f2230,#3a1219)" },
    starWhite: { edge: "linear-gradient(135deg,#ffffff,#c4c4c2 30%,#f4f4f2 55%,#a8a8a6 80%,#e6e6e4)", btn: "#d2d2d0", back: "linear-gradient(160deg,#fbfbf9 0%,#ecece9 55%,#dededa 100%)" },
    nightSky: { edge: "linear-gradient(135deg,#46506a,#1e2332 40%,#3b4459 70%,#161a26)", btn: "#2a3042", back: "linear-gradient(145deg,#2c3346,#151925)" },
};

const statusIcons = (color) => `<svg width="74" height="14" viewBox="0 0 74 14" fill="${color}"><rect x="0" y="9" width="3.2" height="5" rx="1"/><rect x="4.8" y="6.5" width="3.2" height="7.5" rx="1"/><rect x="9.6" y="3.8" width="3.2" height="10.2" rx="1"/><rect x="14.4" y="1" width="3.2" height="13" rx="1"/><path d="M30 3.2c2.7 0 5.2 1 7 2.8l1.3-1.3A11.7 11.7 0 0 0 30 1.3c-3.2 0-6.2 1.3-8.3 3.4L23 6a9.9 9.9 0 0 1 7-2.8Zm0 3.7c1.7 0 3.2.6 4.4 1.7l1.3-1.3A8 8 0 0 0 30 5c-2.2 0-4.2.9-5.7 2.3L25.6 8.6A6.2 6.2 0 0 1 30 6.9Zm0 3.7c.7 0 1.3.3 1.8.7L30 13.1l-1.8-1.8c.5-.4 1.1-.7 1.8-.7Z"/><rect x="45" y="1.5" width="24" height="11" rx="3.4" fill="none" stroke="${color}" stroke-opacity=".45" stroke-width="1.2"/><rect x="47" y="3.5" width="17" height="7" rx="2"/></svg>`;

// ---------- iPhone 18 Pro (71.9 x 150.0 mm) ----------
// overlay: HTML placed over the screen (0..100% of the screen box) for in-screen motion.
const iphone = ({ img, band = "#121212", ink = "#fff" }, { w = 520, finish = "deepBlack", overlay = "", layers = [] } = {}) => {
    const f = FINISH[finish];
    const h = Math.round((w * 150.0) / 71.9);
    const e = Math.round(w * 0.012), b = Math.round(w * 0.016);
    const sw = w - 2 * (e + b);
    const st = Math.round((sw * 54) / 402);
    const r = Math.round(w * 0.18);
    const btn = (side, top, hh) => `<i style="position:absolute;${side}:-${Math.round(w * 0.009)}px;top:${Math.round(h * top)}px;width:${Math.round(w * 0.012)}px;height:${Math.round(h * hh)}px;background:${f.btn};border-radius:3px"></i>`;
    const extra = layers.map((l) => `<img src="${l.img}" style="position:absolute;left:0;top:${st}px;width:100%;height:calc(100% - ${st}px);object-fit:cover;object-position:top;animation:fadeIn .5s ease ${l.t}s both">`).join("");
    return `<div style="position:relative;width:${w}px;height:${h}px">
${btn("left", 0.135, 0.04)}${btn("left", 0.205, 0.07)}${btn("left", 0.29, 0.07)}${btn("right", 0.235, 0.105)}
<div style="position:absolute;inset:0;border-radius:${r}px;background:${f.edge};padding:${e}px;box-shadow:0 50px 100px rgba(0,0,0,.6),0 10px 30px rgba(0,0,0,.45)">
 <div style="width:100%;height:100%;border-radius:${r - e}px;background:#050505;padding:${b}px">
  <div style="position:relative;width:100%;height:100%;border-radius:${r - e - b}px;overflow:hidden;background:${band}">
   <div style="height:${st}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${Math.round(sw * 0.085)}px 0 ${Math.round(sw * 0.11)}px;color:${ink};font:600 ${Math.round(sw * 0.042)}px Inter,sans-serif"><span>9:41</span><span style="transform:scale(${(sw / 402).toFixed(2)});transform-origin:right center;display:flex">${statusIcons(ink)}</span></div>
   <img src="${img}" style="display:block;width:100%;height:calc(100% - ${st}px);object-fit:cover;object-position:top">
   ${extra}
   <div style="position:absolute;left:0;right:0;top:${st}px;bottom:0">${overlay}</div>
   <i style="position:absolute;left:50%;top:${Math.round(sw * 0.027)}px;transform:translateX(-50%);width:${Math.round(sw * 0.313)}px;height:${Math.round(sw * 0.092)}px;background:#000;border-radius:999px"></i>
  </div></div></div></div>`;
};

// ---------- iPhone Duo (164.6 x 117.8 mm unfolded) ----------
// Book-style foldable, per Apple's reference photos: inner display + crease when open; when closed,
// one outside face is the cover display (hole-punch camera), the other is the white glass back with a
// two-lens camera plateau. No screen on the back.
// Motion: folded back -> spins to the cover display -> unfolds. t = unfold start; the spin runs just before.
const duo = ({ img, w = 940, finish = "starWhite", t = 0.4, dur = 1.25, layers = [], overlay = "", cover = "", spin = false, spinAt }) => {
    const f = FINISH[finish];
    const H = Math.round((w * 117.8) / 164.6);
    const e = Math.round(w * 0.007), b = Math.round(w * 0.012), r = Math.round(w * 0.055);
    const hw = w / 2;
    const sw = w - 2 * (e + b), sh = H - 2 * (e + b);
    const st = Math.round((sw * 38) / 1200);
    const ir = r - e - b;
    const sr = Math.round(r * 0.18); // hinge-side corner
    const screen = (left) => `<div style="position:absolute;top:0;left:${left}px;width:${sw}px;height:${sh}px;background:#111210">
  <div style="height:${st}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${Math.round(sw * 0.03)}px;color:#fff;font:600 ${Math.round(sw * 0.016)}px Inter,sans-serif"><span>9:41</span><span style="transform:scale(${(sw / 1100).toFixed(2)});transform-origin:right center;display:flex">${statusIcons("#fff")}</span></div>
  <img src="${img}" style="display:block;width:100%;height:${sh - st}px;object-fit:cover;object-position:top left">
  ${layers.map((l) => `<img src="${l.img}" style="position:absolute;left:0;top:${st}px;width:100%;height:${sh - st}px;object-fit:cover;object-position:top left;animation:fadeIn .55s ease ${l.t}s both">`).join("")}
  <div style="position:absolute;left:0;top:${st}px;width:100%;height:${sh - st}px">${overlay}</div>
</div>`;
    const face = (radius, pad, inner, extra = "") =>
        `<div style="position:absolute;inset:0;backface-visibility:hidden;border-radius:${radius};background:${f.edge};padding:${pad};${extra}">${inner}</div>`;
    const spinT = spinAt ?? Math.max(0, t - 1.05);
    const coverW = hw - e - b;

    // Back glass: hinge on the left in this view, so the camera plateau sits toward the outer (right) edge.
    const lens = (d) => `<span style="width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle at 38% 35%,#5b6474 0 8%,#1b1f27 22%,#07080b 60%);box-shadow:0 0 0 ${Math.round(d * 0.07)}px #d9d9d6,0 0 0 ${Math.round(d * 0.1)}px #9c9c99,0 ${Math.round(d * 0.06)}px ${Math.round(d * 0.2)}px rgba(0,0,0,.35)"></span>`;
    const rear = `<div style="width:100%;height:100%;border-radius:${sr}px ${r - e}px ${r - e}px ${sr}px;background:${f.back};position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)">
  <div style="position:absolute;right:${Math.round(hw * 0.06)}px;top:${Math.round(hw * 0.06)}px;width:${Math.round(hw * 0.7)}px;height:${Math.round(hw * 0.27)}px;border-radius:${Math.round(hw * 0.11)}px;background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(225,225,222,.7));box-shadow:0 ${Math.round(hw * 0.01)}px ${Math.round(hw * 0.03)}px rgba(0,0,0,.12),inset 0 0 0 1px rgba(0,0,0,.05);display:flex;align-items:center;justify-content:flex-end;gap:${Math.round(hw * 0.035)}px;padding:0 ${Math.round(hw * 0.045)}px">
    <span style="width:${Math.round(hw * 0.035)}px;height:${Math.round(hw * 0.035)}px;border-radius:50%;background:#2a2a2a;margin-right:${Math.round(hw * 0.02)}px"></span>
    <span style="width:${Math.round(hw * 0.05)}px;height:${Math.round(hw * 0.05)}px;border-radius:50%;background:radial-gradient(circle,#fff6d8,#d8cfa8);margin-right:${Math.round(hw * 0.03)}px"></span>
    ${lens(Math.round(hw * 0.19))}${lens(Math.round(hw * 0.19))}
  </div>
  <i style="position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.35) 0%,rgba(255,255,255,0) 35%,rgba(0,0,0,.04) 100%)"></i>
</div>`;

    // Cover display: hinge on the right in this view, so the hole-punch camera sits top-left.
    const coverScreen = (cover || duoCover(coverW, sh)) + `<i style="position:absolute;left:${Math.round(coverW * 0.07)}px;top:${Math.round(coverW * 0.06)}px;width:${Math.round(coverW * 0.06)}px;height:${Math.round(coverW * 0.06)}px;border-radius:50%;background:#000;box-shadow:0 0 0 2px #1a1a1a"></i>`;

    return `<div style="position:relative;width:${w}px;height:${H}px;perspective:2600px">
<div style="position:absolute;inset:0;transform-style:preserve-3d;${spin ? `animation:duoSpin 1s var(--io) ${spinT}s both` : ""}">
<div style="position:absolute;inset:0;transform-style:preserve-3d;animation:duoTilt ${dur + 0.35}s var(--io) ${t}s both;--hw:${hw / 2}px">
 <div style="position:absolute;left:0;top:0;width:${hw}px;height:${H}px;transform-style:preserve-3d">
  ${face(`${r}px ${sr}px ${sr}px ${r}px`, `${e}px 0 ${e}px ${e}px`, `
   <div style="width:100%;height:100%;background:#050505;border-radius:${r - e}px 0 0 ${r - e}px;padding:${b}px 0 ${b}px ${b}px">
    <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:${ir}px 0 0 ${ir}px">${screen(0)}
     <i style="position:absolute;top:0;bottom:0;right:0;width:${Math.round(sw * 0.015)}px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.04) 60%,rgba(0,0,0,.12))"></i>
     <i style="position:absolute;inset:0;background:#000;animation:fadeOut ${dur}s var(--io) ${t}s both;opacity:.7"></i>
    </div></div>`, "box-shadow:0 50px 110px rgba(0,0,0,.55)")}
  ${face(`${sr}px ${r}px ${r}px ${sr}px`, `${e}px`, rear, "transform:rotateY(180deg);box-shadow:0 50px 110px rgba(0,0,0,.55)")}
 </div>
 <div style="position:absolute;left:${hw}px;top:0;width:${hw}px;height:${H}px;transform-origin:left center;transform-style:preserve-3d;animation:unfold ${dur}s var(--io) ${t}s both">
  ${face(`${sr}px ${r}px ${r}px ${sr}px`, `${e}px ${e}px ${e}px 0`, `
   <div style="width:100%;height:100%;background:#050505;border-radius:0 ${r - e}px ${r - e}px 0;padding:${b}px ${b}px ${b}px 0">
    <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:0 ${ir}px ${ir}px 0">${screen(-sw / 2)}
     <i style="position:absolute;top:0;bottom:0;left:0;width:${Math.round(sw * 0.015)}px;background:linear-gradient(90deg,rgba(0,0,0,.12),rgba(255,255,255,.04) 40%,rgba(255,255,255,0))"></i>
     <i style="position:absolute;inset:0;background:#000;animation:fadeOut ${dur}s var(--io) ${t}s both;opacity:.75"></i>
    </div></div>`)}
  ${face(`${r}px ${sr}px ${sr}px ${r}px`, `${e}px ${e}px ${e}px ${e}px`, `
   <div style="width:100%;height:100%;background:#050505;border-radius:${r - e}px ${sr}px ${sr}px ${r - e}px;padding:${b}px">
    <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:${ir}px ${Math.max(2, sr - b)}px ${Math.max(2, sr - b)}px ${ir}px">${coverScreen}</div>
   </div>`, "transform:rotateY(180deg)")}
 </div>
</div></div></div>`;
};

// The Duo's outer (cover) display: lock screen with a NO-Q order notification.
const duoCover = (w, h) => {
    const s = w / 400;
    return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,#2b3346,#0b0d14 70%);color:#fff;font-family:Inter,sans-serif;display:flex;flex-direction:column;align-items:center;padding-top:${70 * s}px">
 <p style="font:500 ${22 * s}px Inter,sans-serif;opacity:.8">Saturday, June 19</p>
 <p style="font:700 ${104 * s}px 'Space Grotesk',sans-serif;line-height:1;letter-spacing:-2px">9:41</p>
 <div style="margin-top:${60 * s}px;width:${340 * s}px;background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border-radius:${26 * s}px;padding:${18 * s}px;display:flex;gap:${14 * s}px;align-items:center">
  <img src="${LOGO_TILE}" style="width:${54 * s}px;height:${54 * s}px;border-radius:${12 * s}px">
  <div style="display:flex;flex-direction:column;gap:${3 * s}px">
   <p style="font:600 ${15 * s}px Inter,sans-serif;opacity:.7">NO-Q · now</p>
   <p style="font:700 ${19 * s}px Inter,sans-serif">New order IG-2048</p>
   <p style="font:400 ${16 * s}px Inter,sans-serif;opacity:.8">1× Festival Combo</p>
  </div></div></div>`;
};

// ---------- typography ----------
// words("Lines are / so *last* *year.*", 0.3): "/" = line break, *word* = lime.
const words = (text, t0, { stagger = 0.07, dur = 0.8, strike = [] } = {}) => {
    let i = 0;
    return text
        .split(" ")
        .map((w) => {
            if (w === "/") return "<br>";
            const lime = /^\*.*\*$/.test(w);
            const word = w.replace(/^\*|\*$/g, "");
            const d = (t0 + i++ * stagger).toFixed(2);
            const bar = strike.includes(word)
                ? `<i style="position:absolute;left:-4%;right:-4%;top:52%;height:.09em;background:#cef24e;transform-origin:left;animation:sweep .45s var(--out) ${(t0 + i * stagger + 0.7).toFixed(2)}s both"></i>`
                : "";
            return `<span class="w"><span style="position:relative;animation:up ${dur}s var(--out) ${d}s both;${lime ? "color:#cef24e" : ""}">${word}${bar}</span></span>`;
        })
        .join(" ");
};
// Positioned layer with optional entry wrapper and exit.
const layer = (inner, { style = "", exit, enter = "" } = {}) =>
    `<div style="position:absolute;${style};${exit != null ? `animation:out .5s var(--in) ${exit}s both` : ""}"><div style="${enter}">${inner}</div></div>`;
const anim = (name, dur, t, ease = "var(--out)") => `animation:${name} ${dur}s ${ease} ${t}s both`;

const endCard = (t0, line, cta = "no-q.ca") => `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;padding-bottom:120px">
 <img src="${LOGO}" style="width:440px;${anim("popIn", 0.9, t0, "var(--spring)")}">
 <p style="font:700 64px 'Space Grotesk',sans-serif;text-align:center;line-height:1.08;max-width:860px;letter-spacing:-1px;${anim("riseIn", 0.7, t0 + 0.3)}">${line}</p>
 <p style="font:700 40px 'Space Grotesk',sans-serif;background:#cef24e;color:#121212;padding:22px 44px;border-radius:999px;${anim("riseIn", 0.7, t0 + 0.5)}">${cta}</p>
</div>`;

const CSS = `
:root{--out:cubic-bezier(.22,1,.36,1);--in:cubic-bezier(.55,0,.75,.2);--io:cubic-bezier(.65,0,.35,1);--spring:cubic-bezier(.34,1.56,.64,1)}
*{box-sizing:border-box;margin:0}
body{background:#000;overflow:hidden}
p,h1{margin:0}
.reel{position:relative;width:1080px;height:1920px;overflow:hidden;background:#121212;color:#f2f4ec;font-family:Inter,Arial,sans-serif}
.glow{position:absolute;width:1400px;height:1400px;left:-160px;top:500px;background:radial-gradient(circle,rgba(206,242,78,.17),rgba(206,242,78,0) 60%)}
.h{font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;letter-spacing:-3px;line-height:1.0}
.w{display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .02em .1em}
.w>span{display:inline-block}
.sub{font-size:40px;line-height:1.35;color:#c9ccc0}
.chip{display:inline-flex;align-items:center;gap:14px;font:600 36px Inter,sans-serif;border:2px solid rgba(206,242,78,.55);color:#cef24e;border-radius:999px;padding:14px 30px;background:rgba(18,18,18,.6)}
.num{font:700 44px 'Space Grotesk',sans-serif;width:76px;height:76px;border-radius:50%;background:#cef24e;color:#121212;display:inline-flex;align-items:center;justify-content:center}
@keyframes up{from{transform:translateY(115%)}to{transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeOut{from{opacity:.7}to{opacity:0}}
@keyframes out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-50px)}}
@keyframes outLeft{from{opacity:1;transform:none}to{opacity:0;transform:translateX(-260px)}}
@keyframes inRight{from{opacity:0;transform:translateX(320px)}to{opacity:1;transform:none}}
@keyframes riseIn{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
@keyframes popIn{0%{opacity:0;transform:scale(.4)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes phoneUp{from{transform:translateY(1500px) rotate(var(--r0,10deg))}to{transform:translateY(0) rotate(var(--r1,0deg))}}
@keyframes sweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes kb{from{transform:scale(1.18)}to{transform:scale(1.02)}}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(220px,-260px)}}
@keyframes duoSpin{from{transform:rotateY(-180deg)}to{transform:none}}
@keyframes unfold{from{transform:rotateY(-179deg)}to{transform:rotateY(0)}}
@keyframes duoCenter{from{transform:translateX(var(--hw))}to{transform:none}}
@keyframes duoTilt{from{transform:translateX(var(--hw)) rotateX(10deg) rotateY(-18deg) scale(.92)}to{transform:none}}
@keyframes duoIn{from{opacity:0;transform:translateY(160px) scale(.9)}to{opacity:1;transform:none}}
@keyframes ripple{0%{opacity:.7;transform:translate(-50%,-50%) scale(.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.4)}}
@keyframes scan{0%{transform:translateY(0)}50%{transform:translateY(var(--scan,420px))}100%{transform:translateY(0)}}
@keyframes flash{0%{opacity:0}30%{opacity:.85}100%{opacity:0}}
@keyframes pulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.8);opacity:0}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes show{from{opacity:0}to{opacity:1}}
@keyframes hide{from{opacity:1}to{opacity:0}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
@keyframes light{from{background:#2a2c26;color:#a9ad9f;transform:scale(1)}50%{transform:scale(1.25)}to{background:#cef24e;color:#121212;transform:scale(1)}}
`;

// reel.css (optional) adds extra keyframes/rules for one Reel.
const page = (body, dur, css = "") => `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap"><style>${CSS}${css}</style></head>
<body><div class="reel"><div class="glow" style="animation:drift ${dur}s linear 0s both"></div>${body}</div></body></html>`;

// Steps every animation to each frame's exact time, then pipes JPEG frames into ffmpeg (H.264).
// Optional reel fields (absent = silent Reel, unchanged output):
//   poster: seconds  -> that settled frame is baked in as frame 0 (the thumbnail everywhere) and saved as <id>-cover.jpg
//                       unless reel.cover is set. Frame count and audio sync stay the same.
//   score:  {...}    -> lib/soundtrack.js options (dur is taken from the Reel). The WAV is written to
//                       production/out/audio/<id>.wav and muxed in as AAC, loudness-normalised to -14 LUFS.
const FPS = 30;
const run = (args) => new Promise((res, rej) => { const p = spawn(ffmpeg, args, { stdio: ["ignore", "ignore", "inherit"] }); p.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))); });
async function render(browser, reel, outDir) {
    const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await pg.setContent(page(reel.body, reel.dur, reel.css), { waitUntil: "networkidle" });
    await pg.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
        document.getAnimations().forEach((a) => a.pause());
    });
    const file = path.join(outDir, `${reel.id}.mp4`);
    const videoOut = reel.score ? path.join(outDir, `${reel.id}.video-only.mp4`) : file;
    const ff = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", videoOut]);
    const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));
    const frames = Math.round(reel.dur * FPS);
    const el = pg.locator(".reel");
    const coverAt = reel.cover ?? reel.poster;
    for (let f = 0; f < frames; f++) {
        const t = (f === 0 && reel.poster != null ? reel.poster : f / FPS) * 1000;
        await pg.evaluate((t) => document.getAnimations().forEach((a) => (a.currentTime = t)), t);
        const buf = await el.screenshot({ type: "jpeg", quality: 94 });
        if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
        if (coverAt != null && f === Math.round(coverAt * FPS)) fs.writeFileSync(path.join(outDir, `${reel.id}-cover.jpg`), buf);
    }
    ff.stdin.end();
    await done;
    await pg.close();
    if (reel.score) {
        const { writeScore } = require("./soundtrack");
        const wav = writeScore({ ...reel.score, dur: reel.dur }, path.join(__dirname, "..", "out", "audio", `${reel.id}.wav`));
        await run(["-y", "-loglevel", "error", "-i", videoOut, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", file]);
        fs.unlinkSync(videoOut);
    }
    return file;
}

// Grab single frames for review: times in seconds.
async function stills(browser, reel, times, outDir) {
    const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    await pg.setContent(page(reel.body, reel.dur, reel.css), { waitUntil: "networkidle" });
    await pg.evaluate(async () => { await document.fonts.ready; document.getAnimations().forEach((a) => a.pause()); });
    const files = [];
    for (const t of times) {
        await pg.evaluate((t) => document.getAnimations().forEach((a) => (a.currentTime = t)), t * 1000);
        const f = path.join(outDir, `${reel.id}@${t}.jpg`);
        await pg.locator(".reel").screenshot({ path: f, type: "jpeg", quality: 80 });
        files.push(f);
    }
    await pg.close();
    return files;
}

module.exports = { S, D, P, QR, LOGO, LOGO_TILE, iphone, duo, words, layer, anim, endCard, render, stills, FPS };
