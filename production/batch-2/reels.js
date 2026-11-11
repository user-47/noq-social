// Batch 2 Reels. node batch-2/reels.js [id|all] [--stills=t1,t2,...]   (--stills writes review frames to production/out/review)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const K = require("../lib/reel-kit");
const { S, D, iphone, duo, words, layer, anim, endCard } = K;

const OUT = path.join(__dirname, "..", "..", "site", "batches", "batch-2", "reels");
const REVIEW = path.join(__dirname, "..", "out", "review");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(REVIEW, { recursive: true });

const headline = (text, t0, { size = 128, top = 250, exit, align = "left", strike } = {}) =>
    layer(`<h1 class="h" style="font-size:${size}px;text-align:${align}">${words(text, t0, { strike })}</h1>`, { style: `left:90px;right:90px;top:${top}px`, exit });
const caption = (html, t0, { top, exit, style = "" } = {}) =>
    layer(`<p class="sub" style="${style}">${html}</p>`, { style: `left:90px;right:90px;top:${top}px`, exit, enter: anim("riseIn", 0.7, t0) });

// Falling snow, deterministic.
const snow = (() => {
    let seed = 11;
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const flakes = Array.from({ length: 42 }, () => {
        const s = 4 + r() * 9, d = 7 + r() * 7;
        return `<i style="position:absolute;left:${(r() * 100).toFixed(1)}%;top:-30px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;border-radius:50%;background:#fff;opacity:${(0.12 + r() * 0.3).toFixed(2)};filter:blur(${(r() * 1.5).toFixed(1)}px);animation:fall ${d.toFixed(1)}s linear -${(r() * d).toFixed(1)}s infinite;--x:${Math.round(r() * 120 - 60)}px"></i>`;
    }).join("");
    return `<style>@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--x),1990px)}}</style><div style="position:absolute;inset:0;pointer-events:none;z-index:0">${flakes}</div>`;
})();

// Swaps through values at fixed times (counters, timers).
const ticker = (values, t0, stepS, style) =>
    `<div style="position:relative;${style}">${values
        .map((v, i) => {
            const t = (t0 + i * stepS).toFixed(2), next = (t0 + (i + 1) * stepS).toFixed(2);
            const hide = i < values.length - 1 ? `, hide .01s linear ${next}s forwards` : "";
            return `<span style="position:${i ? "absolute" : "relative"};left:0;top:0;opacity:0;animation:show .01s linear ${t}s both${hide}">${v}</span>`;
        })
        .join("")}</div>`;
const pill = (text, t, bg = "#cef24e", fg = "#121212", extra = "") =>
    `<span style="display:inline-block;font:700 46px 'Space Grotesk',sans-serif;background:${bg};color:${fg};border-radius:999px;padding:18px 36px;box-shadow:0 20px 50px rgba(0,0,0,.45);${anim("popIn", 0.6, t, "var(--spring)")};${extra}">${text}</span>`;
const person = (i, t) => `<svg width="62" height="88" viewBox="0 0 54 76" style="opacity:${1 - i * 0.05};animation:popIn .4s var(--spring) ${t + i * 0.05}s both"><circle cx="27" cy="16" r="14" fill="#4a4d45"/><path d="M4 76c0-18 10-32 23-32s23 14 23 32Z" fill="#4a4d45"/></svg>`;
const scene = (t, end, inner) => `<div style="position:absolute;inset:0;animation:inRight .55s var(--out) ${t}s both"><div style="position:absolute;inset:0;animation:outLeft .45s var(--in) ${end}s both">${inner}</div></div>`;

const reels = [
    // ---------- Week 4 · Guests ----------
    {
        id: "w4-mon",
        dur: 12,
        cover: 6.2,
        body: `${snow}
${headline("Winter market, / *two* *ways.*", 0.25, { size: 116, exit: 9.0 })}
<div style="position:absolute;left:70px;right:70px;top:610px;height:470px;${anim("riseIn", 0.7, 1.4)}"><div style="position:absolute;inset:0;animation:out .5s var(--in) 9.0s both;background:#1b1c18;border:3px solid #2e3029;border-radius:44px;padding:44px">
  <div style="display:flex;justify-content:space-between;align-items:center"><p style="font:700 46px 'Space Grotesk';color:#a9ad9f">Without NO-Q</p><span style="font:700 38px 'Space Grotesk';color:#bfe3ff;border:3px solid rgba(191,227,255,.45);border-radius:999px;padding:8px 24px">❄ −18°C</span></div>
  <div style="display:flex;gap:16px;margin-top:44px">${Array.from({ length: 11 }, (_, i) => person(i, 1.8)).join("")}</div>
  <div style="display:flex;align-items:baseline;gap:20px;margin-top:34px;font:700 64px 'Space Grotesk';color:#a9ad9f">${ticker(["0:00", "4:37", "9:12", "14:58", "19:40", "25:03"], 2.2, 0.75, "min-width:190px")}<span style="font:500 40px Inter">in line</span></div>
</div></div>
<div style="position:absolute;left:70px;right:70px;top:1130px;height:520px;${anim("riseIn", 0.7, 4.6)}"><div style="position:absolute;inset:0;animation:out .5s var(--in) 9.0s both;background:linear-gradient(135deg,rgba(206,242,78,.16),rgba(206,242,78,0) 60%),#1b1c18;border:3px solid #cef24e;border-radius:44px;padding:44px">
  <p style="font:700 46px 'Space Grotesk';color:#cef24e">With NO-Q</p>
  <p style="font:700 68px/1.08 'Space Grotesk';margin-top:26px;max-width:470px">Order from the fire pit.</p>
  <p style="font:500 40px/1.3 Inter;color:#c9ccc0;margin-top:20px;max-width:440px">Pick up when it’s ready.</p>
</div></div>
${layer(`<div style="--r0:14deg;--r1:6deg;${anim("phoneUp", 1.1, 5.0, "var(--spring)")}">${iphone(S.menu, { w: 380, finish: "burgundy", layers: [{ img: S.confirmed.img, t: 6.4 }] })}</div>`, { style: "left:610px;top:1040px", exit: 9.0 })}
${layer(pill("Ready ✓", 7.2), { style: "left:470px;top:1520px", exit: 9.0 })}
${endCard(9.4, "Stay by the fire. We’ll call your number.")}`,
    },
    {
        id: "w4-wed",
        dur: 10,
        cover: 5.0,
        body: `${snow}
${layer(`<p style="font:500 50px/1.45 Inter,sans-serif;text-align:center">${words("pov: it’s −22° in calgary and your hot chocolate is ready before your fingers go numb", 0.3, { stagger: 0.09, dur: 0.6 })}</p>`, { style: "left:110px;right:110px;top:300px", exit: 7.2 })}
${layer(`<div style="--r0:0deg;--r1:0deg;${anim("phoneUp", 1.2, 2.2, "var(--spring)")}">${iphone(S.menu, { w: 560, finish: "nightSky", layers: [{ img: S.checkout.img, t: 3.6 }, { img: S.confirmed.img, t: 4.6 }] })}</div>`, { style: "left:260px;top:720px", exit: 7.2 })}
${layer(pill("Ready ✓", 5.6, "#cef24e", "#121212", "transform:rotate(-8deg)"), { style: "left:150px;top:960px", exit: 7.2 })}
${endCard(7.5, "Look for NO-Q at your next winter market")}`,
    },
    {
        id: "w4-fri",
        dur: 14,
        cover: 1.4,
        body: (() => {
            const ranks = [
                { n: 4, t: 2.4, text: "Holding the spot in a 30-person line at −20°.", v: "Frostbite. Still no food." },
                { n: 3, t: 4.6, text: "Sending one friend to queue while everyone warms up.", v: "They will remember this." },
                { n: 2, t: 6.8, text: "Giving up on mini donuts because the line’s too long.", v: "Tragic." },
            ];
            const big = (n) => `<span style="font:700 330px/0.8 'Space Grotesk',sans-serif;letter-spacing:-12px;color:${n === 1 ? "#cef24e" : "transparent"};-webkit-text-stroke:${n === 1 ? 0 : 5}px #a9ad9f">#${n}</span>`;
            const chip = (v, good, t) => `<span style="align-self:flex-start;font:700 46px 'Space Grotesk';background:${good ? "#cef24e" : "#2a2c26"};color:${good ? "#121212" : "#a9ad9f"};border-radius:999px;padding:16px 34px;${anim("popIn", 0.5, t, "var(--spring)")}">${v}</span>`;
            return `${snow}
${headline("Ranking / winter / market / *moves*", 0.2, { size: 170, top: 330, exit: 2.1 })}
${caption("worst → best", 1.0, { top: 1100, exit: 2.1, style: "font-size:56px" })}
${ranks.map((r) => scene(r.t, r.t + 2.1, `<div style="position:absolute;left:90px;right:90px;top:380px;display:flex;flex-direction:column;gap:60px">${big(r.n)}<h1 class="h" style="font-size:104px;letter-spacing:-2px">${r.text}</h1>${chip(r.v, false, r.t + 0.9)}</div>`)).join("")}
${scene(9.0, 11.4, `<div style="position:absolute;left:90px;right:90px;top:300px;display:flex;flex-direction:column;gap:40px">${big(1)}<h1 class="h" style="font-size:84px;letter-spacing:-2px;max-width:600px">Scan the QR. Order from the fire pit.</h1>${chip("Elite.", true, 9.9)}</div>
<div style="position:absolute;left:590px;top:900px;--r0:16deg;--r1:7deg;${anim("phoneUp", 1.0, 9.3, "var(--spring)")}">${iphone(S.menu, { w: 440, finish: "glacier" })}</div>`)}
${endCard(11.8, "Which one are you? 👇")}`;
        })(),
    },

    // ---------- Week 5 · Vendors ----------
    {
        id: "w5-mon",
        dur: 13,
        cover: 1.2,
        body: (() => {
            const items = ["Set stock counts", "Turn on low-stock alerts", "Print your table QR", "Keep live orders open"];
            const rows = items
                .map((t, i) => {
                    const at = 2.6 + i * 1.6;
                    return `<div style="display:flex;align-items:center;gap:30px;${anim("riseIn", 0.5, 1.6 + i * 0.12)}">
  <span style="position:relative;flex:0 0 auto;width:84px;height:84px;border-radius:20px;border:6px solid #3a3d35;animation:light .5s var(--out) ${at}s both"><b style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 54px Inter;color:#121212;opacity:0;animation:show .01s linear ${at + 0.15}s both">✓</b></span>
  <p style="font:700 62px 'Space Grotesk';letter-spacing:-1px;color:#a9ad9f;animation:tickText .4s ease ${at}s both">${t}</p></div>`;
                })
                .join("");
            return `${snow}<style>@keyframes tickText{to{color:#f2f4ec}}</style>
${headline("Holiday rush / *checklist*", 0.2, { size: 120, exit: 10.0 })}
${caption("for vendors · save this", 0.8, { top: 520, exit: 10.0 })}
${layer(`<div style="display:flex;flex-direction:column;gap:34px">${rows}</div>`, { style: "left:90px;right:90px;top:660px", exit: 10.0 })}
${layer(duo({ img: D.menu, w: 900, t: 3.0, layers: [{ img: D.store, t: 5.6 }, { img: D.orders, t: 7.4 }] }), { style: "left:90px;top:1160px", exit: 10.0, enter: anim("duoIn", 0.8, 2.0) })}
${endCard(10.4, "Ready for the rush")}`;
        })(),
    },
    {
        id: "w5-wed",
        dur: 11,
        cover: 4.4,
        body: (() => {
            const vals = Array.from({ length: 13 }, (_, i) => 12 - i);
            const t0 = 2.2, st = 0.38, soldAt = t0 + 12 * st;
            const lowAt = t0 + 9 * st;
            return `${snow}
${headline("Stock that / *counts* *itself.*", 0.2, { size: 124, exit: 8.6 })}
${layer(`<div style="background:#1b1c18;border:3px solid #2e3029;border-radius:48px;padding:56px;display:flex;flex-direction:column;gap:20px;align-items:center">
  <p style="font:600 44px Inter;color:#c9ccc0">Jerk Chicken Plate</p>
  ${ticker(vals, t0, st, "font:700 360px/1 'Space Grotesk';letter-spacing:-14px;height:360px;text-align:center")}
  <div style="position:relative;height:90px;width:100%;display:flex;justify-content:center">
    <span style="position:absolute;font:700 46px 'Space Grotesk';background:#3b3212;color:#ffd166;border-radius:999px;padding:16px 36px;opacity:0;animation:popIn .4s var(--spring) ${lowAt}s both, hide .01s linear ${soldAt}s forwards">Only a few left</span>
    <span style="position:absolute;font:700 46px 'Space Grotesk';background:#3a1d1d;color:#ff8a80;border-radius:999px;padding:16px 36px;${anim("popIn", 0.5, soldAt, "var(--spring)")}">Sold out</span>
  </div></div>`, { style: "left:150px;right:150px;top:650px", exit: 8.6, enter: anim("riseIn", 0.7, 1.2) })}
${caption("Every NO-Q sale ticks it down. At zero, guests see Sold out. No awkward “sorry, we’re out” after someone’s paid.", soldAt + 0.4, { top: 1420, exit: 8.6 })}
${endCard(9.0, "Never oversell again")}`;
        })(),
    },
    {
        id: "w5-fri",
        dur: 10,
        cover: 4.6,
        body: `${snow}
${headline("Send this to a / vendor who’s still / counting *cash* / at *−20°.*", 0.2, { size: 100, exit: 7.4 })}
${layer(duo({ img: D.orders, t: 3.2, spin: true, spinAt: 2.1 }), { style: "left:70px;top:860px", exit: 7.4, enter: anim("duoIn", 0.8, 1.2) })}
${caption("Card payments · live orders · gloves stay on", 4.8, { top: 1580, exit: 7.4, style: "color:#cef24e;font-weight:600" })}
${endCard(7.8, "Card payments, live orders, no cash box")}`,
    },

    // ---------- Weeks 6–7 · Year-end ----------
    {
        id: "w6-mon",
        dur: 12,
        cover: 2.0,
        body: `${snow}<style>@keyframes yrOut{to{transform:translateY(-100%);opacity:0}}@keyframes yrIn{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}</style>
<div style="position:absolute;left:0;right:0;top:420px;height:330px;overflow:hidden;text-align:center;font:700 330px/1 'Space Grotesk';letter-spacing:-14px;animation:out .5s var(--in) 3.0s both">
  <span style="position:absolute;left:0;right:0;animation:riseIn .6s var(--out) .1s both, yrOut .5s var(--in) 1.2s forwards">2026</span>
  <span style="position:absolute;left:0;right:0;color:#cef24e;animation:yrIn .6s var(--out) 1.5s both">2027</span>
</div>
${caption("Planning an event?", 1.9, { top: 820, exit: 3.0, style: "text-align:center;font:700 72px 'Space Grotesk';color:#f2f4ec" })}
${[
    ["Create your event", 3.4, 5.4],
    ["Invite your vendors", 5.4, 7.4],
    ["See every sale", 7.4, 9.3],
]
    .map(([t, a, b], i) => `<div style="position:absolute;left:90px;right:90px;top:330px;animation:inRight .55s var(--out) ${a}s both"><div style="display:flex;align-items:center;gap:26px;animation:outLeft .45s var(--in) ${b - 0.1}s both"><span class="num">${i + 1}</span><h1 class="h" style="font-size:96px">${t}</h1></div></div>`)
    .join("")}
${layer(duo({ img: D.eventQr, t: 3.6, layers: [{ img: D.roster, t: 5.5 }, { img: D.insights, t: 7.5 }] }), { style: "left:70px;top:620px", exit: 9.3, enter: anim("duoIn", 0.8, 3.1) })}
${endCard(9.6, "Book your 2027 season with NO-Q")}`,
    },
    {
        id: "w7-mon",
        dur: 13,
        cover: 1.6,
        body: (() => {
            const cards = [
                { t: 2.6, bg: "#cef24e", k: "Orders, no lines", big: ticker(["0", "214", "488", "731", "902", "1,026"], 3.0, 0.14, ""), s: "orders from 18 vendors. Not one of them in a queue." },
                { t: 4.8, bg: "#bfe3ff", k: "Busiest hour", big: "8 PM", s: "3,100 items in one hour. Plan staff and lighting around it." },
                { t: 7.0, bg: "#ff8a5c", k: "Top vendor", big: "Island<br>Grill", s: "$4,820.50 across 312 orders. Corner spot next year?" },
            ];
            const card = (c, i) => `<div style="position:absolute;inset:0;background:${c.bg};color:#121212;clip-path:circle(0% at 50% 60%);animation:wipe .7s var(--io) ${c.t}s both">
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 15%,rgba(255,255,255,.3),rgba(255,255,255,0) 40%)"></div>
  <p style="position:absolute;left:90px;top:260px;font:700 40px 'Space Grotesk';opacity:.8">Your event, wrapped · ${i + 1}/3</p>
  <div style="position:absolute;left:90px;right:90px;top:560px;display:flex;flex-direction:column;gap:30px">
    <p style="font:600 56px Inter;opacity:.8;${anim("riseIn", 0.5, c.t + 0.3)}">${c.k}</p>
    <div style="font:700 270px/.9 'Space Grotesk';letter-spacing:-12px;${anim("riseIn", 0.6, c.t + 0.4)}">${c.big}</div>
    <p style="font:500 56px/1.3 Inter;${anim("riseIn", 0.5, c.t + 0.7)}">${c.s}</p>
  </div>
  <p style="position:absolute;left:90px;bottom:330px;font:600 34px Inter;opacity:.65">Illustrative data</p>
</div>`;
            return `${snow}<style>@keyframes wipe{to{clip-path:circle(150% at 50% 60%)}}</style>
${headline("2026 is / a wrap.", 0.2, { size: 110, top: 360, exit: 2.4 })}
${layer(`<h1 class="h" style="font-size:190px;color:#cef24e">${words("Your event, wrapped.", 0.9)}</h1>`, { style: "left:90px;right:90px;top:640px", exit: 2.4 })}
${cards.map(card).join("")}
<div style="position:absolute;inset:0;background:#121212;clip-path:circle(0% at 50% 60%);animation:wipe .7s var(--io) 9.4s both">${snow}${endCard(9.8, "Get your own recap in 2027")}<p style="position:absolute;left:0;right:0;bottom:300px;text-align:center;font:600 30px Inter;color:#a9ad9f">Figures are illustrative</p></div>`;
        })(),
    },
    {
        id: "w7-wed",
        dur: 10,
        cover: 5.4,
        body: (() => {
            const items = [["Drink more water", 1.4], ["Go outside more", 1.7], ["Finally learn to skate", 2.0]];
            const box = (on, t) => `<span style="flex:0 0 auto;position:relative;width:96px;height:96px;border-radius:24px;border:7px solid #3a3d35;${on ? `animation:light .5s var(--out) ${t}s both` : ""}">${on ? `<b style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 62px Inter;color:#121212;opacity:0;animation:show .01s linear ${t + 0.15}s both">✓</b>` : ""}</span>`;
            return `${snow}
${headline("2027 / resolutions", 0.2, { size: 140, exit: 7.0 })}
${caption("realistic edition", 0.9, { top: 560, exit: 7.0 })}
${layer(`<div style="display:flex;flex-direction:column;gap:50px">
${items.map(([t, a]) => `<div style="display:flex;align-items:center;gap:34px;${anim("riseIn", 0.5, a)}">${box(false)}<p style="font:700 66px 'Space Grotesk';color:#6f7369;position:relative">${t}<i style="position:absolute;left:-2%;right:-2%;top:52%;height:6px;background:#6f7369;transform-origin:left;animation:sweep .4s var(--out) ${a + 1.6}s both"></i></p></div>`).join("")}
<div style="display:flex;align-items:center;gap:34px;${anim("riseIn", 0.5, 3.8)}">${box(true, 4.6)}<p style="font:700 84px/1.05 'Space Grotesk';letter-spacing:-2px">Never wait in a <span style="color:#cef24e">food line</span> again</p></div>
</div>`, { style: "left:90px;right:90px;top:720px", exit: 7.0 })}
${endCard(7.3, "The only one you’ll actually keep")}`;
        })(),
    },
];

(async () => {
    const id = process.argv[2];
    const stillsArg = process.argv.find((a) => a.startsWith("--stills="));
    const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
    for (const reel of reels.filter((r) => !id || id === "all" || r.id === id)) {
        if (stillsArg) {
            const times = stillsArg.split("=")[1].split(",").map(Number);
            console.log((await K.stills(browser, reel, times, REVIEW)).join("\n"));
        } else {
            const t = Date.now();
            const file = await K.render(browser, reel, OUT);
            console.log("rendered", path.basename(file), `${((Date.now() - t) / 1000).toFixed(0)}s`);
        }
    }
    await browser.close();
})();
module.exports = { reels };
