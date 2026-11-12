// Hero: "my festival plan vs. what actually happened" (trend: payoff structure, planned vs. actual, flipped at the end).
// 19s, 9:16, 120 BPM. Sad sparse music during the split screen; the groove drops on the flip to NO-Q at 10.0.
//   node hero/plan-vs-actual.js --stills=1.8,5,8,9.2,12,13.8,17.5
//   node hero/plan-vs-actual.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const K = require("../lib/reel-kit");
const { S, LOGO, iphone, words, anim } = K;

const LIME = "#cef24e", RED = "#ff8a80";
const OUT = path.join(__dirname, "..", "out", "hero");
const REVIEW = path.join(__dirname, "..", "out", "review");
const scene = (t0, t1, inner, inAnim = "show .01s linear") =>
    `<div style="position:absolute;inset:0;opacity:0;animation:${inAnim} ${t0}s both, hide .01s linear ${t1}s forwards">${inner}</div>`;
const row = (time, text, t, color, mark) => `<div class="row" style="${anim("riseIn", 0.45, t)}"><p class="tm" style="color:${color}">${time}</p><p class="tx">${text}</p><span class="mk" style="color:${color};animation:popIn .35s var(--spring) ${(t + 0.35).toFixed(2)}s both">${mark}</span></div>`;

// Hook (0–3): tiny lowercase text, the format's signature
const hook = scene(0, 3.0, `
<p style="position:absolute;left:110px;right:110px;top:700px;text-align:center;font:500 64px/1.35 Inter,sans-serif">${words("my festival plan / vs. what *actually* *happened*", 0.15, { stagger: 0.09, dur: 0.5 })}</p>
<p style="position:absolute;left:0;right:0;top:1000px;text-align:center;font-size:90px;${anim("popIn", 0.5, 1.3, "var(--spring)")}">🫠</p>`);

// Split screen (3–8.5)
const split = scene(3.0, 8.5, `
<div class="col" style="left:60px"><p class="hd" style="color:${LIME};${anim("riseIn", 0.4, 3.05)}">PLANNED</p>
  ${row("7:00", "Grab food", 3.4, LIME, "✓")}${row("7:15", "Find a good spot", 4.9, LIME, "✓")}${row("8:00", "Headliner, front row", 6.4, LIME, "✓")}</div>
<div class="col" style="left:560px"><p class="hd" style="color:${RED};${anim("riseIn", 0.4, 3.2)}">ACTUAL</p>
  ${row("7:00", "Join the food line", 3.9, RED, "✕")}${row("7:41", "Still in the line", 5.4, RED, "✕")}${row("8:00", "Hear the headliner… from the line", 6.9, RED, "✕")}</div>
<i style="position:absolute;left:539px;top:470px;width:2px;height:1100px;background:#2e3029;${anim("grow", 0.5, 3.0)};transform-origin:top"></i>`);

// Flip (8.5–10): record-scratch moment, then the lime wipe
const flip = scene(8.5, 10.0, `
<p class="h" style="position:absolute;left:90px;right:90px;top:720px;font-size:120px;letter-spacing:-4px">${words("then I found / the *QR* *code.*", 8.55, { stagger: 0.08, dur: 0.45 })}</p>
<div style="position:absolute;inset:0;background:${LIME};transform:scaleY(0);transform-origin:bottom;animation:sweepUp .5s var(--io) 9.5s both"></div>`);

// Actual, with NO-Q (10–15)
const noq = scene(10.0, 15.0, `
<div class="col" style="left:60px;width:540px"><p class="hd" style="color:${LIME};${anim("riseIn", 0.4, 10.0)}">ACTUAL, WITH NO-Q</p>
  ${row("7:00", "Scan the QR", 10.3, LIME, "✓")}${row("7:01", "Order + pay from the blanket", 11.2, LIME, "✓")}${row("7:12", "Pick up when it’s ready", 12.1, LIME, "✓")}${row("8:00", "Headliner, front row", 13.0, LIME, "✓")}</div>
<div style="position:absolute;left:640px;top:700px;--r0:10deg;--r1:4deg;${anim("phoneUp", 0.9, 10.05, "var(--spring)")}">
${iphone(S.event, { w: 400, finish: "glacier", layers: [{ img: S.menu.img, t: 11.2 }, { img: S.confirmed.img, t: 12.1 }], overlay: `<i style="position:absolute;left:50%;top:44%;width:140px;height:140px;margin:-70px 0 0 -70px;border-radius:50%;border:5px solid ${LIME};animation:pulse 1s var(--out) 12.4s both"></i>` })}</div>`, "fadeIn .25s ease");

// End (15–19)
const end = scene(15.0, 99, `
<h1 class="h" style="position:absolute;left:90px;right:90px;top:520px;font-size:150px;letter-spacing:-5px">${words("Plans that / *actually* / *happen.*", 15.05, { stagger: 0.09, dur: 0.55 })}</h1>
<img src="${LOGO}" style="position:absolute;left:90px;top:1130px;width:470px;${anim("popIn", 0.6, 16.0, "var(--spring)")}">
<span style="position:absolute;left:90px;top:1330px;font:700 52px 'Space Grotesk',sans-serif;background:${LIME};color:#121212;border-radius:999px;padding:20px 44px;${anim("riseIn", 0.5, 16.25)}">no-q.ca</span>`);

const reel = {
    id: "hero-plan-vs-actual",
    dur: 19,
    poster: 13.8, // the flipped, all-green list next to the phone: the payoff, settled
    css: `
.col{position:absolute;top:360px;width:460px;display:flex;flex-direction:column;gap:46px}
.hd{font:700 44px 'Space Grotesk',sans-serif;letter-spacing:4px}
.row{display:grid;grid-template-columns:auto 1fr;gap:6px 0}
.tm{font:700 64px 'Space Grotesk',sans-serif;letter-spacing:-2px;grid-column:1}
.mk{font:700 56px Inter,sans-serif;grid-column:2;justify-self:end;align-self:center}
.tx{font:600 40px/1.25 Inter,sans-serif;grid-column:1/3}
@keyframes sweepUp{from{transform:scaleY(0)}to{transform:scaleY(1)}}`,
    body: hook + split + flip + noq + end,
    score: {
        bpm: 120,
        chords: [[57, 60, 64], [53, 57, 60], [52, 55, 59], [52, 56, 59], [48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60], [48, 52, 55], [48, 52, 55]],
        drop: 10.0, arpFrom: 10.0, end: 16.0,
        sfx: [
            { t: 1.3, kind: "note", note: 64, len: 0.8 },                                  // 🫠
            { t: 3.0, kind: "whoosh" },
            { t: 3.4, kind: "click", note: 84 }, { t: 4.9, kind: "click", note: 84 }, { t: 6.4, kind: "click", note: 84 },   // planned ✓ (bright)
            { t: 3.9, kind: "note", note: 52, len: 0.4 }, { t: 5.4, kind: "note", note: 51, len: 0.4 }, { t: 6.9, kind: "note", note: 50, len: 0.6 }, // actual ✕ (sinking)
            { t: 8.5, kind: "sweep", len: 0.4 },                                           // the "scratch"
            { t: 9.0, kind: "riser", len: 1.0 },
            { t: 10.0, kind: "impact" },
            { t: 10.3, kind: "tap" }, { t: 11.2, kind: "tap" }, { t: 12.1, kind: "chime" }, { t: 13.0, kind: "click", note: 91 },
            { t: 15.0, kind: "whoosh" },
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
