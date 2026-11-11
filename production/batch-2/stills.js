// Batch 2 (Dec 7–30, 2026) stills: winter markets + year-end. node batch-2/stills.js [postId]
const { C, S, D, LOGO_LIGHT, iphone, duo, frame, h, sub, step, renderStills } = require("../lib/stills-kit");

// Subtle snowfall: scattered soft dots over the dark background.
const SNOW = (() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 46 }, () => {
        const s = 3 + rnd() * 7;
        return `<i style="position:absolute;left:${(rnd() * 100).toFixed(1)}%;top:${(rnd() * 100).toFixed(1)}%;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;border-radius:50%;background:#fff;opacity:${(0.08 + rnd() * 0.22).toFixed(2)};filter:blur(${(rnd() * 1.2).toFixed(1)}px)"></i>`;
    }).join("");
})();
const snow = `<div style="position:absolute;inset:0;z-index:0;pointer-events:none">${SNOW}</div>`;
const temp = (t) => `<span style="display:inline-flex;align-items:center;gap:10px;font:700 30px 'Space Grotesk',sans-serif;color:#bfe3ff;border:2px solid rgba(191,227,255,.4);border-radius:999px;padding:8px 20px">❄ ${t}</span>`;
const card = (inner, extra = "") => `<div style="background:${C.ink2};border:2px solid ${C.line};border-radius:32px;padding:36px;${extra}">${inner}</div>`;
const person = (o = 1) => `<svg width="54" height="76" viewBox="0 0 54 76" style="opacity:${o}"><circle cx="27" cy="16" r="14" fill="#3a3d35"/><path d="M4 76c0-18 10-32 23-32s23 14 23 32Z" fill="#3a3d35"/></svg>`;
const rank = (n) => `<span style="font:700 220px/0.8 'Space Grotesk',sans-serif;color:${n === 1 ? C.lime : "transparent"};-webkit-text-stroke:${n === 1 ? 0 : 3}px ${C.muted};letter-spacing:-8px">#${n}</span>`;
const verdict = (t, good) => `<span style="align-self:flex-start;font:700 30px 'Space Grotesk',sans-serif;background:${good ? C.lime : "#2a2c26"};color:${good ? C.ink : C.muted};border-radius:999px;padding:12px 24px">${t}</span>`;
const stockRow = (name, n, state) => {
    const badge = state === "sold" ? `<span style="font:700 22px Inter;background:#3a1d1d;color:#ff8a80;border-radius:999px;padding:6px 14px">Sold out</span>` : state === "low" ? `<span style="font:700 22px Inter;background:#3b3212;color:#ffd166;border-radius:999px;padding:6px 14px">Low · ${n}</span>` : "";
    const b = (t) => `<span style="width:72px;height:72px;border-radius:18px;background:#2a2c26;display:inline-flex;align-items:center;justify-content:center;font:700 40px Inter;color:${C.text}">${t}</span>`;
    return `<div style="display:flex;align-items:center;gap:20px;padding:22px 0;border-top:2px solid ${C.line}"><div style="flex:1;display:flex;flex-direction:column;gap:8px"><p style="font:600 32px Inter">${name}</p>${badge}</div>${b("−")}<span style="width:90px;text-align:center;font:700 48px 'Space Grotesk'">${n}</span>${b("+")}</div>`;
};
const wrapCard = (bg, fg, kicker, big, small, page) => `
<div class="post" style="background:${bg};color:${fg}">
  ${bg === C.ink ? snow : ""}
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 15%,rgba(255,255,255,.18),rgba(255,255,255,0) 40%)"></div>
  <header><span style="font:700 30px 'Space Grotesk',sans-serif;letter-spacing:1px">Your event, wrapped</span><span class="tag" style="border-color:currentColor;color:inherit">For organizers</span></header>
  <div class="stack" style="gap:24px;margin-top:150px">
    <p style="font:600 40px Inter,sans-serif;opacity:.8">${kicker}</p>
    <h1 style="font-size:200px;letter-spacing:-8px;line-height:.9">${big}</h1>
    <p style="font:500 44px Inter,sans-serif;line-height:1.3;max-width:860px">${small}</p>
  </div>
  <footer style="color:inherit;opacity:.75"><span>Illustrative data · no-q.ca</span><span class="pager">${page}</span></footer>
</div>`;

const posts = [
    // ---------- Week 4 · Guests: winter market season ----------
    {
        id: "w4-mon",
        slides: [
            frame({
                tag: "guests",
                glow: "50% 85%",
                body: `${snow}
<div class="stack" style="gap:18px">${h("Winter market,<br>two ways.", 96)}</div>
<div style="position:absolute;left:64px;right:64px;top:420px;height:330px;${""}">${card(`<div style="display:flex;justify-content:space-between;align-items:center"><p style="font:700 34px 'Space Grotesk';color:${C.muted}">Without NO-Q</p>${temp("−18°C")}</div>
<div style="display:flex;gap:14px;margin-top:34px">${Array.from({ length: 11 }, (_, i) => person(1 - i * 0.06)).join("")}</div>
<p style="font:600 34px Inter;color:${C.muted};margin-top:26px">25 minutes in line. Toes: gone.</p>`, "height:100%")}</div>
<div style="position:absolute;left:64px;right:64px;top:780px;height:440px">${card(`<p style="font:700 34px 'Space Grotesk';color:${C.lime}">With NO-Q</p>
<p style="font:700 54px 'Space Grotesk';line-height:1.1;margin-top:22px;max-width:520px">Order from the fire pit. Pick up when it’s ready.</p>`, `height:100%;border-color:${C.lime};background:linear-gradient(135deg,rgba(206,242,78,.14),rgba(206,242,78,0) 60%),${C.ink2}`)}</div>
${iphone(S.confirmed, { w: 340, finish: "burgundy", style: "position:absolute;right:96px;top:830px;transform:rotate(7deg);z-index:3" })}`,
            }),
        ],
    },
    {
        id: "w4-wed",
        slides: [
            frame({
                tag: "guests",
                glow: "50% 60%",
                body: `${snow}
<div class="stack" style="align-items:center;text-align:center;margin-top:30px"><p style="font:500 34px/1.45 Inter,sans-serif;max-width:760px;text-transform:lowercase">pov: it’s −22° in calgary and your hot chocolate is ready before your fingers go numb</p></div>
${iphone(S.confirmed, { w: 470, finish: "nightSky", style: "position:absolute;left:50%;bottom:-260px;transform:translateX(-50%)" })}
<span style="position:absolute;left:110px;top:560px;z-index:3;transform:rotate(-8deg);font:700 34px 'Space Grotesk';background:${C.lime};color:${C.ink};border-radius:999px;padding:14px 26px;box-shadow:0 20px 40px rgba(0,0,0,.4)">Ready ✓</span>`,
            }),
        ],
    },
    {
        id: "w4-fri",
        slides: [
            frame({
                tag: "guests",
                page: "1/5",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:110px">${h("Ranking winter market moves", 120)}${sub("From worst to best. #1 is the only one that keeps your toes.", "color:rgba(18,18,18,.75)")}<p class="swipe">Swipe →</p></div>
<span style="position:absolute;right:64px;bottom:120px;font:700 300px/0.8 'Space Grotesk';letter-spacing:-12px;color:rgba(18,18,18,.12)">4→1</span>`,
            }),
            ...[
                [4, "Holding the spot in a 30-person line at −20°.", "Frostbite. Still no food.", false],
                [3, "Sending one friend to queue while everyone else warms up.", "They will remember this.", false],
                [2, "Giving up on mini donuts because the line’s too long.", "Tragic.", false],
            ].map(([n, t, v], i) =>
                frame({
                    tag: "guests",
                    page: `${i + 2}/5`,
                    glow: "20% 80%",
                    body: `${snow}<div class="stack" style="gap:44px;margin-top:60px">${rank(n)}${h(t, 84)}${verdict(v, false)}</div>`,
                })
            ),
            frame({
                tag: "guests",
                page: "5/5",
                glow: "70% 80%",
                body: `${snow}<div class="stack" style="gap:30px;margin-top:20px;max-width:560px">${rank(1)}${h("Scan the QR, order from the fire pit, pick up when it’s ready.", 64)}${verdict("Elite.", true)}</div>
${iphone(S.menu, { w: 400, finish: "glacier", style: "position:absolute;right:56px;bottom:-200px;transform:rotate(6deg)" })}`,
            }),
        ],
    },

    // ---------- Week 5 · Vendors: holiday rush ----------
    {
        id: "w5-mon",
        slides: [
            frame({
                tag: "vendors",
                page: "1/5",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:100px">${h("Holiday rush checklist for vendors", 116)}${sub("4 things to set up before your next winter market. Save this one.", "color:rgba(18,18,18,.75)")}<p class="swipe">Swipe →</p></div>
<div style="position:absolute;left:64px;right:64px;bottom:130px;display:flex;flex-direction:column;gap:18px">${["Stock counts", "Low-stock alerts", "Table QR", "Live orders"].map((t) => `<p style="font:700 40px 'Space Grotesk';display:flex;gap:18px;align-items:center"><span style="width:44px;height:44px;border:4px solid ${C.ink};border-radius:10px"></span>${t}</p>`).join("")}</div>`,
            }),
            frame({
                tag: "vendors",
                page: "2/5",
                body: `${snow}<div class="stack" style="gap:16px">${step(1)}${h("Set stock counts for your bestsellers", 76)}${sub("Every NO-Q order counts down automatically. No overselling the last 10 patties.")}</div>
<div style="position:absolute;left:64px;right:64px;bottom:130px">${card(`<p style="font:600 24px Inter;letter-spacing:2px;text-transform:uppercase;color:${C.lime};margin-bottom:10px">Inventory</p>${stockRow("Jerk Chicken Plate", 42)}${stockRow("Beef Patty", 60)}${stockRow("Sorrel (hot)", 35)}`)}</div>`,
            }),
            frame({
                tag: "vendors",
                page: "3/5",
                body: `${snow}<div class="stack" style="gap:16px">${step(2)}${h("Turn on low-stock alerts", 76)}${sub("Guests see “Only 3 left”. At zero it flips to Sold out on its own.")}</div>
<div style="position:absolute;left:64px;right:64px;bottom:130px">${card(`${stockRow("Jerk Chicken Plate", 3, "low")}${stockRow("Beef Patty", 0, "sold")}${stockRow("Sorrel (hot)", 18)}`)}</div>`,
            }),
            frame({
                tag: "vendors",
                page: "4/5",
                glow: "50% 80%",
                body: `${snow}<div class="stack" style="gap:16px">${step(3)}${h("Print your table QR", 76)}${sub("Tape it to the counter. The line moves to people’s phones.")}</div>
${duo(D.store, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "vendors",
                page: "5/5",
                glow: "50% 80%",
                body: `${snow}<div class="stack" style="gap:16px">${step(4)}${h("Keep live orders open", 76)}${sub("Every order lands here, paid. Call the number when it’s ready.")}</div>
${duo(D.orders, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
        ],
    },
    {
        id: "w5-wed",
        slides: [
            frame({
                tag: "vendors",
                glow: "75% 70%",
                body: `${snow}<div class="stack" style="gap:20px;max-width:560px">${h("Stock that counts itself.", 100)}${sub("Each sale ticks it down. Zero means Sold out, on every guest’s phone, instantly.")}</div>
<div style="position:absolute;left:64px;bottom:150px;display:flex;flex-direction:column;gap:6px;z-index:2">
  <span style="font:700 210px/0.85 'Space Grotesk';letter-spacing:-10px;color:${C.lime}">4</span>
  <span style="font:700 40px 'Space Grotesk';color:#ffd166">left · Jerk Chicken Plate</span>
</div>
${iphone(S.product, { w: 430, finish: "deepBlack", style: "position:absolute;right:70px;bottom:-190px;transform:rotate(5deg)" })}`,
            }),
        ],
    },
    {
        id: "w5-fri",
        slides: [
            frame({
                tag: "vendors",
                glow: "50% 80%",
                body: `${snow}<div class="stack" style="gap:20px">${h("Send this to a vendor who’s still counting cash at −20°.", 74)}${sub("Card payments, live orders and payouts through Stripe. Gloves stay on.")}</div>
${duo(D.orders, { w: 960, finish: "starWhite", style: "position:absolute;left:60px;bottom:140px" })}`,
            }),
        ],
    },

    // ---------- Weeks 6–7 · Year-end ----------
    {
        id: "w6-mon",
        slides: [
            frame({
                tag: "organizers",
                page: "1/4",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:110px">${h("Planning a 2027 event? Start here.", 118)}${sub("3 steps to a line-free market, festival or night out.", "color:rgba(18,18,18,.75)")}<p class="swipe">Swipe →</p></div>
<span style="position:absolute;right:64px;bottom:110px;font:700 260px/0.8 'Space Grotesk';letter-spacing:-12px;color:rgba(18,18,18,.14)">2027</span>`,
            }),
            frame({ tag: "organizers", page: "2/4", glow: "50% 80%", body: `${snow}<div class="stack" style="gap:16px">${step(1)}${h("Create your event", 80)}${sub("Dates, venue and one QR code for the whole site.")}</div>${duo(D.eventQr, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}` }),
            frame({ tag: "organizers", page: "3/4", glow: "50% 80%", body: `${snow}<div class="stack" style="gap:16px">${step(2)}${h("Invite your vendors", 80)}${sub("They accept, build their menus and they’re live.")}</div>${duo(D.roster, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}` }),
            frame({ tag: "organizers", page: "4/4", glow: "50% 80%", body: `${snow}<div class="stack" style="gap:16px">${step(3)}${h("See every sale", 80)}${sub("Orders, peak hours and top vendors, live. Book a demo · no-q.ca")}</div>${duo(D.insights, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}` }),
        ],
    },
    {
        id: "w7-mon",
        slides: [
            `<div class="post" style="background:${C.ink};color:${C.text}">${snow}
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 60%,rgba(206,242,78,.28),rgba(206,242,78,0) 50%)"></div>
  <header><img src="${LOGO_LIGHT}" alt="NO-Q" style="height:44px"><span class="tag" style="border-color:rgba(206,242,78,.5);color:${C.lime}">For organizers</span></header>
  <div class="stack" style="gap:30px;margin-top:170px;align-items:center;text-align:center">
    <p style="font:600 40px Inter;color:${C.lime}">2026 is a wrap.</p>
    <h1 style="font-size:170px;letter-spacing:-7px;line-height:.92">Your event,<br>wrapped.</h1>
    <p style="font:500 40px Inter;color:${C.muted};max-width:760px">What one night market looks like in NO-Q’s event insights.</p>
    <p class="swipe" style="color:${C.lime}">Swipe →</p>
  </div>
  <footer style="color:${C.muted}"><span>Illustrative data · no-q.ca</span><span class="pager">1/5</span></footer>
</div>`,
            wrapCard(C.lime, C.ink, "Orders, no lines", "1,026", "orders from 18 vendors. Not one of them in a queue.", "2/5"),
            wrapCard("#bfe3ff", C.ink, "Busiest hour", "8 PM", "3,100 items in that hour alone. Plan staff and lighting around it.", "3/5"),
            wrapCard("#ff8a5c", C.ink, "Top vendor", "Island<br>Grill", "$4,820.50 across 312 orders. Give them the corner spot next year.", "4/5"),
            `<div class="post" style="background:${C.ink};color:${C.text}">${snow}
  <header><span style="font:700 30px 'Space Grotesk',sans-serif">Your event, wrapped</span><span class="tag" style="border-color:rgba(206,242,78,.5);color:${C.lime}">For organizers</span></header>
  <div class="stack" style="gap:20px">${h("Get your own recap in 2027.", 92)}${sub("Every NO-Q event comes with live insights for the organizer.")}</div>
  ${duo(D.insights, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}
  <footer style="color:${C.muted}"><span>Illustrative data · no-q.ca</span><span class="pager">5/5</span></footer>
</div>`,
        ],
    },
    {
        id: "w7-wed",
        slides: [
            frame({
                tag: "all",
                glow: "50% 70%",
                body: `${snow}<div class="stack" style="gap:18px">${h("2027 resolutions", 110)}${sub("Realistic edition.")}</div>
<div style="position:absolute;left:64px;right:64px;top:520px;display:flex;flex-direction:column;gap:34px;z-index:2">
${[
    ["Drink more water", false],
    ["Go outside more", false],
    ["Finally learn to skate", false],
    ["Never wait in a food line again", true],
]
    .map(([t, done]) => `<p style="display:flex;align-items:center;gap:28px;font:700 ${done ? 64 : 52}px/1.1 'Space Grotesk';color:${done ? C.text : C.muted}"><span style="flex:0 0 auto;width:72px;height:72px;border-radius:18px;border:5px solid ${done ? C.lime : C.line};background:${done ? C.lime : "transparent"};color:${C.ink};display:inline-flex;align-items:center;justify-content:center;font-size:48px">${done ? "✓" : ""}</span>${t}</p>`)
    .join("")}
</div>
<p class="cta" style="position:absolute;left:64px;bottom:120px;background:${C.lime};color:${C.ink}">Find NO-Q at events · no-q.ca</p>`,
            }),
        ],
    },
];


renderStills(posts, 2);
