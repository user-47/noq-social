// Batch 1 (Nov 16 – Dec 4, 2026) stills. node batch-1/stills.js [postId]
const { C, S, D, P, LOGO_LIGHT, LOGO_TILE, iphone, duo, frame, h, sub, step, renderStills } = require("../lib/stills-kit");

// ---------- the plan ----------
const posts = [
    {
        id: "w1-mon",
        slides: [
            frame({
                tag: "guests",
                glow: "70% 75%",
                body: `
<div class="stack" style="gap:20px;margin-top:40px">${h("Lines are<br>so last year.", 104)}${sub("Scan the QR. Order from your phone. Pick up when it’s ready.")}</div>
<div style="position:absolute;left:-60px;bottom:-40px;width:760px;height:560px;border-radius:40px;overflow:hidden;opacity:.55;transform:rotate(-4deg)"><img src="${P.festival}" style="width:100%;height:100%;object-fit:cover"></div>
${iphone(S.menu, { w: 430, finish: "glacier", style: "position:absolute;right:70px;bottom:-150px;transform:rotate(6deg)" })}`,
            }),
        ],
    },
    {
        id: "w1-wed",
        slides: [
            frame({
                tag: "guests",
                page: "1/5",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:120px">${h("How to skip the line at your next event", 108)}${sub("4 steps. No app to download.", "color:rgba(18,18,18,.75)")}<p class="swipe">Swipe →</p></div>
${iphone(S.menu, { w: 400, finish: "deepBlack", style: "position:absolute;right:90px;bottom:-330px;transform:rotate(8deg)" })}`,
            }),
            frame({
                tag: "guests",
                page: "2/5",
                body: `<div class="stack" style="gap:16px">${step(1)}${h("Scan the QR", 84)}${sub("On banners, A-frames and table tents around the event.")}</div>
<div class="photo" style="position:absolute;left:80px;right:80px;bottom:120px;height:640px"><img src="${P.tent}" style="object-position:60% 50%"></div>`,
            }),
            frame({
                tag: "guests",
                page: "3/5",
                body: `<div class="stack" style="gap:16px">${step(2)}${h("Pick your food", 84)}${sub("Every vendor’s menu, with photos and live stock.")}</div>
${iphone(S.product, { w: 420, finish: "deepBlack", style: "position:absolute;left:50%;bottom:-240px;transform:translateX(-50%)" })}`,
            }),
            frame({
                tag: "guests",
                page: "4/5",
                body: `<div class="stack" style="gap:16px">${step(3)}${h("Pay on your phone", 84)}${sub("Card payment in the browser. No account needed.")}</div>
${iphone(S.checkout, { w: 420, finish: "silver", style: "position:absolute;left:50%;bottom:-240px;transform:translateX(-50%)" })}`,
            }),
            frame({
                tag: "guests",
                page: "5/5",
                body: `<div class="stack" style="gap:16px">${step(4)}${h("Get your number.<br>Go enjoy the event.", 80)}${sub("We’ll let you know when your order is ready.")}</div>
${iphone(S.confirmed, { w: 420, finish: "burgundy", style: "position:absolute;left:50%;bottom:-210px;transform:translateX(-50%)" })}`,
            }),
        ],
    },
    {
        id: "w1-fri",
        slides: [
            frame({
                tag: "guests",
                glow: "50% 80%",
                body: `<div class="stack" style="gap:20px;align-items:center;text-align:center;margin-top:20px">${h("No app.<br>Just your camera.", 96)}${sub("Point, scan, and the whole event’s food is on your phone.", "max-width:780px")}</div>
${iphone(S.event, { w: 400, finish: "deepBlack", style: "position:absolute;left:120px;bottom:-230px;transform:rotate(-7deg)" })}
${iphone(S.menu, { w: 400, finish: "glacier", style: "position:absolute;right:120px;bottom:-260px;transform:rotate(7deg)" })}`,
            }),
        ],
    },
    {
        id: "w2-mon",
        slides: [
            frame({
                tag: "vendors",
                page: "1/4",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:120px">${h("Vendors: put your menu on every phone at the event", 100)}${sub("Here’s how it works →", "color:rgba(18,18,18,.75)")}</div>
${duo(D.orders, { w: 960, style: "position:absolute;left:60px;bottom:-170px" })}`,
            }),
            frame({
                tag: "vendors",
                page: "2/4",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(1)}${h("Build your menu once", 80)}${sub("Photos, prices, options and stock counts.")}</div>
${duo(D.menu, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "vendors",
                page: "3/4",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(2)}${h("Get your own QR code", 80)}${sub("Print it for your booth. Guests land right on your menu.")}</div>
${duo(D.store, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "vendors",
                page: "4/4",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:80px">${step(3, true)}${h("Get paid through Stripe", 100)}${sub("Connect a payout account and card payments reach you.", "color:rgba(18,18,18,.75)")}
<p class="cta">Join your next event at no-q.ca</p></div>
${iphone(S.checkout, { w: 380, finish: "silver", style: "position:absolute;right:90px;bottom:-330px;transform:rotate(6deg)" })}`,
            }),
        ],
    },
    {
        id: "w2-wed",
        slides: [
            frame({
                tag: "vendors",
                glow: "50% 72%",
                body: `<div class="stack" style="gap:20px">${h("Every order, live.", 104)}${sub("New orders appear on your screen. One tap moves each one along until it’s picked up.")}</div>
${duo(D.orders, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
        ],
    },
    {
        id: "w2-fri",
        slides: [
            frame({
                tag: "vendors",
                page: "1/3",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:120px">${h("Never sell the plate you don’t have.", 104)}${sub("Stock tracking, built in →", "color:rgba(18,18,18,.75)")}</div>
${iphone(S.menu, { w: 380, finish: "deepBlack", style: "position:absolute;left:120px;bottom:-380px;transform:rotate(-6deg)" })}
${iphone(S.product, { w: 380, finish: "glacier", style: "position:absolute;right:120px;bottom:-330px;transform:rotate(6deg)" })}`,
            }),
            frame({
                tag: "vendors",
                page: "2/3",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${h("Set your count. We count down.", 80)}${sub("Every NO-Q sale lowers it. Tap + or − for sales made elsewhere.")}</div>
${duo(D.menu, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "vendors",
                page: "3/3",
                body: `<div class="stack" style="gap:16px">${h("Guests see it first.", 84)}${sub("“Only 4 left” when stock is low. “Sold out” when it’s gone.")}</div>
${iphone(S.menu, { w: 400, finish: "deepBlack", style: "position:absolute;left:110px;bottom:-250px;transform:rotate(-5deg)" })}
${iphone(S.product, { w: 400, finish: "glacier", style: "position:absolute;right:110px;bottom:-280px;transform:rotate(5deg)" })}`,
            }),
        ],
    },
    {
        id: "w3-mon",
        slides: [
            frame({
                tag: "organizers",
                page: "1/4",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:120px">${h("Organizers: one link, every vendor.", 104)}${sub("Setting up an event on NO-Q →", "color:rgba(18,18,18,.75)")}</div>
${duo(D.roster, { w: 960, style: "position:absolute;left:60px;bottom:-170px" })}`,
            }),
            frame({
                tag: "organizers",
                page: "2/4",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(1)}${h("Create the event", 80)}${sub("Venue and dates in. Event QR out, ready to print.")}</div>
${duo(D.eventQr, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "organizers",
                page: "3/4",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(2)}${h("Send one invite link", 80)}${sub("Vendors sign up through it. Watch the roster fill.")}</div>
${duo(D.roster, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "organizers",
                page: "4/4",
                body: `<div class="stack" style="gap:16px">${step(3)}${h("Put the QR on the grounds", 80)}${sub("Banners at the gates, tents on the tables.")}</div>
<div class="photo" style="position:absolute;left:80px;width:440px;bottom:120px;height:660px"><img src="${P.banner}"></div>
<div class="photo" style="position:absolute;right:80px;width:440px;bottom:120px;height:660px"><img src="${P.tent}" style="object-position:62% 50%"></div>`,
            }),
        ],
    },
    {
        id: "w3-wed",
        slides: [
            frame({
                tag: "organizers",
                glow: "50% 72%",
                body: `<div class="stack" style="gap:20px">${h("Know your busiest hour.", 100)}${sub("Sales, orders, peak times and top items for every vendor at your event.")}</div>
${duo(D.insights, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}
<p style="position:absolute;right:64px;bottom:100px;font:500 22px Inter,sans-serif;color:${C.muted}">Illustrative data</p>`,
            }),
        ],
    },
    {
        id: "w3-fri",
        slides: [
            frame({
                tag: "all",
                page: "1/6",
                bg: "lime",
                body: `<div class="stack" style="gap:28px;margin-top:120px">${h("One event.<br>One round trip.", 112)}${sub("From the organizer’s dashboard to a guest’s phone, and back →", "color:rgba(18,18,18,.75)")}</div>
${duo(D.insights, { w: 820, style: "position:absolute;left:50px;bottom:-110px" })}
${iphone(S.confirmed, { w: 330, finish: "burgundy", style: "position:absolute;right:70px;bottom:-230px;transform:rotate(6deg)" })}`,
            }),
            frame({
                tag: "organizers",
                page: "2/6",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(1)}${h("The organizer creates the event", 72)}</div>
${duo(D.eventQr, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "vendors",
                page: "3/6",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(2)}${h("Vendors join and build their menus", 72)}</div>
${duo(D.invites, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "guests",
                page: "4/6",
                body: `<div class="stack" style="gap:16px">${step(3)}${h("Guests scan, order and pay", 72)}</div>
${iphone(S.menu, { w: 400, finish: "glacier", style: "position:absolute;left:110px;bottom:-250px;transform:rotate(-5deg)" })}
${iphone(S.confirmed, { w: 400, finish: "burgundy", style: "position:absolute;right:110px;bottom:-250px;transform:rotate(5deg)" })}`,
            }),
            frame({
                tag: "vendors",
                page: "5/6",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(4)}${h("Orders land on the vendor’s screen", 72)}</div>
${duo(D.orders, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
            frame({
                tag: "organizers",
                page: "6/6",
                glow: "50% 75%",
                body: `<div class="stack" style="gap:16px">${step(5)}${h("And the organizer sees it all", 72)}<p class="cta" style="margin-top:8px">Bring NO-Q to your next event · no-q.ca</p></div>
${duo(D.insights, { w: 960, style: "position:absolute;left:60px;bottom:150px" })}`,
            }),
        ],
    },
];

renderStills(posts, 1);
