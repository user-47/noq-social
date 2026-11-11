// Fake NO-Q API for the customer app (server-side and browser requests). Port 4010.
const http = require("http");
const D = require("./story-data");

const store = D.stores[0];
const { order, cart } = D;

const routes = [
    [/^\/events\/[^/]+\/stores/, () => D.page(D.stores, 18)],
    [/^\/events\/[^/]+$/, () => ({ success: true, data: D.event })],
    [/^\/stores\/[^/]+$/, () => ({ success: true, data: store })],
    [/\/categories$/, () => D.page([{ id: D.CAT_MAINS, name: "Mains" }, { id: D.CAT_DRINKS, name: "Drinks" }])],
    [/\/products$/, () => D.page(D.products)],
    [/by-checkout-token/, () => ({ success: true, data: order })],
    [/^\/carts\//, () => ({ success: true, data: D.cart })],
];



http.createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    if (req.method === "OPTIONS") return res.end();
    const hit = routes.find(([re]) => re.test(url.pathname));
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(hit ? hit[1]() : D.page([])));
}).listen(4010, () => console.log("story api on 4010"));

