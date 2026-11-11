// Demo data for the stakeholder deck: one event (Riverbend Night Market), one hero vendor (Island Grill).
const fs = require("fs");
const path = require("path");

// Vendor/marketing repo assets (product photos for the demo menu). Override with NOQ_FRONTEND_ASSETS.
const ASSETS = process.env.NOQ_FRONTEND_ASSETS || "E:/AXER TECHNOLOGY INC/2024/Projects/no-Q/Frontend/No-Q-Frontend/src/assets";
const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(ASSETS, file)).toString("base64")}`;

const QR_SVG = fs.readFileSync(path.join(__dirname, "..", "assets", "qr.svg"), "utf8");

const EVENT_ID = "6f1d2c3b-4a59-4e7d-8c21-0a1b2c3d4e5f";
const STORE_ID = "8d3c3c1e-5b7a-4c1f-9d2e-1a2b3c4d5e6f";
const VENDOR_ID = "1f2e3d4c-5b6a-4789-8abc-def012345678";
const CAT_MAINS = "2a3b4c5d-6e7f-4801-9abc-0123456789ab";
const CAT_DRINKS = "2a3b4c5d-6e7f-4801-9abc-0123456789ac";

const event = {
    id: EVENT_ID,
    name: "Riverbend Night Market",
    status: "published",
    street: "Riverbend Commons, 1200 Riverside Dr",
    city: "Calgary",
    postal_code: "T2P 0A1",
    country: "Canada",
    start_date: "2027-06-18T16:00:00Z",
    end_date: "2027-06-20T23:00:00Z",
    url: "https://order.no-q.ca/events/riverbend-night-market",
    qr_code: QR_SVG,
    logo_url: dataUrl("images/at-festivals-optimized.jpg", "image/jpeg"),
};

const page = (data, total = data.length) => ({
    success: true,
    data,
    meta: { current_page: 1, last_page: 1, total, per_page: 20 },
});

// Product photos the customer app ships with (served from its own /public).
const img = (n) => `/assets/images/itemImage${n}.png`;

const stores = [
    { id: STORE_ID, name: "Island Grill", services: "Jerk chicken, Patties, Sorrel", banner: img(1) },
    { id: "s2", name: "Suya Spot", services: "Suya, Kebabs, Plantain", banner: img(2) },
    { id: "s3", name: "Jollof Republic", services: "Jollof rice, Fried rice, Chicken", banner: img(4) },
    { id: "s4", name: "Sweet Bakes", services: "Puff-puff, Chin chin, Cakes", banner: img(5) },
].map((s) => ({
    id: s.id,
    name: s.name,
    services: s.services,
    status: "published",
    banner_url: s.banner,
    event_id: EVENT_ID,
    vendor: { id: VENDOR_ID, name: s.name, logo_url: null },
}));

const prod = (id, name, price, image, extra = {}) => ({
    id,
    name,
    price,
    currency: "CAD",
    status: "published",
    image_url: image,
    description: null,
    track_inventory: false,
    stock_status: "untracked",
    available_quantity: null,
    categories: [{ id: CAT_MAINS, name: "Mains" }],
    ...extra,
});

const products = [
    prod("p1", "Jerk Chicken Plate", 16.5, img(1), {
        description: "Smoky jerk chicken, rice & peas, fried plantain and slaw.",
        track_inventory: true,
        stock_status: "low_stock",
        available_quantity: 4,
    }),
    prod("p2", "Beef Patty", 4.5, img(2)),
    prod("p3", "Oxtail Stew", 19, img(4), { track_inventory: true, stock_status: "sold_out" }),
    prod("p4", "Festival Combo", 22, img(5)),
];

const orderItems = (lines) =>
    lines.map(([name, q, amount]) => ({ product_name: name, quantity: q, amount }));

const order = {
    id: "4d5e6f7a-8b9c-4d0e-9f10-223344556677",
    order_number: "IG-2047",
    status: "in_queue",
    total: 41.81,
    checkout_token: "tok_demo",
    queue_position: 3,
    order_items: orderItems([
        ["Jerk Chicken Plate", 2, 16.5],
        ["Beef Patty", 1, 4.5],
    ]),
};

const cart = {
    id: "3c4d5e6f-7a8b-4c9d-8e0f-112233445566",
    cart_items: [
        { id: "l1", product_id: "p1", product_name: "Jerk Chicken Plate", amount: 16.5, quantity: 2 },
        { id: "l2", product_id: "p2", product_name: "Beef Patty", amount: 4.5, quantity: 1 },
    ],
    subtotal: 37.5,
    platform_fee: 1,
    tax_amount: 3.31,
    total: 41.81,
};

module.exports = {
    order,
    cart,
    EVENT_ID,
    STORE_ID,
    VENDOR_ID,
    CAT_MAINS,
    CAT_DRINKS,
    QR_SVG,
    event,
    stores,
    products,
    page,
    orderItems,
    dataUrl,
};
