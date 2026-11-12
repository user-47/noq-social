// Special events batch: Christmas 2026 → Remembrance Day 2027 (Canadian federal/statutory holidays, Alberta holidays,
// and a few big seasonal moments). Single source of truth for content: renders stills + Reels into
// site/batches/special-2026-27/ and writes data/special-2026-27.json for build.mjs.
//   node special/holidays.js data            -> data/special-2026-27.json
//   node special/holidays.js stills [id]     -> 4:5 stills
//   node special/holidays.js reels [id]      -> Reels with original soundtracks
//   node special/holidays.js review <id> t1,t2,...  -> Reel review frames in out/review/
// Solemn days (Remembrance Day, National Day for Truth and Reconciliation) are still-only: no Reel, no music,
// no call to action, no NO-Q hashtags. No poppy (Royal Canadian Legion trademark) and no "Every Child Matters"
// slogan (Orange Shirt Society); see docs/strategy.md › Special events.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const SK = require("../lib/stills-kit");
const RK = require("../lib/reel-kit");

const FOLDER = "special-2026-27";
const ROOT = path.join(__dirname, "..", "..");
const SITE_DIR = path.join(ROOT, "site", "batches", FOLDER);
const LIME = "#cef24e";

// ---------- content ----------
const ORIGINAL = "Original soundtrack: keep the Reel's audio";
const posts = [
    // Winter 2026–27
    { id: "hol-christmas-2026", season: 0, occasion: "Christmas Day", day: "Fri", date: "Dec 25", iso: "2026-12-25", time: "10:00 AM", audience: "Everyone",
      tag: "Merry Christmas", accent: "#ff6b6b", motif: { kind: "snow", lights: true },
      headline: "Merry Christmas / from *NO-Q.*", sub: "Thank you to every vendor who served in the cold, every organizer who built a winter market, and every guest who ordered from the fire pit.",
      cta: "See you at the next event", chords: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]],
      caption: "Merry Christmas from all of us at NO-Q 🎄\n\nTo every vendor who served in the cold, every organizer who built a winter market, and every guest who ordered from the fire pit instead of the line: thank you.\n\nSee you at the next event.",
      tags: "#MerryChristmas #YYC #Calgary #ShopLocal" },
    { id: "hol-new-year-2027", season: 0, occasion: "New Year's Day", day: "Fri", date: "Jan 1", iso: "2027-01-01", time: "11:00 AM", audience: "Everyone",
      tag: "Happy New Year", accent: "#ffd166", motif: { kind: "fireworks", colors: [LIME, "#ffd166", "#ffffff"] },
      headline: "Happy *2027.*", sub: "More festivals, markets and game days. A lot less time in line.",
      cta: "Planning an event this year? Let’s talk",
      caption: "Happy New Year from NO-Q 🎆\n\nHere’s to 2027: more festivals, markets and game days, and a lot less time in line.\n\nPlanning an event this year? Let’s talk: no-q.ca",
      tags: "#HappyNewYear #2027 #YYC #EventPlanning" },
    { id: "hol-family-day-2027", season: 0, occasion: "Family Day (Alberta), Mon Feb 15", day: "Fri", date: "Feb 12", iso: "2027-02-12", time: "12:00 PM", audience: "Guests",
      tag: "Family Day weekend", accent: "#7bdff2", motif: { kind: "emoji", chars: ["❄️", "💛", "⛸️"], dir: "fall" }, device: { kind: "iphone", screen: "event" },
      headline: "Family Day: / snacks without / the *meltdown.*", sub: "See a NO-Q code? Order from your table and pick up when it’s ready.",
      cta: "Happy Family Day, Alberta",
      caption: "Family Day weekend is here 👨‍👩‍👧‍👦\n\nHeading to a market or event with the kids? If you see a NO-Q code, order from your table and pick up when it’s ready. Fewer minutes in line, fewer meltdowns (yours included).\n\nHappy Family Day, Alberta!",
      tags: "#FamilyDay #FamilyDayAB #YYC #Calgary" },
    // Spring 2027
    { id: "hol-easter-2027", season: 1, occasion: "Easter long weekend (Good Friday Mar 26)", day: "Fri", date: "Mar 26", iso: "2027-03-26", time: "10:00 AM", audience: "Everyone",
      tag: "Easter long weekend", accent: "#ffb3c6", motif: { kind: "emoji", chars: ["🌷", "🐣", "🌼"], dir: "fall" },
      headline: "Happy Easter / *long* *weekend.*", sub: "Spring markets are around the corner in Calgary. So is the sunshine (eventually).",
      cta: "Vendors: get your menu ready for the season",
      caption: "Happy Easter long weekend from NO-Q 🐣\n\nSpring markets are around the corner in Calgary, and so is the sunshine (eventually). Vendors: it’s a good weekend to get your menu ready for the season.\n\nno-q.ca",
      tags: "#EasterLongWeekend #Spring #YYC #Calgary" },
    { id: "hol-victoria-day-2027", season: 1, occasion: "Victoria Day, Mon May 24", day: "Fri", date: "May 21", iso: "2027-05-21", time: "12:00 PM", audience: "Vendors",
      tag: "May long weekend", accent: "#ffd166", motif: { kind: "rays" }, device: { kind: "duo", screen: "store" },
      headline: "May long weekend / = *market* *season.*", sub: "Vendors: menu, stock counts and your storefront QR. Get set before the crowds.",
      cta: "New to NO-Q? Create a vendor account",
      caption: "May long weekend means one thing in Calgary: market season is open 🌤️\n\nVendors, get set before the crowds:\n✅ Menu and photos up to date\n✅ Stock counts set for your bestsellers\n✅ Storefront QR printed for the table\n\nNew to NO-Q? Create a vendor account at no-q.ca\n\nHappy Victoria Day!",
      tags: "#VictoriaDay #MayLongWeekend #FoodVendor #YYC" },
    // Summer 2027
    { id: "hol-canada-day-prep-2027", season: 2, occasion: "Canada Day lead-up (Jul 1)", day: "Tue", date: "Jun 15", iso: "2027-06-15", time: "12:00 PM", audience: "Organizers",
      tag: "Canada Day is coming", accent: "#ff5a5f", motif: { kind: "emoji", chars: ["🍁"], dir: "fall" }, device: { kind: "duo", screen: "eventQr" },
      headline: "Canada Day crowds / are *coming.*", sub: "Organizers: one QR code on the grounds, every vendor on every guest’s phone.",
      cta: "Planning a July 1 event? Book a demo",
      caption: "Canada Day crowds are coming 🇨🇦\n\nOrganizers: put one NO-Q code on the grounds and guests can order from every vendor at your event without the lineups.\n\nPlanning a July 1 event? Book a demo: no-q.ca",
      tags: "#CanadaDay #EventPlanning #EventOrganizer #YYC" },
    { id: "hol-canada-day-2027", season: 2, occasion: "Canada Day", day: "Thu", date: "Jul 1", iso: "2027-07-01", time: "9:00 AM", audience: "Everyone",
      tag: "Happy Canada Day", accent: "#ff5a5f", motif: { kind: "fireworks", colors: ["#ff5a5f", "#ffffff", "#ff8a80"], leaves: true },
      headline: "Happy / *Canada* *Day.*", sub: "Enjoy the fireworks, not the line. 🍁",
      cta: "Happy Canada Day from NO-Q",
      caption: "Happy Canada Day from NO-Q 🍁\n\nWherever you’re celebrating today, we hope you spend it with your people, on the grass, watching the fireworks. Not in a line.",
      tags: "#CanadaDay #HappyCanadaDay #YYC #Calgary" },
    { id: "hol-heritage-day-2027", season: 2, occasion: "Heritage Day (Alberta), Mon Aug 2", day: "Fri", date: "Jul 30", iso: "2027-07-30", time: "12:00 PM", audience: "Guests",
      tag: "Heritage Day weekend", accent: "#ffb347", motif: { kind: "emoji", chars: ["🍛", "🍢", "🍗", "🍩", "🌍"], dir: "rise" }, device: { kind: "iphone", screen: "event" },
      headline: "Heritage Day weekend: / food from *everywhere.*", sub: "Jollof, suya, jerk chicken, puff-puff. One QR code, every vendor’s menu.",
      cta: "Happy Heritage Day, Alberta",
      caption: "Alberta’s Heritage Day long weekend celebrates the cultures that make this province home, and a lot of that happens through food 🌍\n\nJollof, suya, jerk chicken, puff-puff: at events running NO-Q, one QR code opens every vendor’s menu. Try something new without losing your spot.\n\nHappy Heritage Day!",
      tags: "#HeritageDay #Alberta #YYC #FoodFestival" },
    // Fall 2027
    { id: "hol-labour-day-2027", season: 3, occasion: "Labour Day", day: "Mon", date: "Sep 6", iso: "2027-09-06", time: "10:00 AM", audience: "Everyone",
      tag: "Happy Labour Day", accent: LIME, motif: { kind: "emoji", chars: ["🍳", "🛠️", "🎪", "🧑‍🍳"], dir: "rise" },
      headline: "Happy / *Labour* *Day.*", sub: "To the cooks, vendors, crews, volunteers and organizers who make every event happen. Thank you.",
      cta: "Today’s for you",
      caption: "Happy Labour Day 🛠️\n\nEvery event runs on people: the cooks at the grill, the vendors who set up at dawn, the crews, the volunteers and the organizers who pull it all together. Today’s for you. Thank you.",
      tags: "#LabourDay #LongWeekend #YYC" },
    { id: "hol-truth-reconciliation-2027", season: 3, occasion: "National Day for Truth and Reconciliation", day: "Thu", date: "Sep 30", iso: "2027-09-30", time: "9:00 AM", audience: "Everyone",
      solemn: { accent: "#ff8c42", kicker: "September 30", title: "National Day for Truth and Reconciliation", body: "Today we honour the children who never returned home from residential schools, the Survivors, and their families and communities." },
      caption: "Today is the National Day for Truth and Reconciliation.\n\nWe honour the children who never returned home from residential schools, the Survivors, and their families and communities. We encourage everyone to take time today to listen and learn.\n\nNational Centre for Truth and Reconciliation: nctr.ca",
      tags: "#NDTR #TruthAndReconciliation", no_base_tags: true },
    { id: "hol-thanksgiving-2027", season: 3, occasion: "Thanksgiving", day: "Mon", date: "Oct 11", iso: "2027-10-11", time: "10:00 AM", audience: "Everyone",
      tag: "Happy Thanksgiving", accent: "#ff9f43", motif: { kind: "emoji", chars: ["🍂", "🍁"], dir: "fall" },
      headline: "Happy / *Thanksgiving.*", sub: "Thankful for every vendor, organizer and guest who skipped a line with us this year.",
      cta: "Enjoy the long weekend (and the leftovers)",
      caption: "Happy Thanksgiving from NO-Q 🍂\n\nThis year we’re thankful for every vendor who trusted us with their orders, every organizer who brought us onto their grounds, and every guest who skipped a line with us. Enjoy the long weekend (and the leftovers).",
      tags: "#HappyThanksgiving #Thanksgiving #YYC #Calgary" },
    { id: "hol-halloween-2027", season: 3, occasion: "Halloween (Sun Oct 31)", day: "Fri", date: "Oct 29", iso: "2027-10-29", time: "12:00 PM", audience: "Guests",
      tag: "Spooky season", accent: "#ff9f43", motif: { kind: "emoji", chars: ["🎃", "👻", "🦇"], dir: "rise" }, device: { kind: "iphone", screen: "menu" },
      headline: "The scariest thing / at a festival? / *The* *line.*", sub: "Look for the NO-Q code. Order from your phone, pick up when it’s ready.",
      cta: "No app. No ghosting your friends",
      caption: "The scariest thing at any festival isn’t the haunted house. It’s the food line 👻\n\nHeading to a Halloween event this weekend? Look for the NO-Q code, order from your phone, and pick up when it’s ready. No app. No ghosting your friends for 40 minutes.\n\n🎃 no-q.ca",
      tags: "#Halloween #SpookySeason #YYC #Calgary" },
    { id: "hol-remembrance-day-2027", season: 3, occasion: "Remembrance Day", day: "Thu", date: "Nov 11", iso: "2027-11-11", time: "9:00 AM", audience: "Everyone",
      solemn: { accent: "#d9d9d6", kicker: "November 11", title: "Lest we forget.", body: "Today we remember those who served, and those who gave their lives in service to Canada." },
      caption: "Today we remember those who served, and those who gave their lives in service to Canada.\n\nLest we forget.",
      tags: "#RemembranceDay", no_base_tags: true },
];
const SEASONS = [
    { title: "Winter 2026–27", sub: "Christmas, New Year’s Day and Alberta’s Family Day." },
    { title: "Spring 2027", sub: "Easter long weekend and Victoria Day: market season opens." },
    { title: "Summer 2027", sub: "Canada Day and Alberta’s Heritage Day." },
    { title: "Fall 2027", sub: "Labour Day, Truth and Reconciliation, Thanksgiving, Halloween and Remembrance Day." },
];

// ---------- motifs ----------
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483647, 7);
function motif(p, { animated, w, h, dur = 10 }) {
    const m = p.motif, r = rng(hash(p.id));
    let html = "";
    if (m.kind === "snow" || m.kind === "emoji") {
        const n = m.kind === "snow" ? 50 : animated ? 18 : 12;
        for (let i = 0; i < n; i++) {
            const x = r() * 100, s = m.kind === "snow" ? 4 + r() * 9 : 46 + r() * 40, d = 6 + r() * 6, y = m.kind === "snow" ? r() * h : h * (0.5 + r() * 0.45);
            const body = m.kind === "snow" ? `<i style="display:block;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;border-radius:50%;background:#fff;opacity:${(0.15 + r() * 0.35).toFixed(2)}"></i>`
                : `<span style="font-size:${s.toFixed(0)}px;opacity:${(0.22 + r() * 0.25).toFixed(2)};display:block;transform:rotate(${Math.round(r() * 60 - 30)}deg)">${m.chars[i % m.chars.length]}</span>`;
            const rise = m.dir === "rise";
            html += animated
                ? `<div style="position:absolute;left:${x.toFixed(1)}%;top:${rise ? h + 60 : -80}px;animation:${rise ? "floatUp" : "fallDown"} ${d.toFixed(1)}s linear -${(r() * d).toFixed(1)}s infinite;--x:${Math.round(r() * 120 - 60)}px;--h:${h + 160}px">${body}</div>`
                : `<div style="position:absolute;left:${x.toFixed(1)}%;top:${y.toFixed(0)}px">${body}</div>`;
        }
    }
    if (m.kind === "fireworks") {
        const bursts = [[0.25, 0.3, 0.6], [0.75, 0.22, 1.6], [0.5, 0.42, 2.8], [0.2, 0.55, 4.2], [0.8, 0.5, 5.4]];
        bursts.forEach(([bx, by0, t], k) => {
            let by = by0;
            const col = m.colors[k % m.colors.length], size = 260 + k * 30;
            const rays = Array.from({ length: 14 }, (_, j) => `<i style="position:absolute;left:50%;top:50%;width:6px;height:${size / 2}px;margin-left:-3px;background:linear-gradient(${col},transparent);border-radius:3px;transform-origin:top;transform:rotate(${(j * 360) / 14}deg)"></i>`).join("");
            const anim = animated ? `animation:burst 1.6s var(--out) ${t}s both` : "opacity:.6";
            if (!animated) by = Math.min(0.85, by + 0.35);
            html += `<div style="position:absolute;left:${bx * w - size / 2}px;top:${by * h - size / 2}px;width:${size}px;height:${size}px;${anim}">${rays}</div>`;
        });
        if (m.leaves) html += motif({ ...p, motif: { kind: "emoji", chars: ["🍁"], dir: "fall" } }, { animated, w, h, dur });
    }
    if (m.kind === "rays") {
        html += `<div style="position:absolute;left:${w / 2 - 900}px;top:${-900}px;width:1800px;height:1800px;border-radius:50%;background:repeating-conic-gradient(rgba(255,209,102,.10) 0 8deg,transparent 8deg 18deg);${animated ? `animation:spin ${dur * 3}s linear 0s both` : ""}"></div>
<div style="position:absolute;left:${w / 2 - 160}px;top:-160px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,#ffd166,rgba(255,209,102,0) 70%)"></div>`;
    }
    if (m.lights) {
        const cols = ["#ff6b6b", LIME, "#ffd166", "#7bdff2"];
        html += `<svg width="${w}" height="160" style="position:absolute;left:0;top:90px"><path d="M0 40 Q ${w / 4} 120 ${w / 2} 50 T ${w} 60" stroke="#3a3d35" stroke-width="3" fill="none"/></svg>`;
        for (let i = 0; i < 12; i++) {
            const x = (i + 0.5) * (w / 12), y = 40 + Math.sin(((i + 0.5) / 12) * Math.PI * 2) * 30 + 30, c = cols[i % cols.length];
            html += `<i style="position:absolute;left:${x - 12}px;top:${y + 90}px;width:24px;height:34px;border-radius:50%;background:${c};box-shadow:0 0 24px 6px ${c}66;${animated ? `animation:twinkle 1s ease ${(i % 4) * 0.25}s infinite alternate` : ""}"></i>`;
        }
    }
    return `<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none">${html}</div>`;
}
const MOTIF_CSS = `
@keyframes fallDown{from{transform:translate(0,0)}to{transform:translate(var(--x),var(--h))}}
@keyframes floatUp{from{transform:translate(0,0)}to{transform:translate(var(--x),calc(var(--h) * -1))}}
@keyframes burst{0%{opacity:0;transform:scale(.1)}15%{opacity:1}70%{opacity:.8}100%{opacity:0;transform:scale(1)}}
@keyframes twinkle{from{opacity:.45}to{opacity:1}}`;

const glow = (accent) => `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 35%,${accent}2e,${accent}00 55%)"></div>`;

// ---------- stills ----------
function still(p) {
    const { C, S, D, LOGO_LIGHT, iphone, duo } = SK;
    if (p.solemn) {
        const s = p.solemn;
        return `<div class="post" style="background:#0d0d0d;color:#f2f4ec;display:flex;flex-direction:column;justify-content:center;padding:0 110px">
  <i style="display:block;width:90px;height:8px;border-radius:4px;background:${s.accent};margin-bottom:48px"></i>
  <p style="font:600 28px Inter,sans-serif;letter-spacing:6px;text-transform:uppercase;color:#a9ad9f">${s.kicker}</p>
  <h1 style="font-size:${s.title.length > 20 ? 78 : 120}px;margin-top:22px;color:#f2f4ec">${s.title}</h1>
  <p style="font:400 40px/1.5 Inter,sans-serif;color:#c9ccc0;margin-top:40px;max-width:820px">${s.body}</p>
  <img src="${LOGO_LIGHT}" alt="NO-Q" style="position:absolute;left:110px;bottom:70px;height:34px;opacity:.55">
</div>`;
    }
    const head = p.headline.replace(/\*([^*]+)\*/g, `<span style="color:${LIME}">$1</span>`).replace(/ \/ /g, "<br>");
    const dev = !p.device ? "" : p.device.kind === "iphone"
        ? iphone(S[p.device.screen], { w: 360, finish: "glacier", style: "position:absolute;right:70px;bottom:-220px;transform:rotate(6deg);z-index:2" })
        : duo(D[p.device.screen], { w: 820, style: "position:absolute;left:130px;bottom:80px;z-index:2" });
    const top = p.device?.kind === "duo" ? 140 : p.device ? 200 : 320;
    return `<div class="post" style="background:${C.ink};color:${C.text}">
  ${glow(p.accent)}${motif(p, { animated: false, w: 1080, h: 1350 })}
  <header><img src="${LOGO_LIGHT}" alt="NO-Q" style="height:44px"><span class="tag" style="border-color:${p.accent}99;color:${p.accent}">${p.tag}</span></header>
  <div class="stack" style="gap:24px;margin-top:${top - 180}px;${p.device?.kind === "iphone" ? "max-width:640px" : ""}">
    <h1 style="font-size:${p.headline.length > 45 ? 78 : 112}px">${head}</h1>
    <p class="sub" style="max-width:${p.device?.kind === "iphone" ? 600 : 860}px">${p.sub}</p>
  </div>
  ${dev}
  <footer style="color:${C.muted}"><span>no-q.ca</span></footer>
</div>`;
}

// ---------- Reels ----------
function reel(p) {
    const { S, D, iphone, duo, words, anim, endCard } = RK;
    const dur = 10, endAt = 7.5;
    const big = p.headline.length > 45 ? 92 : p.device ? 108 : 130;
    const dev = !p.device ? "" : p.device.kind === "iphone"
        ? `<div style="position:absolute;left:300px;top:${big > 100 ? 980 : 1040}px;--r0:10deg;--r1:3deg;${anim("phoneUp", 1.0, 1.4, "var(--spring)")}">${iphone(S[p.device.screen], { w: 480, finish: "glacier" })}</div>`
        : `<div style="position:absolute;left:70px;top:1180px">${duo({ img: D[p.device.screen], w: 940, t: 1.9, dur: 1.0 })}</div>`;
    const body = `${glow(p.accent)}${motif(p, { animated: true, w: 1080, h: 1920, dur })}
<div style="position:absolute;inset:0;animation:out .5s var(--in) ${endAt - 0.5}s forwards">
  <span style="position:absolute;left:90px;top:260px;font:700 30px Inter,sans-serif;letter-spacing:4px;text-transform:uppercase;color:${p.accent};border:2px solid ${p.accent}99;border-radius:999px;padding:10px 24px;${anim("fadeIn", 0.4, 0.1)}">${p.tag}</span>
  <div style="position:absolute;left:90px;right:90px;top:360px;display:flex;flex-direction:column;gap:34px">
    <h1 class="h" style="font-size:${big}px;letter-spacing:-3px">${words(p.headline, 0.3, { stagger: 0.07, dur: 0.6 })}</h1>
    <p class="sub" style="font-size:44px;${anim("riseIn", 0.6, 2.0)}">${p.sub}</p>
  </div>
  ${dev}
</div>
${endCard(endAt, p.cta)}`;
    const bursts = p.motif.kind === "fireworks" ? [0.6, 1.6, 2.8, 4.2, 5.4].map((t) => ({ t, kind: "impact", gain: 0.25 })) : [];
    return {
        id: p.id, dur, poster: 3.6, css: MOTIF_CSS, body,
        score: {
            bpm: 120, chords: p.chords, drop: 2.0, arpFrom: 4.0, end: endAt,
            sfx: [{ t: 0.3, kind: "note", note: 76, len: 0.8 }, { t: 2.0, kind: "impact", gain: 0.5 }, ...bursts, ...(p.device ? [{ t: 1.4, kind: "whoosh" }] : []), { t: endAt, kind: "whoosh" }],
        },
    };
}

// ---------- data for build.mjs ----------
function data() {
    const altFor = (p) => p.solemn
        ? `${p.solemn.kicker}. “${p.solemn.title}” ${p.solemn.body} Small NO-Q logo at the bottom.`
        : `${p.tag}: “${p.headline.replace(/[*/]/g, "").replace(/\s+/g, " ").trim()}” ${p.sub}${p.device ? ` A phone shows NO-Q’s ${p.device.screen === "event" ? "event vendor list" : p.device.screen === "menu" ? "vendor menu" : p.device.screen === "store" ? "vendor storefront with its QR code" : "event page with its QR code"}.` : ""}`;
    return {
        batch: "special", kind: "special", folder: FOLDER,
        title: "Special events · Holidays 2026–27",
        dates: "Dec 25, 2026 – Nov 11, 2027",
        status: "rolling",
        summary: "A year of holiday posts: Christmas, New Year’s Day, Alberta’s Family Day and Heritage Day, Easter, Victoria Day, Canada Day, Labour Day, the National Day for Truth and Reconciliation, Thanksgiving, Halloween and Remembrance Day. Schedule each post when its 30-day window opens (Schedule from).",
        base_tags: "#NOQ #SkipTheLine #EventTech",
        notes: [
            "Remembrance Day and the National Day for Truth and Reconciliation are still-only: no Reel, no music, no NO-Q hashtags. Post the image as is and keep comments respectful.",
            "Holiday dates are for Canada (federal) plus Alberta’s Family Day and Heritage Day. Long-weekend posts go out on the Friday before.",
            "The Victoria Day post mentions stock counts. Confirm inventory is live for vendors by then.",
        ],
        weeks: SEASONS.map((s, k) => ({
            title: s.title, sub: s.sub,
            posts: posts.filter((p) => p.season === k).map((p) => ({
                id: p.id, day: p.day, date: p.date, iso: p.iso, time: p.time, audience: p.audience,
                format: p.solemn ? "Single image (no Reel)" : "Reel + single image", slides: 1, reel: p.solemn ? 0 : 10,
                occasion: p.occasion, trend: `Holiday: ${p.occasion}`, sound: p.solemn ? "No sound" : ORIGINAL,
                caption: p.caption, tags: p.tags, no_base_tags: !!p.no_base_tags, alt: [altFor(p)],
            })),
        })),
    };
}

(async () => {
    const [cmd, arg, times] = process.argv.slice(2);
    if (cmd === "data") {
        fs.writeFileSync(path.join(ROOT, "data", `${FOLDER}.json`), JSON.stringify(data(), null, 2) + "\n");
        console.log(`data/${FOLDER}.json: ${posts.length} posts`);
        return;
    }
    if (cmd === "stills") {
        await SK.renderStills(posts.map((p) => ({ id: p.id, slides: [still(p)] })).map((x) => ({ ...x, slides: x.slides.map((h) => h.replace("<div class=\"post\"", `<style>${MOTIF_CSS}</style><div class="post"`)) })), FOLDER, arg ?? "");
        return;
    }
    const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
    if (cmd === "reels") {
        const out = path.join(SITE_DIR, "reels");
        fs.mkdirSync(out, { recursive: true });
        for (const p of posts.filter((p) => !p.solemn && (!arg || p.id === arg))) {
            const t = Date.now();
            await RK.render(browser, reel(p), out);
            console.log("rendered", p.id, `${((Date.now() - t) / 1000).toFixed(0)}s`);
        }
    } else if (cmd === "review") {
        const dir = path.join(__dirname, "..", "out", "review");
        fs.mkdirSync(dir, { recursive: true });
        console.log((await RK.stills(browser, reel(posts.find((p) => p.id === arg)), times.split(",").map(Number), dir)).join("\n"));
    } else {
        console.log("usage: node special/holidays.js data | stills [id] | reels [id] | review <id> t1,t2");
    }
    await browser.close();
})();
