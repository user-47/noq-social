// Batch 1 Reels. node batch-1/reels.js [id|all] [--stills=t1,t2,...]   (--stills writes review frames to production/out/review)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const K = require("../lib/reel-kit");
const { S, D, P, QR, iphone, duo, words, layer, anim, endCard } = K;

const OUT = path.join(__dirname, "..", "..", "site", "batches", "batch-1", "reels");
const REVIEW = path.join(__dirname, "..", "out", "review");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(REVIEW, { recursive: true });

// Headline block at the top safe area (y 250+).
const headline = (text, t0, { size = 128, top = 250, exit, align = "left", strike } = {}) =>
    layer(`<h1 class="h" style="font-size:${size}px;text-align:${align}">${words(text, t0, { strike })}</h1>`, {
        style: `left:90px;right:90px;top:${top}px`,
        exit,
    });
const caption = (html, t0, { top, exit, style = "" } = {}) =>
    layer(`<p class="sub" style="${style}">${html}</p>`, { style: `left:90px;right:90px;top:${top}px`, exit, enter: anim("riseIn", 0.7, t0) });

const reels = [
    // ---------------- Week 1 · Guests ----------------
    {
        id: "w1-mon",
        dur: 9,
        cover: 4.6,
        body: `
<div style="position:absolute;inset:0;${anim("fadeIn", 0.8, 0)}"><div style="position:absolute;inset:0;animation:out .6s var(--in) 6.6s both">
  <img src="${P.crowd}" style="width:100%;height:100%;object-fit:cover;opacity:.42;${anim("kb", 9, 0, "linear")}">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,#121212 8%,rgba(18,18,18,.2) 45%,#121212 92%)"></div></div></div>
${headline("Lines / are so / *last* *year.*", 0.35, { size: 150, exit: 6.6, strike: ["Lines"] })}
${layer(`<div style="display:flex;gap:18px">${["Scan", "Order", "Pick up"].map((w, i) => `<span class="chip" style="${anim("popIn", 0.6, 4.4 + i * 0.18, "var(--spring)")}">${w}</span>`).join("")}</div>`, { style: "left:90px;top:810px", exit: 6.6 })}
${layer(`<div style="--r0:14deg;--r1:-5deg;${anim("phoneUp", 1.3, 2.0, "var(--spring)")}">${iphone(S.menu, {
            w: 540,
            finish: "glacier",
            overlay: `<i style="position:absolute;left:24%;top:30%;width:180px;height:180px;border-radius:50%;background:rgba(206,242,78,.6);animation:ripple .9s var(--out) 3.9s both"></i>`,
        })}</div>`, { style: "left:450px;top:930px", exit: 6.6 })}
${endCard(7.0, "Skip the line at your next event")}`,
    },
    {
        id: "w1-wed",
        dur: 15,
        cover: 1.8,
        body: (() => {
            const steps = [
                { n: 1, t: 2.6, title: "Scan the QR", sub: "On banners, A-frames and table tents.", media: `<div style="width:900px;height:1080px;border-radius:44px;overflow:hidden;position:relative;box-shadow:0 40px 90px rgba(0,0,0,.6)"><img src="${P.tent}" style="width:100%;height:100%;object-fit:cover;object-position:60% 50%;${anim("kb", 2.6, 2.6, "linear")}"></div>` },
                { n: 2, t: 5.2, title: "Pick your food", sub: "Every vendor’s menu, with live stock.", media: `<div style="padding-left:180px;--r0:8deg;--r1:0deg;${anim("phoneUp", 1.1, 5.3, "var(--spring)")}">${iphone(S.product, { w: 540 })}</div>` },
                { n: 3, t: 7.8, title: "Pay on your phone", sub: "Card payment, right in the browser.", media: `<div style="padding-left:180px;--r0:8deg;--r1:0deg;${anim("phoneUp", 1.1, 7.9, "var(--spring)")}">${iphone(S.checkout, { w: 540, finish: "silver" })}</div>` },
                { n: 4, t: 10.4, title: "Get your number", sub: "Go enjoy the event. We’ll tell you when it’s ready.", media: `<div style="padding-left:180px;--r0:8deg;--r1:0deg;${anim("phoneUp", 1.1, 10.5, "var(--spring)")}">${iphone(S.confirmed, { w: 540, finish: "burgundy", overlay: `<i style="position:absolute;left:50%;top:52%;width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;border:5px solid #cef24e;animation:pulse 1.1s var(--out) 11.6s both"></i><i style="position:absolute;left:50%;top:52%;width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;border:5px solid #cef24e;animation:pulse 1.1s var(--out) 12.1s both"></i>` })}</div>` },
            ];
            const scene = (s) => {
                const end = s.t + 2.6;
                return `<div style="position:absolute;inset:0;animation:inRight .6s var(--out) ${s.t}s both"><div style="position:absolute;inset:0;animation:outLeft .5s var(--in) ${end - 0.1}s both">
  <div style="position:absolute;left:90px;top:300px;display:flex;align-items:center;gap:26px"><span class="num">${s.n}</span><h1 class="h" style="font-size:96px">${s.title}</h1></div>
  <p class="sub" style="position:absolute;left:90px;right:90px;top:430px">${s.sub}</p>
  <div style="position:absolute;left:90px;top:600px">${s.media}</div></div></div>`;
            };
            const bar = `<div style="position:absolute;left:90px;right:90px;top:220px;display:flex;gap:12px;${anim("fadeIn", 0.4, 2.6)}"><div style="position:absolute;inset:0;animation:hide .3s ease 13.0s forwards"></div>${steps.map((s) => `<div style="flex:1;height:8px;border-radius:4px;background:#2e3029;overflow:hidden"><div style="height:100%;background:#cef24e;transform-origin:left;animation:sweep 2.6s linear ${s.t}s both"></div></div>`).join("")}</div>`;
            const queue = `<div style="position:absolute;left:90px;top:1180px;display:flex;gap:30px">${Array.from({ length: 7 }, (_, i) => `<i style="width:70px;height:70px;border-radius:50%;background:#2e3029;display:block;animation:popIn .4s var(--spring) ${0.2 + i * 0.06}s both, outLeft .5s var(--in) ${1.4 + i * 0.07}s both"></i>`).join("")}</div>`;
            return `
${headline("Skip / the / *line.*", 0.25, { size: 220, top: 330, exit: 2.3 })}
${caption("in 4 steps, no app needed", 0.9, { top: 1060, exit: 2.3, style: "font-size:48px" })}
${queue}
${bar}
${steps.map(scene).join("")}
${endCard(13.2, "Save this for your next festival")}`;
        })(),
    },
    {
        id: "w1-fri",
        dur: 9,
        cover: 4.9,
        body: (() => {
            const bracket = (pos, t) => {
                const [v, h] = pos.split("");
                const css = `${v === "t" ? "top" : "bottom"}:0;${h === "l" ? "left" : "right"}:0;border-${v === "t" ? "top" : "bottom"}:12px solid #cef24e;border-${h === "l" ? "left" : "right"}:12px solid #cef24e;border-${v}${h === "l" ? "l" : "r"}-radius:0`;
                const from = `${h === "l" ? "-" : ""}90px,${v === "t" ? "-" : ""}90px`;
                return `<i style="position:absolute;width:130px;height:130px;${css};border-radius:${v === "t" && h === "l" ? "36px 0 0 0" : v === "t" ? "0 36px 0 0" : h === "l" ? "0 0 0 36px" : "0 0 36px 0"};animation:bIn${pos} .7s var(--out) ${t}s both"></i><style>@keyframes bIn${pos}{from{opacity:0;transform:translate(${from})}to{opacity:1;transform:none}}</style>`;
            };
            return `
${headline("No app.", 0.25, { size: 170, top: 260, exit: 6.6 })}
${layer(`<h1 class="h" style="font-size:120px;color:#cef24e">${words("Just your camera.", 3.3)}</h1>`, { style: "left:90px;right:90px;top:450px", exit: 6.6 })}
<div style="position:absolute;left:240px;top:780px;width:600px;height:600px;animation:out .5s var(--in) 3.0s both">
  <div style="position:absolute;inset:60px;background:#fff;border-radius:28px;padding:34px;${anim("popIn", 0.7, 0.5, "var(--spring)")}">${QR.replace("<svg", '<svg style="width:100%;height:100%"')}</div>
  ${["tl", "tr", "bl", "br"].map((p) => bracket(p, 0.9)).join("")}
  <i style="position:absolute;left:40px;right:40px;top:70px;height:6px;border-radius:3px;background:#cef24e;box-shadow:0 0 30px 8px rgba(206,242,78,.6);opacity:0;animation:fadeIn .2s ease 1.3s both, scan 1.5s var(--io) 1.3s both;--scan:450px"></i>
</div>
<div style="position:absolute;inset:0;background:#fff;opacity:0;animation:flash .5s ease 2.9s both"></div>
${layer(`<div style="--r0:-30deg;--r1:-9deg;${anim("phoneUp", 1.2, 3.0, "var(--spring)")}">${iphone(S.event, { w: 470 })}</div>`, { style: "left:40px;top:860px", exit: 6.6 })}
${layer(`<div style="--r0:30deg;--r1:9deg;${anim("phoneUp", 1.2, 3.15, "var(--spring)")}">${iphone(S.menu, { w: 470, finish: "glacier" })}</div>`, { style: "left:570px;top:900px", exit: 6.6 })}
${endCard(7.0, "Point. Scan. Every vendor on your phone.")}`;
        })(),
    },

    // ---------------- Week 2 · Vendors ----------------
    {
        id: "w2-mon",
        dur: 13,
        cover: 3.6,
        body: (() => {
            const step = (n, label, t, end) =>
                `<div style="position:absolute;left:90px;right:90px;top:1430px;display:flex;align-items:center;gap:24px;animation:inRight .6s var(--out) ${t}s both"><div style="display:flex;align-items:center;gap:24px;animation:outLeft .45s var(--in) ${end}s both"><span class="num">${n}</span><p style="font:700 60px 'Space Grotesk',sans-serif;letter-spacing:-1px">${label}</p></div></div>`;
            return `
${headline("Vendors, / your menu on / *every* *phone.*", 0.25, { size: 110, exit: 10.3 })}
${layer(duo({ img: D.menu, t: 2.15, spin: true, spinAt: 1.05, layers: [{ img: D.store, t: 6.2 }] }), { style: "left:70px;top:700px", exit: 8.4, enter: anim("duoIn", 0.8, 0.05) })}
${step(1, "Build your menu once", 3.4, 5.9)}
${step(2, "Print your own QR", 6.2, 8.3)}
<div style="position:absolute;left:90px;right:90px;top:700px;animation:riseIn .7s var(--out) 8.6s both"><div style="animation:out .5s var(--in) 10.3s both;display:flex;flex-direction:column;gap:36px">
  <div style="display:flex;align-items:center;gap:24px"><span class="num">3</span><p style="font:700 84px 'Space Grotesk',sans-serif;letter-spacing:-2px">Get paid through Stripe</p></div>
  <div style="background:#1b1c18;border:2px solid #2e3029;border-radius:36px;padding:44px;display:flex;flex-direction:column;gap:22px">
    ${["Card payments reach your payout account", "No cash box to count at close", "Every sale on one dashboard"].map((s, i) => `<p style="font:500 40px Inter,sans-serif;display:flex;gap:20px;align-items:center;${anim("riseIn", 0.5, 9.0 + i * 0.2)}"><span style="color:#cef24e;font-weight:700">✓</span>${s}</p>`).join("")}
  </div></div></div>
${endCard(10.8, "Join your next event")}`;
        })(),
    },
    {
        id: "w2-wed",
        dur: 10,
        cover: 3.4,
        body: (() => {
            const pills = [
                ["New Order", "#93c5fd", "#1d2533"],
                ["Started", "#6ee7b7", "#15291f"],
                ["Awaiting Pickup", "#fcd34d", "#2e2610"],
                ["Picked Up", "#e7e9df", "#2a2c26"],
            ];
            const flow = `<div style="position:absolute;left:90px;right:90px;top:1440px;display:flex;flex-wrap:wrap;gap:16px;animation:out .5s var(--in) 7.6s both">${pills
                .map(([l, c, bg], i) => `<span style="font:600 38px Inter,sans-serif;color:${c};background:${bg};border:2px solid ${c}55;border-radius:999px;padding:14px 28px;opacity:.25;animation:fadeIn .01s linear ${3.9 + i * 0.85}s both;${i ? "" : ""}"><span style="display:inline-block;animation:popIn .5s var(--spring) ${3.9 + i * 0.85}s both">● ${l}</span></span>`)
                .join("")}</div>`;
            const toast = `<div style="position:absolute;left:150px;right:150px;top:620px;animation:out .4s var(--in) 5.2s both"><div style="background:rgba(242,244,236,.96);color:#121212;border-radius:32px;padding:26px 30px;display:flex;gap:22px;align-items:center;box-shadow:0 30px 70px rgba(0,0,0,.5);animation:toastIn .7s var(--spring) 2.9s both">
  <img src="${K.LOGO_TILE}" style="width:84px;height:84px;border-radius:18px">
  <div><p style="font:600 26px Inter,sans-serif;opacity:.6">NO-Q · now</p><p style="font:700 38px Inter,sans-serif">New order IG-2048</p><p style="font:500 30px Inter,sans-serif;opacity:.75">1× Festival Combo · Kwame O.</p></div></div></div>
<style>@keyframes toastIn{from{opacity:0;transform:translateY(-120px) scale(.95)}to{opacity:1;transform:none}}</style>`;
            return `
${headline("Every order, / *live.*", 0.25, { size: 140, exit: 7.6 })}
${layer(duo({ img: D.orders, t: 1.3 }), { style: "left:70px;top:700px", exit: 7.6, enter: anim("duoIn", 0.9, 0.5) })}
${toast}
${flow}
${endCard(8.0, "One tap moves every order along")}`;
        })(),
    },
    {
        id: "w2-fri",
        dur: 10,
        cover: 4.2,
        body: (() => {
            const nums = [12, 11, 10, 9, 8, 7, 6, 5, 4];
            const t0 = 1.6, step = 0.22;
            const counter = nums
                .map((n, i) => {
                    const tin = t0 + i * step;
                    const last = i === nums.length - 1;
                    return `<span style="position:absolute;left:0;right:0;text-align:center;opacity:0;animation:show .01s linear ${tin}s both${last ? "" : `, hide .01s linear ${tin + step}s forwards`}">${n}</span>`;
                })
                .join("");
            const end = t0 + nums.length * step;
            return `
${headline("Never sell / the plate you / *don’t* *have.*", 0.25, { size: 112, exit: 7.4 })}
<div style="position:absolute;left:0;right:0;top:720px;height:420px;animation:shrinkUp .8s var(--io) ${end + 0.7}s both"><div style="animation:out .5s var(--in) 7.4s both;position:relative;height:420px">
  <div style="position:relative;height:380px;font:700 380px/1 'Space Grotesk',sans-serif;color:#cef24e;letter-spacing:-12px;${anim("fadeIn", 0.3, t0)}">${counter}</div>
  <p style="text-align:center;font:600 40px Inter,sans-serif;color:#a9ad9f;${anim("fadeIn", 0.4, t0)}">plates left</p>
  <p style="position:absolute;left:50%;top:470px;transform:translateX(-50%);white-space:nowrap"><span style="display:inline-block;font:700 52px Inter,sans-serif;background:#f59e0b;color:#121212;border-radius:999px;padding:14px 34px;${anim("popIn", 0.6, end + 0.15, "var(--spring)")}">Only 4 left</span></p>
</div></div>
<style>@keyframes shrinkUp{from{transform:none}to{transform:translateY(-120px) scale(.6)}}</style>
${layer(`<div style="--r0:-20deg;--r1:-6deg;${anim("phoneUp", 1.2, end + 1.0, "var(--spring)")}">${iphone(S.menu, { w: 480 })}</div>`, { style: "left:50px;top:1020px", exit: 7.4 })}
${layer(`<div style="--r0:20deg;--r1:6deg;${anim("phoneUp", 1.2, end + 1.15, "var(--spring)")}">${iphone(S.product, { w: 480, finish: "glacier" })}</div>`, { style: "left:550px;top:1060px", exit: 7.4 })}
${endCard(7.8, "Every sale counts down. Guests see it live.")}`;
        })(),
    },

    // ---------------- Week 3 · Organizers ----------------
    {
        id: "w3-mon",
        dur: 12,
        cover: 3.4,
        body: (() => {
            const url = "no-q.ca/register?event=riverbend";
            const typed = [...url].map((c, i) => `<span style="opacity:0;animation:show .01s linear ${3.6 + i * 0.045}s both">${c}</span>`).join("");
            const typeEnd = 3.6 + url.length * 0.045;
            const avatars = ["IG", "SS", "JR", "SB", "TL"];
            const colors = ["#cef24e", "#93c5fd", "#fcd34d", "#6ee7b7", "#f9a8d4", "#c4b5fd", "#fdba74", "#e7e9df"];
            const count = Array.from({ length: 19 }, (_, n) => `<span style="position:absolute;left:0;opacity:0;animation:show .01s linear ${5.9 + n * 0.07}s both${n < 18 ? `, hide .01s linear ${5.97 + n * 0.07}s forwards` : ""}">${n}</span>`).join("");
            return `
${headline("Organizers: / one link, / *every* *vendor.*", 0.25, { size: 112, exit: 8.3 })}
${layer(duo({ img: D.eventQr, t: 1.5, layers: [{ img: D.roster, t: 5.6 }] }), { style: "left:70px;top:700px", exit: 8.3, enter: anim("duoIn", 0.9, 0.7) })}
<div style="position:absolute;left:90px;right:90px;top:1440px;animation:riseIn .6s var(--out) 3.3s both"><div style="animation:out .45s var(--in) 5.4s both;display:flex;gap:16px;align-items:center">
  <div style="flex:1;background:#1b1c18;border:2px solid #2e3029;border-radius:999px;padding:22px 32px;font:500 34px Inter,sans-serif;color:#e7e9df;white-space:nowrap;overflow:hidden">${typed}<span style="display:inline-block;width:3px;height:38px;background:#cef24e;vertical-align:middle;margin-left:4px;animation:blink 1s steps(1) 3.6s infinite"></span></div>
  <span style="font:700 34px 'Space Grotesk',sans-serif;background:#cef24e;color:#121212;border-radius:999px;padding:22px 32px;${anim("popIn", 0.5, typeEnd + 0.15, "var(--spring)")}">Copied ✓</span></div></div>
<div style="position:absolute;left:90px;right:90px;top:1440px;animation:riseIn .6s var(--out) 5.7s both"><div style="animation:out .45s var(--in) 8.3s both;display:flex;align-items:center;gap:26px">
  <div style="display:flex">${avatars.map((a, i) => `<span style="width:92px;height:92px;margin-left:${i ? -22 : 0}px;border-radius:50%;border:5px solid #121212;background:${colors[i]};color:#121212;font:700 30px 'Space Grotesk',sans-serif;display:inline-flex;align-items:center;justify-content:center;${anim("popIn", 0.45, 5.8 + i * 0.12, "var(--spring)")}">${a}</span>`).join("")}</div>
  <p style="font:700 58px 'Space Grotesk',sans-serif;display:flex;gap:16px"><span style="position:relative;display:inline-block;width:80px;color:#cef24e">${count}&nbsp;</span><span style="white-space:nowrap">vendors joined</span></p></div></div>
<div style="position:absolute;left:90px;top:300px;right:90px;animation:riseIn .6s var(--out) 8.6s both"><div style="animation:out .5s var(--in) 10.0s both">
  <h1 class="h" style="font-size:96px">Put the QR on <span style="color:#cef24e">the grounds.</span></h1></div></div>
<div style="position:absolute;left:90px;top:620px;width:430px;height:720px;border-radius:36px;overflow:hidden;transform:rotate(-3deg);animation:inLeft .8s var(--out) 8.8s both"><div style="width:100%;height:100%;animation:out .5s var(--in) 10.0s both"><img src="${P.banner}" style="width:100%;height:100%;object-fit:cover"></div></div>
<div style="position:absolute;right:90px;top:680px;width:430px;height:720px;border-radius:36px;overflow:hidden;transform:rotate(3deg);animation:inRight .8s var(--out) 9.0s both"><div style="width:100%;height:100%;animation:out .5s var(--in) 10.0s both"><img src="${P.tent}" style="width:100%;height:100%;object-fit:cover;object-position:62% 50%"></div></div>
<style>@keyframes inLeft{from{opacity:0;transform:translateX(-320px) rotate(-3deg)}to{opacity:1;transform:rotate(-3deg)}} </style>
${endCard(10.4, "Planning an event? Let’s talk.")}`;
        })(),
    },
    {
        id: "w3-wed",
        dur: 10,
        cover: 4.8,
        body: (() => {
            const hours = [["4", 550], ["5", 1330], ["6", 2150], ["7", 2570], ["8", 3100], ["9", 2720], ["10", 1473]];
            const max = 3100;
            const bars = hours
                .map(([h, v], i) => {
                    const top = h === "8";
                    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:14px;height:100%;justify-content:flex-end">
  ${top ? `<span style="font:700 32px 'Space Grotesk',sans-serif;background:#cef24e;color:#121212;border-radius:999px;padding:8px 18px;white-space:nowrap;${anim("popIn", 0.5, 4.6, "var(--spring)")}">Busiest</span>` : ""}
  <div style="width:100%;height:${Math.round((v / max) * 360)}px;border-radius:16px 16px 6px 6px;background:${top ? "#cef24e" : "#3a3d33"};transform-origin:bottom;${anim("grow", 0.8, 3.4 + i * 0.1)}"></div>
  <span style="font:600 30px Inter,sans-serif;color:${top ? "#cef24e" : "#a9ad9f"}">${h} PM</span></div>`;
                })
                .join("");
            return `
${headline("Know your / *busiest* *hour.*", 0.25, { size: 140, exit: 7.6 })}
${layer(duo({ img: D.insights, t: 1.2 }), { style: "left:70px;top:600px", exit: 3.0, enter: anim("duoIn", 0.9, 0.4) })}
<div style="position:absolute;left:90px;right:90px;top:640px;height:620px;background:#1b1c18;border:2px solid #2e3029;border-radius:40px;padding:44px 40px 36px;animation:riseIn .7s var(--out) 3.0s both"><div style="height:100%;display:flex;flex-direction:column;gap:26px;animation:out .5s var(--in) 7.6s both">
  <p style="font:600 34px Inter,sans-serif;color:#e7e9df">Orders per hour, all vendors</p>
  <div style="flex:1;display:flex;gap:18px;align-items:flex-end">${bars}</div></div></div>
${caption("Sales, peak times and top items for every vendor at your event.", 5.2, { top: 1320, exit: 7.6 })}
<p style="position:absolute;right:90px;top:1270px;font:500 26px Inter,sans-serif;color:#7d8173;${anim("fadeIn", 0.4, 3.4)}"><span style="display:inline-block;animation:hide .3s ease 7.6s forwards">Illustrative data</span></p>
${endCard(8.0, "Plan next year with real numbers")}`;
        })(),
    },
    {
        id: "w3-fri",
        dur: 15,
        cover: 1.6,
        body: (() => {
            const cx = 540, cy = 1020, r = 360;
            const nodes = [
                { a: -90, t: 2.6, label: "Organizer creates the event", img: D.eventQr, wide: true },
                { a: -18, t: 4.2, label: "Vendors build their menus", img: D.menu, wide: true },
                { a: 54, t: 5.8, label: "Guests scan, order and pay", img: S.confirmed.img, wide: false },
                { a: 126, t: 7.4, label: "Orders land on the vendor’s screen", img: D.orders, wide: true },
                { a: 198, t: 9.0, label: "The organizer sees it all", img: D.insights, wide: true },
            ];
            const len = Math.round(2 * Math.PI * r);
            const nodeEls = nodes
                .map((n, i) => {
                    const x = cx + r * Math.cos((n.a * Math.PI) / 180), y = cy + r * Math.sin((n.a * Math.PI) / 180);
                    return `<span style="position:absolute;left:${x - 44}px;top:${y - 44}px;width:88px;height:88px;border-radius:50%;background:#2a2c26;color:#a9ad9f;font:700 40px 'Space Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;border:6px solid #121212;animation:light .5s var(--out) ${n.t}s both">${i + 1}</span>`;
                })
                .join("");
            const centre = nodes
                .map((n, i) => {
                    const next = nodes[i + 1] ? nodes[i + 1].t : 10.8;
                    const media = n.wide
                        ? `<img src="${n.img}" style="width:440px;height:300px;object-fit:cover;object-position:top left;border-radius:22px;border:3px solid #2e3029">`
                        : `<img src="${n.img}" style="width:200px;height:400px;object-fit:cover;object-position:top;border-radius:30px;border:3px solid #2e3029">`;
                    return `<div style="position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);opacity:0;animation:popIn .5s var(--out) ${n.t + 0.05}s both, hide .3s ease ${next - 0.1}s forwards">${media}</div>
<p style="position:absolute;left:90px;right:90px;top:1500px;text-align:center;font:700 54px 'Space Grotesk',sans-serif;letter-spacing:-1px;opacity:0;animation:riseIn .5s var(--out) ${n.t + 0.05}s both, hide .25s ease ${next - 0.1}s forwards">${n.label}</p>`;
                })
                .join("");
            return `
${headline("One event. / *One* *round* *trip.*", 0.25, { size: 120, top: 250, exit: 11.6 })}
<div style="position:absolute;inset:0;${anim("fadeIn", 0.5, 2.3)}"><div style="position:absolute;inset:0;animation:out .5s var(--in) 11.6s both">
<svg width="1080" height="1920" style="position:absolute;left:0;top:0"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2a2c26" stroke-width="10"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#cef24e" stroke-width="10" stroke-linecap="round" stroke-dasharray="${len}" transform="rotate(-90 ${cx} ${cy})" style="--len:${len};animation:draw 8s linear 2.6s both"/></svg>
<div style="position:absolute;left:${cx}px;top:${cy}px;width:0;height:0;animation:spin 8s linear 2.6s both;transform-origin:0 0"><i style="position:absolute;left:-18px;top:${-r - 18}px;width:36px;height:36px;border-radius:50%;background:#cef24e;box-shadow:0 0 30px 10px rgba(206,242,78,.5)"></i></div>
${nodeEls}${centre}
<p style="position:absolute;left:90px;right:90px;top:1500px;text-align:center;font:700 54px 'Space Grotesk',sans-serif;color:#cef24e;opacity:0;animation:riseIn .5s var(--out) 10.7s both">Back where it started.</p>
</div></div>
${endCard(12.0, "Bring NO-Q to your next event")}`;
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
            const files = await K.stills(browser, reel, times, REVIEW);
            console.log(files.join("\n"));
        } else {
            const t = Date.now();
            const file = await K.render(browser, reel, OUT);
            console.log("rendered", path.basename(file), `${((Date.now() - t) / 1000).toFixed(0)}s`);
        }
    }
    await browser.close();
})();
