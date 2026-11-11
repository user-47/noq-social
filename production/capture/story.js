// Captures the round-trip story screens. node story.js [organiser|vendor|customer|all] [shotName]
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");
const D = require("./story-data");

const OUT = path.join(__dirname, "..", "out", "capture", process.env.OUTDIR || "story");
// Screen sizes. Defaults match the deck; the social posts pass iPhone 18 Pro / iPhone Duo sizes.
const [DW, DH] = (process.env.DESK || "1440x900").split("x").map(Number);
const DSF = Number(process.env.DESK_SCALE || 1.5);
const PHONE = process.env.PHONE
    ? (() => {
          const [w, h] = process.env.PHONE.split("x").map(Number);
          return { viewport: { width: w, height: h }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: devices["iPhone 15 Pro"].userAgent };
      })()
    : null;
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2] || "all";
const onlyShot = process.argv[3];
const json = (body) => ({ status: 200, contentType: "application/json", body: JSON.stringify(body) });

// Guest app public folder (food images). Override with NOQ_CUSTOMER_PUBLIC.
const CUSTOMER_PUBLIC = process.env.NOQ_CUSTOMER_PUBLIC || "E:/AXER TECHNOLOGY INC/2024/Projects/no-Q/NEW_customer-no-q/customer-no-q/public";
const pub = (p) => `data:image/png;base64,${fs.readFileSync(path.join(CUSTOMER_PUBLIC, p)).toString("base64")}`;
const food = [1, 2, 4, 5].map((n) => pub(`assets/images/itemImage${n}.png`));

// ---------------- organiser ----------------
const rosterStores = [
    ["Island Grill", "Marcus Brown", "marcus@islandgrill.ca", "(403) 555-0142", 4820.5, 312, "7–8 PM", "Jerk Chicken Plate"],
    ["Suya Spot", "Tolu Adeyemi", "tolu@suyaspot.ca", "(403) 555-0177", 3975, 268, "8–9 PM", "Beef Suya"],
    ["Jollof Republic", "Ama Mensah", "ama@jollofrepublic.ca", "(403) 555-0119", 3410.25, 241, "6–7 PM", "Party Jollof"],
    ["Sweet Bakes", "Grace Okafor", "grace@sweetbakes.ca", "(403) 555-0163", 1688, 205, "5–6 PM", "Puff-puff (6)"],
];
const hourly = {
    "Island Grill": [120, 340, 610, 880, 1240, 980, 650],
    "Suya Spot": [80, 260, 520, 760, 940, 1010, 405],
    "Jollof Republic": [210, 420, 760, 690, 620, 480, 230],
    "Sweet Bakes": [140, 310, 260, 240, 300, 250, 188],
};
const HOURS = ["4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"];
const orgVendors = rosterStores.map(([store, owner, email, phone], i) => ({
    id: `v${i + 1}`,
    name: owner,
    email,
    phone_number: phone,
    stores: [{ id: `st${i + 1}`, name: store, status: i === 3 ? "draft" : "published", banner_url: food[i], event_id: D.EVENT_ID }],
}));
const metrics = Object.fromEntries(
    rosterStores.map(([store, , , , sales, orders, busy, top], i) => [
        `st${i + 1}`,
        {
            total_sales: sales,
            total_orders: orders,
            busy_hour: busy,
            top_item: top,
            hourly_sales: HOURS.map((h, k) => ({ hour: h, sales: hourly[store][k] })),
        },
    ])
);
const organiserApi = (p) => {
    if (/^\/organizers\/[^/]+\/events/.test(p)) return D.page([D.event]);
    if (/^\/organizers$/.test(p)) return { success: true, data: [{ id: "o1", name: "Riverbend Events" }] };
    if (/^\/events\/[^/]+\/vendors/.test(p)) return D.page(orgVendors, 18);
    if (/^\/events\/[^/]+$/.test(p)) return { success: true, data: D.event };
    const m = p.match(/^\/metric\/stores\/([^/]+)/);
    if (m) return { success: true, data: metrics[m[1]] };
    return D.page([]);
};
const ORG = [
    { name: "o1-organiser-events", url: "/dashboard" },
    { name: "o2-organiser-event-qr", url: `/dashboard/event/${D.EVENT_ID}` },
    { name: "o3-organiser-invite-vendors", url: `/dashboard/event/${D.EVENT_ID}/invitations` },
    { name: "o4-organiser-insights", url: `/dashboard/event/${D.EVENT_ID}/insights`, fullPage: true },
];

// ---------------- vendor ----------------
const vendor = {
    id: D.VENDOR_ID,
    name: "Island Grill",
    email: "marcus@islandgrill.ca",
    logo_url: food[0],
    connect_account: { account_status: "verified" },
    square_connect: { is_connected: false },
};
const vStore = {
    ...D.stores[0],
    banner_url: food[0],
    url: "https://order.no-q.ca/store/island-grill",
    qr_code: D.QR_SVG,
    event: { id: D.EVENT_ID, name: D.event.name },
    sales_capabilities: { can_publish_store: true },
};
const now = Date.now();
const ago = (min) => new Date(now - min * 60000).toISOString();
const vOrders = [
    ["IG-2047", "in_queue", 1, "Ama M.", [["Jerk Chicken Plate", 2, 16.5], ["Beef Patty", 1, 4.5]]],
    ["IG-2046", "in_queue", 2, "Kwame O.", [["Festival Combo", 1, 22]]],
    ["IG-2045", "processing", 4, "Sarah L.", [["Jerk Chicken Plate", 1, 16.5], ["Sorrel", 2, 5]]],
    ["IG-2044", "processing", 6, "David K.", [["Beef Patty", 3, 4.5]]],
    ["IG-2043", "processed", 9, "Nia B.", [["Oxtail Stew", 1, 19]]],
    ["IG-2042", "delivered", 15, "Femi A.", [["Jerk Chicken Plate", 2, 16.5]]],
].map(([num, status, min, name, lines], i) => {
    const subtotal = lines.reduce((s, [, q, a]) => s + q * a, 0);
    return {
        id: `ord${i}`,
        order_number: num,
        status,
        created_at: ago(min),
        currency: "CAD",
        subtotal,
        subtotal_tax: +(subtotal * 0.05).toFixed(2),
        customer: { name },
        order_items: D.orderItems(lines),
        payment: { status: "succeeded" },
    };
});
const vProducts = D.products.map((p, i) => ({ ...p, image_url: food[i], stock_quantity: p.available_quantity ?? (p.stock_status === "sold_out" ? 0 : null) }));
const vendorApi = (p, search) => {
    if (/^\/vendors$/.test(p)) return { success: true, data: [vendor] };
    if (/^\/admin\/vendors\/[^/]+\/stores/.test(p)) return D.page([vStore]);
    if (/^\/admin\/stores\/[^/]+$/.test(p)) return { success: true, data: vStore };
    if (/\/inventory$/.test(p))
        return { success: true, data: [], meta: { counts: { tracked: 6, low_stock: 1, sold_out: 1 } } };
    if (/^\/vendors\/[^/]+\/events/.test(p))
        return D.page([
            { id: D.EVENT_ID, name: D.event.name, logo_url: D.event.logo_url, is_expired: false },
            { id: "e2", name: "Harvest Lights Fair", logo_url: null, is_expired: false },
        ]);
    if (/\/orders/.test(p)) {
        const status = search.get("status");
        const wanted = status ? status.split(",") : null;
        const list = wanted ? vOrders.filter((o) => wanted.includes(o.status)) : vOrders;
        return D.page(list);
    }
    if (/\/categories\/[^/]+\/products/.test(p)) return D.page(vProducts);
    if (/\/categories/.test(p)) return D.page([{ id: D.CAT_MAINS, name: "Mains" }, { id: D.CAT_DRINKS, name: "Drinks" }]);
    return D.page([]);
};
const VEN = [
    { name: "v1-vendor-event-invites", url: "/dashboard/events" },
    { name: "v2-vendor-storefront-qr", url: `/dashboard/store/${D.STORE_ID}` },
    {
        name: "v3-vendor-menu",
        url: `/dashboard/store/${D.STORE_ID}/products`,
        act: async (page) => {
            await page.getByText("Jerk Chicken Plate").first().click();
            await page.waitForTimeout(800);
        },
    },
    { name: "v4-vendor-orders", url: `/dashboard/store/${D.STORE_ID}/orders` },
];

// ---------------- customer ----------------
const CUS = [
    { name: "c1-guest-event-vendors", url: `/events/${D.EVENT_ID}` },
    { name: "c2-guest-store-menu", url: `/store/${D.STORE_ID}`, withCart: true },
    {
        name: "c3-guest-product",
        url: `/store/${D.STORE_ID}`,
        withCart: true,
        act: async (page) => {
            await page.getByText("Jerk Chicken Plate").first().click();
            await page.waitForTimeout(1200);
        },
    },
    {
        name: "c4-guest-checkout",
        url: `/store/${D.STORE_ID}/checkout`,
        withCart: true,
        act: async (page) => {
            await page.fill('input[name="fullName"]', "Ama Mensah");
            await page.fill('input[name="phoneNo"]', "4035550123");
            await page.fill('input[name="email"]', "ama@example.com");
        },
    },
    { name: "c5-guest-order-confirmed", url: `/store/${D.STORE_ID}/orderConfirmed`, withOrder: true, wait: 2500 },
];

(async () => {
    const browser = await chromium.launch();
    const want = (s) => !onlyShot || s.name.startsWith(onlyShot);

    if (only === "all" || only === "organiser") {
        for (const s of ORG.filter(want)) {
            const ctx = await browser.newContext({ viewport: { width: DW, height: DH }, deviceScaleFactor: DSF });
            await ctx.addInitScript(() =>
                localStorage.setItem("noqEventUser", JSON.stringify({ token: "demo", id: "u1", first_name: "Tobi" }))
            );
            const page = await ctx.newPage();
            await page.route("http://api.noq.test/**", (r) => r.fulfill(json(organiserApi(new URL(r.request().url()).pathname))));
            await page.goto("http://localhost:3200" + s.url, { waitUntil: "networkidle", timeout: 120000 });
            await page.waitForTimeout(1500);
            await page.screenshot({ path: path.join(OUT, `${s.name}.png`), fullPage: !!s.fullPage });
            console.log("saved", s.name);
            await ctx.close();
        }
    }

    if (only === "all" || only === "vendor") {
        for (const s of VEN.filter(want)) {
            const ctx = await browser.newContext({ viewport: { width: DW, height: DH }, deviceScaleFactor: DSF });
            await ctx.addInitScript(() =>
                localStorage.setItem(
                    "noqUser",
                    JSON.stringify({ id: "u1", first_name: "Marcus", email: "marcus@islandgrill.ca", token: "demo" })
                )
            );
            const page = await ctx.newPage();
            await page.route(/no-q\.c[a-z]*\//, (r) => {
                const u = new URL(r.request().url());
                // Drop the API's version prefix so routes match from the resource name.
                const p = u.pathname.replace(/^\/api(?=\/)/, "");
                let body;
                try {
                    body = vendorApi(p, u.searchParams);
                } catch (e) {
                    console.log("mock error", p, e.message);
                    body = { success: false };
                }
                if (process.env.DEBUG) console.log("mock", p, JSON.stringify(body).slice(0, 80));
                return r.fulfill(json(body));
            });
            await page.goto("http://localhost:3000" + s.url, { waitUntil: "networkidle", timeout: 120000 });
            await page.waitForTimeout(1500);
            if (s.act) await s.act(page);
            await page.screenshot({ path: path.join(OUT, `${s.name}.png`) });
            console.log("saved", s.name);
            await ctx.close();
        }
    }

    if (only === "all" || only === "customer") {
        const api = D;
        for (const s of CUS.filter(want)) {
            const ctx = await browser.newContext(PHONE || { ...devices["iPhone 13"] });
            await ctx.addInitScript(
                ([local, session]) => {
                    for (const [k, v] of Object.entries(local || {})) localStorage.setItem(k, JSON.stringify(v));
                    for (const [k, v] of Object.entries(session || {})) sessionStorage.setItem(k, JSON.stringify(v));
                },
                [
                    s.withCart
                        ? { allCarts: [{ storeId: D.STORE_ID, storeName: "Island Grill", cartData: api.cart }], "user-contact": { fullName: "Ama Mensah", phoneNo: "4035550123", email: "ama@example.com" } }
                        : {},
                    s.withOrder ? { order: { orderData: api.order } } : {},
                ]
            );
            const page = await ctx.newPage();
            await page.goto("http://localhost:3100" + s.url, { waitUntil: "networkidle", timeout: 120000 });
            await page.waitForTimeout(1500);
            if (s.act) await s.act(page);
            await page.waitForTimeout(s.wait || 600);
            await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
            await page.screenshot({ path: path.join(OUT, `${s.name}.png`) });
            console.log("saved", s.name);
            await ctx.close();
        }
    }
    await browser.close();
})();
