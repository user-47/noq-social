// Hero: "The Last Line", a mini-documentary of one order (trend: "Netflix documentary" style + day-in-the-life).
// 20s, 9:16, letterboxed, film grain, timestamps and chapter lower-thirds. 120 BPM; cuts on the beat.
//   node hero/doc-last-line.js --stills=1.5,4.5,8.6,11,13,15.5,19.3
//   node hero/doc-last-line.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const K = require("../lib/reel-kit");
const { S, D, LOGO, iphone, duo, words, anim } = K;

const LIME = "#cef24e";
const OUT = path.join(__dirname, "..", "out", "hero");
const REVIEW = path.join(__dirname, "..", "out", "review");
const scene = (t0, t1, inner, inAnim = "fadeIn .3s ease") =>
    `<div style="position:absolute;inset:0;opacity:0;animation:${inAnim} ${t0}s both, hide .01s linear ${t1}s forwards">${inner}</div>`;
const stamp = (txt, t) => `<p class="ts" style="${anim("fadeIn", 0.3, t)}">${txt}</p>`;
const line = (text, t, top = 400, size = 92) => `<h1 class="h" style="position:absolute;left:90px;right:90px;top:${top}px;font-size:${size}px">${words(text, t, { stagger: 0.07, dur: 0.6 })}</h1>`;
const chapter = (n, title, t) => `<div class="lower" style="${anim("inRight", 0.5, t)}"><i></i><div><p class="ch">Chapter ${n}</p><p class="ct">${title}</p></div></div>`;
const tap = (t, x, y) => `<i style="position:absolute;left:${x}%;top:${y}%;width:150px;height:150px;border-radius:50%;background:rgba(206,242,78,.55);animation:ripple .6s var(--out) ${t}s both"></i>`;
const person = (i, t) => `<svg width="62" height="88" viewBox="0 0 54 76" style="animation:popIn .3s var(--spring) ${t}s both"><circle cx="27" cy="16" r="14" fill="${i === 30 ? LIME : "#4a4d45"}"/><path d="M4 76c0-18 10-32 23-32s23 14 23 32Z" fill="${i === 30 ? LIME : "#4a4d45"}"/></svg>`;

// Title (0–3)
const title = scene(0, 3.0, `
<p style="position:absolute;left:0;right:0;top:600px;text-align:center;font:600 34px Inter,sans-serif;letter-spacing:10px;color:#a9ad9f;${anim("fadeIn", 0.6, 0.2)}">A NO-Q ORIGINAL</p>
<h1 class="h" style="position:absolute;left:0;right:0;top:700px;text-align:center;font-size:190px;letter-spacing:-6px;line-height:.95">${words("The last / *line.*", 0.6, { stagger: 0.18, dur: 0.8 })}</h1>
<p style="position:absolute;left:0;right:0;top:1150px;text-align:center;font:500 38px Inter,sans-serif;color:#c9ccc0;${anim("riseIn", 0.6, 1.5)}">Riverbend Night Market · Calgary</p>`, "show .01s linear");

// Chapter 1: the wait (3–6)
const crowd = Array.from({ length: 31 }, (_, i) => person(i, 3.4 + i * 0.045)).join("");
const wait = scene(3.0, 6.0, `
${stamp("8:02 PM", 3.05)}
${line("Island Grill. / *31* people in line.", 3.15)}
<div style="position:absolute;left:90px;right:90px;top:760px;display:flex;flex-wrap:wrap;gap:22px 14px">${crowd}</div>
${chapter(1, "The wait", 3.3)}`);

// Chapter 2: the scan (6–10)
const scan = scene(6.0, 10.0, `
${stamp("8:03 PM", 6.05)}
${line("Ama scans the QR / on her *table.*", 6.15)}
<div style="position:absolute;left:480px;top:700px;--r0:6deg;--r1:-2deg;${anim("phoneUp", 1.0, 6.1, "var(--spring)")}">
${iphone(S.event, { w: 520, finish: "starWhite", layers: [{ img: S.menu.img, t: 7.55 }, { img: S.product.img, t: 8.55 }], overlay: tap(7.35, 18, 40) + tap(8.35, 10, 52) })}</div>
${chapter(2, "The scan", 6.3)}`);

// Chapter 3: the order lands (10–14)
const order = scene(10.0, 14.0, `
${stamp("8:04 PM", 10.05)}
<div style="position:absolute;inset:0;animation:hide .2s ease 11.9s forwards">${line("Order IG-2047. / Paid. *#3* in queue.", 10.15)}
<div style="position:absolute;left:480px;top:700px">${iphone(S.confirmed, { w: 520, finish: "starWhite", overlay: `<i style="position:absolute;left:50%;top:44%;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;border:6px solid ${LIME};animation:pulse 1s var(--out) 10.6s both"></i>` })}</div></div>
<div style="position:absolute;inset:0;opacity:0;animation:fadeIn .25s ease 12.0s both">${line("Island Grill gets it / *instantly.*", 12.05)}
<div style="position:absolute;left:70px;top:760px">${duo({ img: D.orders, w: 940, t: 12.1, dur: 0.9 })}</div>
<div style="position:absolute;left:150px;right:150px;top:690px;animation:toastIn .45s var(--spring) 12.9s both">
 <div style="display:flex;gap:22px;align-items:center;background:#fff;color:#121212;border-radius:30px;padding:24px 30px;box-shadow:0 30px 60px rgba(0,0,0,.5)">
  <span style="width:70px;height:70px;border-radius:16px;background:#121212;display:flex;align-items:center;justify-content:center"><img src="${LOGO}" style="width:58px"></span>
  <div><p style="font:700 36px Inter,sans-serif">New order IG-2047</p><p style="font:500 30px Inter,sans-serif;color:#555">3 items · Ama M.</p></div></div></div></div>
${chapter(3, "The order", 10.3)}`);

// Chapter 4: the pickup (14–17)
const pickup = scene(14.0, 17.0, `
${stamp("8:11 PM", 14.05)}
<p class="h" style="position:absolute;left:90px;top:420px;font-size:250px;letter-spacing:-10px;color:${LIME};${anim("popIn", 0.5, 14.1, "var(--spring)")}">Ready.</p>
${line("She never stood / *in* *line.*", 14.6, 760, 120)}
${chapter(4, "The pickup", 14.3)}`);

// End (17–20)
const end = scene(17.0, 99, `
<h1 class="h" style="position:absolute;left:90px;right:90px;top:520px;font-size:140px;letter-spacing:-5px">${words("The line is / *optional* *now.*", 17.05, { stagger: 0.09, dur: 0.55 })}</h1>
<img src="${LOGO}" style="position:absolute;left:90px;top:1060px;width:470px;${anim("popIn", 0.6, 18.0, "var(--spring)")}">
<span style="position:absolute;left:90px;top:1260px;font:700 52px 'Space Grotesk',sans-serif;background:${LIME};color:#121212;border-radius:999px;padding:20px 44px;${anim("riseIn", 0.5, 18.25)}">no-q.ca</span>`, "show .01s linear");

// Film grain + letterbox over everything
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}`;
const overlay = `<div style="position:absolute;inset:-60px;background:url('${GRAIN}');opacity:.09;mix-blend-mode:overlay;animation:grain .5s steps(5) 0s infinite"></div>
<div class="bar" style="top:0"></div><div class="bar" style="bottom:0"></div>`;

const reel = {
    id: "hero-doc-last-line",
    dur: 20,
    poster: 15.8,
    css: `
.ts{position:absolute;left:90px;top:290px;font:600 40px Inter,sans-serif;letter-spacing:4px;color:${LIME}}
.lower{position:absolute;left:90px;bottom:250px;display:flex;gap:22px;align-items:stretch}
.lower i{width:8px;border-radius:4px;background:${LIME}}
.lower .ch{font:600 28px Inter,sans-serif;letter-spacing:6px;text-transform:uppercase;color:#a9ad9f}
.lower .ct{font:700 54px 'Space Grotesk',sans-serif;letter-spacing:-1px}
.bar{position:absolute;left:0;right:0;height:190px;background:#000;z-index:5}
@keyframes grain{0%{transform:translate(0,0)}20%{transform:translate(-30px,20px)}40%{transform:translate(25px,-35px)}60%{transform:translate(-15px,40px)}80%{transform:translate(35px,10px)}100%{transform:translate(0,0)}}
@keyframes toastIn{from{opacity:0;transform:translateY(-120px) scale(.9)}to{opacity:1;transform:none}}`,
    body: title + wait + scan + order + pickup + end + overlay,
    // Tension while waiting (filtered pad + ticking hats), the groove drops on the scan at 6.0, final hit on the logo.
    score: {
        bpm: 120,
        chords: [[57, 60, 64], [52, 55, 59], [53, 57, 60], [55, 59, 62], [57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62], [53, 57, 60], [48, 52, 55]],
        drop: 6.0, arpFrom: 10.0, end: 18.0,
        sfx: [
            { t: 0.6, kind: "note", note: 69, len: 1.2 }, { t: 1.5, kind: "note", note: 76, len: 1.2 },  // title
            { t: 3.0, kind: "whoosh" },
            ...Array.from({ length: 31 }, (_, i) => ({ t: 3.4 + i * 0.045, kind: "tick", gain: 0.6 })),   // the crowd fills in
            { t: 5.0, kind: "riser", len: 1.0 },
            { t: 6.0, kind: "impact", gain: 0.7 },
            { t: 7.5, kind: "tap" }, { t: 8.5, kind: "tap" },
            { t: 10.0, kind: "chime" },                                  // order confirmed
            { t: 12.0, kind: "whoosh" }, { t: 12.1, kind: "riser", len: 0.9, gain: 0.4 },
            { t: 13.0, kind: "ding" },                                   // vendor toast
            { t: 14.0, kind: "impact", gain: 0.5 }, { t: 14.1, kind: "chime" }, // "Ready."
            { t: 17.0, kind: "whoosh" },
        ],
    },
};

(async () => {
    const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
    const stillsArg = process.argv.find((a) => a.startsWith("--stills="));
    if (stillsArg) {
        fs.mkdirSync(REVIEW, { recursive: true });
        console.log((await K.stills(browser, reel, stillsArg.split("=")[1].split(",").map(Number), REVIEW)).join("\n"));
    } else {
        fs.mkdirSync(OUT, { recursive: true });
        const t = Date.now();
        console.log("rendered", await K.render(browser, reel, OUT), `${((Date.now() - t) / 1000).toFixed(0)}s`);
    }
    await browser.close();
})();
module.exports = { reel };
