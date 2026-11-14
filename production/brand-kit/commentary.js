// NO-Q commentary cards: 4:5 (1080x1350, exported 2160x2700) text-led cards for takes, quotes,
// myth vs fact, comment replies, hot takes and questions. They work on Instagram, LinkedIn and Facebook.
// Edit CARDS below (or copy a card and change its text), then from production/:
//   node brand-kit/commentary.js          all cards
//   node brand-kit/commentary.js take-1   one card
// Output: site/kit/commentary/<id>.png
// Rules: claims must match docs/brand.md "Verified product facts"; no invented stats; quotes are
// attributed to the NO-Q team unless a real person has approved their words.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { C, LOGO_LIGHT, LOGO_TILE } = require("../lib/stills-kit");

const OUT = path.join(__dirname, "..", "..", "site", "kit", "commentary");

// The logo's chevron pair, reused as a quote mark and bullet.
const chevrons = (w, a = C.lime, b = C.lime2) =>
    `<svg width="${w}" height="${(w * 21.5) / 21.2}" viewBox="0 0 21.2 21.5" aria-hidden="true"><path d="M6.5 10.2L0 0h4.6l6.5 10.2L4.6 21.5H0z" fill="${a}"/><path d="M16.6 10.2L10.1 0h4.6l6.5 10.2-6.5 11.3h-4.6z" fill="${b}"/></svg>`;

const shell = ({ body, label, lime = false, foot = "no-q.ca" }) => `
<div class="card ${lime ? "lime" : "dark"}">
  <header>
    <img src="${lime ? LOGO_TILE : LOGO_LIGHT}" alt="NO-Q" class="${lime ? "tile" : "word"}">
    ${label ? `<span class="label">${label}</span>` : ""}
  </header>
  <main>${body}</main>
  <footer><span>${foot}</span></footer>
</div>`;

// ---------- card types ----------
const T = {
    // "They say X. Our take: Y." The struck line is the common belief; the headline is NO-Q's view.
    take: ({ said, take, body }) =>
        shell({
            label: "Our take",
            body: `
      <p class="said"><s>${said}</s></p>
      <h1 class="big">${take}</h1>
      ${body ? `<p class="body">${body}</p>` : ""}`,
        }),
    // Pull quote on lime.
    quote: ({ quote, by, role }) =>
        shell({
            lime: true,
            label: "Worth saying",
            body: `
      <div class="qmark">${chevrons(120, C.ink, C.ink)}</div>
      <h1 class="quote">${quote}</h1>
      <p class="by"><b>${by}</b>${role ? `<span>${role}</span>` : ""}</p>`,
        }),
    myth: ({ myth, fact }) =>
        shell({
            label: "Myth vs fact",
            body: `
      <div class="mf myth"><span class="k">Myth</span><p>${myth}</p></div>
      <div class="mf fact"><span class="k">Fact</span><p>${fact}</p></div>`,
        }),
    // Answering a real question from the comments. Don't show a real person's handle without permission.
    reply: ({ asker, comment, answer, more }) =>
        shell({
            label: "From the comments",
            body: `
      <div class="comment">
        <span class="avatar">${asker.slice(0, 1).toUpperCase()}</span>
        <div><b>${asker}</b><p>${comment}</p></div>
      </div>
      <div class="answer">
        <span class="avatar me">${chevrons(34, C.ink, C.ink)}</span>
        <div><b>NO-Q</b><h1>${answer}</h1>${more ? `<p>${more}</p>` : ""}</div>
      </div>`,
        }),
    hot: ({ take, kicker }) =>
        shell({
            lime: true,
            label: "Hot take",
            body: `
      <p class="kicker">${kicker || "Unpopular opinion:"}</p>
      <h1 class="big">${take}</h1>`,
            foot: "Agree? Tell us below. · no-q.ca",
        }),
    question: ({ q, options }) =>
        shell({
            label: "Settle this",
            body: `
      <h1 class="big">${q}</h1>
      <ol class="opts">${options.map((o, i) => `<li><span>${String.fromCharCode(65 + i)}</span>${o}</li>`).join("")}</ol>`,
            foot: "Answer in the comments · no-q.ca",
        }),
};

// ---------- the cards ----------
const CARDS = [
    {
        id: "take-1",
        type: "take",
        said: "“A long line means your event is popular.”",
        take: "A long line means people are <em>waiting</em> instead of eating.",
        body: "Popular is a full field. Let guests order from their table, and the line takes care of itself.",
    },
    {
        id: "take-2",
        type: "take",
        said: "“Mobile ordering is only for big festivals.”",
        take: "If you have <em>one</em> line, you have a line problem.",
        body: "A single vendor can print a storefront QR and take orders from phones tonight.",
    },
    {
        id: "quote-1",
        type: "quote",
        quote: "Nobody goes to a night market to stand in line. They go for the food, the music and the people.",
        by: "The NO-Q team",
        role: "Calgary",
    },
    {
        id: "myth-1",
        type: "myth",
        myth: "Guests won’t order from their phones if they have to download an app first.",
        fact: "They don’t have to. NO-Q runs in the phone’s browser: scan the QR, order, pay by card.",
    },
    {
        id: "myth-2",
        type: "myth",
        myth: "Selling out is a surprise you find out about at the window.",
        fact: "Vendors set a stock count. Guests see “Only 4 left”, then “Sold out”, before they pay.",
    },
    {
        id: "reply-1",
        type: "reply",
        asker: "A guest asked",
        comment: "Do I need to download an app for this?",
        answer: "Nope. Point your camera at the QR code.",
        more: "The menu opens in your browser. Order, pay by card, and we’ll tell you when it’s ready.",
    },
    {
        id: "hot-1",
        type: "hot",
        take: "The best festival food is the one you didn’t queue 40 minutes for.",
    },
    {
        id: "question-1",
        type: "question",
        q: "What makes you skip a food truck at a festival?",
        options: ["The line", "Cash only", "No menu up front", "It sold out"],
    },
];

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#000}
.card{position:relative;width:1080px;height:1350px;overflow:hidden;font-family:Inter,Arial,sans-serif;padding:64px;display:flex;flex-direction:column}
.dark{background:radial-gradient(circle at 85% 12%,rgba(206,242,78,.14),rgba(206,242,78,0) 42%),${C.ink};color:${C.text}}
.lime{background:${C.lime};color:${C.ink}}
header{display:flex;justify-content:space-between;align-items:center;height:64px}
.word{height:44px}.tile{height:64px;border-radius:12px}
.label{font:600 22px Inter,sans-serif;letter-spacing:2px;text-transform:uppercase;border:2px solid;border-radius:999px;padding:10px 20px}
.dark .label{border-color:rgba(206,242,78,.5);color:${C.lime}}
.lime .label{border-color:rgba(18,18,18,.35)}
main{flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:30px}
footer{display:flex;justify-content:space-between;align-items:center;font:600 24px Inter,sans-serif}
.dark footer{color:${C.muted}}.lime footer{color:rgba(18,18,18,.7)}
.dots{display:flex;gap:8px}.dots i{width:10px;height:10px;border-radius:50%;background:currentColor;opacity:.35}.dots i:first-child{opacity:1;background:${C.lime}}
.lime .dots i:first-child{background:${C.ink}}
h1{font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;letter-spacing:-2.5px;line-height:1.02;text-wrap:balance}
h1 em{font-style:normal;color:${C.lime}}
.lime h1 em{color:${C.ink};text-decoration:underline;text-decoration-thickness:8px;text-underline-offset:10px}
.big{font-size:96px}
.said{font:500 40px/1.3 Inter,sans-serif;color:${C.muted};margin-bottom:44px}
.said s{text-decoration-color:${C.lime};text-decoration-thickness:4px}
.body{font-size:34px;line-height:1.4;opacity:.82;margin-top:44px;max-width:880px}
.qmark{margin-bottom:40px}
.quote{font-size:76px;letter-spacing:-2px;line-height:1.06}
.by{margin-top:56px;font-size:30px;display:flex;flex-direction:column;gap:4px}
.by span{opacity:.7;font-size:26px}
.mf{border-radius:32px;padding:44px 48px;position:relative}
.mf .k{display:inline-block;font:700 22px Inter,sans-serif;letter-spacing:2px;text-transform:uppercase;border-radius:999px;padding:8px 18px;margin-bottom:22px}
.mf p{font:700 52px/1.1 'Space Grotesk',sans-serif;letter-spacing:-1.2px;text-wrap:balance}
.myth{background:${C.ink2};border:2px solid ${C.line};margin-bottom:28px}
.myth .k{background:${C.soldOutBg};color:${C.soldOut}}
.myth p{color:${C.muted};text-decoration:line-through;text-decoration-color:${C.soldOut};text-decoration-thickness:3px}
.fact{background:${C.lime};color:${C.ink}}
.fact .k{background:${C.ink};color:${C.lime}}
.comment,.answer{display:flex;gap:26px;align-items:flex-start}
.comment{background:${C.ink2};border:2px solid ${C.line};border-radius:32px;padding:36px 40px;margin-bottom:28px;margin-right:90px}
.comment b,.answer b{display:block;font:600 24px Inter,sans-serif;margin-bottom:8px;color:${C.muted}}
.comment p{font:500 44px/1.2 Inter,sans-serif;letter-spacing:-.5px}
.answer{padding:36px 40px;margin-left:90px;border-radius:32px;background:rgba(206,242,78,.08);border:2px solid rgba(206,242,78,.35)}
.answer b{color:${C.lime}}
.answer h1{font-size:64px;letter-spacing:-1.8px}
.answer p{font-size:30px;line-height:1.4;opacity:.82;margin-top:20px}
.avatar{flex:none;width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${C.line};color:${C.text};font:700 32px 'Space Grotesk',sans-serif}
.avatar.me{background:${C.lime}}
.kicker{font:700 34px 'Space Grotesk',sans-serif;margin-bottom:32px;opacity:.75}
.opts{list-style:none;margin-top:56px;display:grid;gap:18px}
.opts li{display:flex;align-items:center;gap:24px;background:${C.ink2};border:2px solid ${C.line};border-radius:999px;padding:18px 28px;font:600 36px Inter,sans-serif}
.opts span{width:52px;height:52px;border-radius:50%;background:${C.lime};color:${C.ink};display:flex;align-items:center;justify-content:center;font:700 26px 'Space Grotesk',sans-serif}
`;

(async () => {
    const only = process.argv[2];
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
    for (const card of CARDS.filter((c) => !only || c.id === only)) {
        await page.setContent(
            `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap"><style>${CSS}</style></head><body>${T[card.type](card)}</body></html>`,
            { waitUntil: "networkidle" }
        );
        await page.evaluate(() => document.fonts.ready);
        // Fail loudly if text spills out of the card.
        const over = await page.evaluate(() => {
            const m = document.querySelector("main");
            return m.scrollHeight > m.clientHeight + 2;
        });
        if (over) console.warn("WARNING: text overflows in", card.id);
        await page.locator(".card").screenshot({ path: path.join(OUT, `${card.id}.png`) });
        console.log("saved", card.id);
    }
    await browser.close();
})();

