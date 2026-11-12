// Hero video template: "You're #23 in line. Not anymore." 20s, 9:16, with an original soundtrack.
// Made with the /brag-slim workflow (see docs/production.md › Hero videos and sound). Copy this file for each new hero.
//   node hero/noq-launch.js --stills=1.2,2.6,4.5,9.5,12.6,14.7,19.3   -> review frames in out/review/
//   node hero/noq-launch.js                                           -> out/hero/hero-noq-launch.mp4 + cover
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const K = require("../lib/reel-kit");
const { S, D, LOGO, iphone, duo, words, anim } = K;

const LIME = "#cef24e";
const OUT = path.join(__dirname, "..", "out", "hero");
const REVIEW = path.join(__dirname, "..", "out", "review");

// A scene is visible from t0 until t1 (hard cut out, so cuts land exactly on the beat).
const scene = (t0, t1, inner, inAnim = "show .01s linear") =>
    `<div style="position:absolute;inset:0;opacity:0;animation:${inAnim} ${t0}s both, hide .01s linear ${t1}s forwards">${inner}</div>`;
const head = (text, t0, { top = 250, size = 92 } = {}) =>
    `<h1 class="h" style="position:absolute;left:90px;right:90px;top:${top}px;font-size:${size}px">${words(text, t0, { stagger: 0.06, dur: 0.6 })}</h1>`;

// ---- Hook (0–4s): queue counter races to #23, then "Not anymore." ----
const TICK0 = 0.25, TICK = 0.07, COUNT = 23;
const dots = Array.from({ length: COUNT }, (_, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    return `<i style="position:absolute;left:${90 + col * 150}px;top:${row * 150}px;width:96px;height:96px;border-radius:50%;background:${i === COUNT - 1 ? LIME : "#2e3029"};animation:popIn .3s var(--spring) ${(TICK0 + i * TICK).toFixed(2)}s both"></i>`;
}).join("");
const counter = Array.from({ length: COUNT }, (_, i) => {
    const t = TICK0 + i * TICK;
    return `<span style="position:absolute;left:0;top:0;opacity:0;animation:show .01s linear ${t.toFixed(2)}s both${i < COUNT - 1 ? `, hide .01s linear ${(t + TICK).toFixed(2)}s forwards` : ""}">#${i + 1}</span>`;
}).join("");
const hook = scene(0, 4.0, `
<div style="position:absolute;left:90px;right:90px;top:300px">
  <p class="h" style="font-size:96px;letter-spacing:-2px;color:#a9ad9f;${anim("riseIn", 0.5, 0.1)}">You’re</p>
  <div class="h" style="position:relative;height:330px;font-size:330px;letter-spacing:-14px;color:${LIME};margin-top:6px">${counter}</div>
  <p class="h" style="position:relative;display:inline-block;font-size:110px;letter-spacing:-3px;margin-top:20px;${anim("riseIn", 0.5, 0.35)}">in line.<i style="position:absolute;left:-2%;right:-2%;top:54%;height:14px;border-radius:7px;background:${LIME};transform-origin:left;animation:sweep .35s var(--out) 2.0s both"></i></p>
</div>
<div style="position:absolute;top:1080px;left:0;right:0;height:600px;animation:hide .25s ease 1.95s forwards">${dots}</div>
<h1 class="h" style="position:absolute;left:90px;right:90px;top:1150px;font-size:150px;letter-spacing:-5px">${words("Not *anymore.*", 2.25, { stagger: 0.12, dur: 0.5 })}</h1>`);

// ---- Reveal (4–7s): logo + the website's H1 ----
const reveal = scene(4.0, 7.0, `
<div style="position:absolute;inset:0;background:${LIME};opacity:0;animation:flash .45s ease 4.0s both"></div>
<img src="${LOGO}" style="position:absolute;left:90px;top:330px;width:620px;${anim("popIn", 0.6, 4.0, "var(--spring)")}">
${head("Mobile ordering for / *busy* *events* / and venues.", 4.25, { top: 640, size: 112 })}
<span class="chip" style="position:absolute;left:90px;top:1150px;font-size:40px;${anim("popIn", 0.5, 5.0, "var(--spring)")}">No app download required</span>`);

// ---- Guests (7–11s): taps on the beat through the real guest flow ----
const ring = (t) => `<i style="position:absolute;left:50%;top:44%;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;border:6px solid ${LIME};animation:pulse 1s var(--out) ${t}s both"></i>`;
const tap = (t, x, y) => `<i style="position:absolute;left:${x}%;top:${y}%;width:150px;height:150px;border-radius:50%;background:rgba(206,242,78,.55);animation:ripple .6s var(--out) ${t}s both"></i>`;
const guests = scene(7.0, 11.0, `
${head("From scan to pickup, / without the *usual* *queue.*", 7.1)}
<div style="position:absolute;left:240px;top:640px;--r0:8deg;--r1:0deg;${anim("phoneUp", 1.0, 7.05, "var(--spring)")}">
${iphone(S.event, { w: 600, finish: "glacier", layers: [{ img: S.menu.img, t: 8.05 }, { img: S.product.img, t: 9.05 }, { img: S.confirmed.img, t: 10.0 }], overlay: tap(7.85, 18, 40) + tap(8.85, 10, 52) + tap(9.85, 30, 82) + ring(10.15) + ring(10.5) })}</div>`, "inRight .5s var(--out)");

// ---- Vendors (11–14.5s) then Organizers (14.5–17s) on one iPhone Duo ----
const pill = (txt, bg, t) => `<span style="font:700 40px 'Space Grotesk',sans-serif;border-radius:999px;padding:14px 30px;background:#2a2c26;color:#a9ad9f;animation:pillOn .35s var(--out) ${t}s both;--on:${bg}">${txt}</span>`;
const arrow = `<span style="font:700 40px Inter;color:#6f7369;align-self:center">→</span>`;
const vendors = scene(11.0, 17.0, `
<div style="position:absolute;inset:0;animation:hide .01s linear 14.5s forwards">${head("Vendors receive / every order in *one* *place.*", 11.1)}</div>
<div style="position:absolute;inset:0;opacity:0;animation:show .01s linear 14.5s both">${head("Organizers keep the / experience *moving.*", 14.55)}</div>
<div style="position:absolute;left:70px;top:720px;animation:push 2.5s linear 14.5s both"><div style="animation:dip .7s ease 14.15s both">
${duo({ img: D.orders, w: 940, t: 11.35, dur: 1.15, layers: [{ img: D.insights, t: 14.05 }] })}
</div></div>
<div style="position:absolute;left:150px;right:150px;top:650px;animation:toastIn .45s var(--spring) 12.5s both, out .4s var(--in) 14.3s forwards">
  <div style="display:flex;gap:22px;align-items:center;background:#fff;color:#121212;border-radius:30px;padding:24px 30px;box-shadow:0 30px 60px rgba(0,0,0,.5)">
    <span style="width:70px;height:70px;border-radius:16px;background:#121212;display:flex;align-items:center;justify-content:center"><img src="${LOGO}" style="width:58px"></span>
    <div><p style="font:700 36px Inter,sans-serif">New order IG-2048</p><p style="font:500 30px Inter,sans-serif;color:#555">1× Festival Combo · Kwame O.</p></div>
  </div></div>
<div style="position:absolute;left:90px;right:90px;top:1460px;display:flex;gap:18px;flex-wrap:wrap;animation:out .3s var(--in) 14.4s forwards">
  ${pill("New", "#93c5fd", 13.0)}${arrow}${pill("Started", "#6ee7b7", 13.5)}${arrow}${pill("Ready", LIME, 14.0)}
</div>
<span style="position:absolute;left:90px;top:1460px;font:600 32px Inter,sans-serif;color:#a9ad9f;border:2px solid #3a3d35;border-radius:999px;padding:10px 24px;opacity:0;animation:show .01s linear 14.6s both">Illustrative data</span>`, "inRight .5s var(--out)");

// ---- Punchline (17–20s): website line + end card ----
const outro = scene(17.0, 99, `
<h1 class="h" style="position:absolute;left:90px;right:90px;top:420px;font-size:150px;letter-spacing:-5px">${words("Enjoy the / event, / *not* *the* *line.*", 17.05, { stagger: 0.08, dur: 0.55 })}</h1>
<img src="${LOGO}" style="position:absolute;left:90px;top:1130px;width:470px;${anim("popIn", 0.6, 18.0, "var(--spring)")}">
<span style="position:absolute;left:90px;top:1330px;font:700 52px 'Space Grotesk',sans-serif;background:${LIME};color:#121212;border-radius:999px;padding:20px 44px;${anim("riseIn", 0.5, 18.25)}">no-q.ca</span>`);

const reel = {
    id: "hero-noq-launch",
    dur: 20,
    poster: 19.3, // settled outro, baked in as frame 0 and saved as the cover
    css: `
@keyframes pillOn{from{background:#2a2c26;color:#a9ad9f;transform:scale(1)}50%{transform:scale(1.15)}to{background:var(--on);color:#121212;transform:scale(1)}}
@keyframes toastIn{from{opacity:0;transform:translateY(-120px) scale(.9)}to{opacity:1;transform:none}}
@keyframes push{from{transform:scale(1)}to{transform:scale(1.07)}}
@keyframes dip{0%{opacity:1}35%{opacity:0}65%{opacity:0}100%{opacity:1}}`,
    body: hook + reveal + guests + vendors + outro,
    // 120 BPM: Am F C G Am F C G F C. Sparse intro, drop on the logo at 4.0, final C hit on the end card at 18.0.
    score: {
        bpm: 120,
        chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62], [53, 57, 60], [48, 52, 55]],
        drop: 4.0, arpFrom: 6.0, end: 18.0,
        sfx: [
            ...Array.from({ length: COUNT }, (_, i) => ({ t: TICK0 + i * TICK, kind: "tick" })), // counter
            { t: 1.95, kind: "sweep" },                                   // dots swept away
            { t: 2.25, kind: "note", note: 76 }, { t: 2.5, kind: "note", note: 81, len: 0.6 }, // "Not anymore."
            { t: 3.0, kind: "riser", len: 1.0 },                         // into the drop
            { t: 4.0, kind: "impact" },                                   // logo
            { t: 7.0, kind: "whoosh" }, { t: 11.0, kind: "whoosh" }, { t: 14.5, kind: "whoosh" }, { t: 17.0, kind: "whoosh" },
            { t: 8.0, kind: "tap" }, { t: 9.0, kind: "tap" }, { t: 10.0, kind: "tap" },
            { t: 10.0, kind: "chime" },                                   // order confirmed
            { t: 11.35, kind: "riser", len: 1.1, gain: 0.42 },            // Duo unfold
            { t: 12.5, kind: "ding" },                                    // new-order toast
            { t: 13.0, kind: "click", note: 84 }, { t: 13.5, kind: "click", note: 88 }, { t: 14.0, kind: "click", note: 91 },
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
