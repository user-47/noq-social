# NO-Q brand, product facts and demo world

## What NO-Q is

NO-Q is a **Calgary-based** company. It makes web-based mobile ordering for busy events and venues: festivals, night markets, game days and malls. From the NO-Q website (https://www.no-q.ca):

> Mobile ordering for busy events and venues. Guests scan, order, and pay from their phones. Vendors receive every order in one place. Organizers keep the experience moving.
> Web-based ordering. No customer app download required.

| Who | App | What they do |
|---|---|---|
| **Organizer** | Organizer portal | Creates and publishes an event, gets a printable **event QR**, invites vendors with **one link**, and sees **Event insights**: sales, orders, busiest hour, and top items per vendor |
| **Vendor** | Vendor dashboard | Signs up from the organizer's invite, connects payouts through **Stripe**, builds a storefront and menu (photos, prices, options, **stock counts**), prints a **storefront QR**, and receives **live orders**, moving each one New Order → Started → Awaiting Pickup → Picked Up. Can connect a kitchen display or POS (Square). |
| **Guest** | Web app, no install | Scans a QR, browses every vendor at the event or one vendor's menu, sees live stock ("Only 4 left", "Sold out"), pays by card (Stripe), and gets an **order number and queue position** plus a message when the order is ready |

**The core story is a round trip:** organizer → vendor → QR codes on the grounds → guest → vendor → organizer.

### Product codebases (read-only references; never modify them)

| App | Local path | GitHub | Stack |
|---|---|---|---|
| Vendor dashboard and marketing site | `E:\AXER TECHNOLOGY INC\2024\Projects\no-Q\Frontend\No-Q-Frontend` | `AxerTechnology/No-Q-Frontend` | React Router 7, Vite, Tailwind 3, RTK Query |
| Guest app | `E:\AXER TECHNOLOGY INC\2024\Projects\no-Q\NEW_customer-no-q\customer-no-q` | `AxerTechnology/customer-no-q` | Next 16, Tailwind 4; read its `AGENTS.md` |
| Organizer portal | `E:\AXER TECHNOLOGY INC\2024\Projects\no-Q\Event Mgr Portal\Event Mgr Portal` | `AxerTechnology/No-Q-Event-Manager` | CRA, Redux |

## Verified product facts (safe to claim)

- No app download; it works in the phone's browser.
- One event QR lists every vendor, and each storefront has its own QR.
- Organizers invite vendors with one link. The roster shows Live or Draft.
- Vendors connect payouts through Stripe, and guests pay by card through Stripe.
- **Stock tracking:**
  - Every NO-Q sale lowers the count.
  - Vendors tap + or − for sales made elsewhere.
  - Guests see "Only X left" below the low-stock threshold (default 5) and "Sold out" at zero.
  - Inventory was built on the `feature/error-handling` work in late 2026. **Check with the user that it's live** before featuring it again.
- Orders appear on the vendor dashboard with a new-order alert, and the list refreshes every 20 seconds.
- **Order statuses:** New Order → Started → Awaiting Pickup → Picked Up.
- Kitchen display or POS integration (Square).
- Guests get an order number and a queue position, and are told when the order is ready.
- Returning guests can see their order history by signing in with an email one-time code.
- **Event insights:** total sales, total orders and busiest period; per-vendor sales, orders, busy hour and top item; and a busy-hours chart.

Don't claim anything else, such as a native app, loyalty points or offline mode, without checking the code.

## Brand system

- **Colours:**

  | Role | Value |
  |---|---|
  | Ink (main background) | `#121212` |
  | Panel | `#1b1c18` |
  | Line | `#2e3029` |
  | Text | `#f2f4ec` |
  | Muted | `#a9ad9f` |
  | **NO-Q lime** (accent and calls to action) | `#cef24e`, always with dark text on lime |
  | Low-stock amber | `#f59e0b` (dark text) or `#ffd166` (on dark) |
  | Sold-out red | `#ff8a80` on `#3a1d1d` |
  | Winter accent (batch 2 temperature chips and cards) | Ice blue `#bfe3ff` |

  Order status pills: New Order `#93c5fd`, Started `#6ee7b7`, Awaiting Pickup `#fcd34d`, Picked Up `#e7e9df`.
- **Type:** headings in **Space Grotesk 700** with tight tracking (−1.5 to −3px); body in **Inter** 400/500/600. Both from Google Fonts.
- **Logos** (in `production/assets/brand/`):
  - `NO-QLogo-new.svg`: the light wordmark with lime chevrons, for dark backgrounds.
  - `NO-Q-Logo-Obsidian.png`: the dark tile, for lime backgrounds.
  - `No-Q_logo_light.svg`: the dark wordmark, for white.
  - Never type "NO»Q" in place of the logo.
- **Still layout:** 1080 × 1350 (4:5), exported at 2× (2160 × 2700).
  - 64px margins.
  - Logo top-left; audience tag top-right ("For guests" / "For vendors" / "For organizers" / "How NO-Q works").
  - `no-q.ca` and the carousel pager at the bottom.
  - Covers and calls to action can use a lime background.
- **Reel layout:** 1080 × 1920, 30 fps. Keep text inside y 250–1450 and x 90–990, which clears Instagram's buttons and the grid's 3:4 crop.
- **Motion language:**
  - Word-by-word mask reveals for headlines.
  - Lime strike-through or underline sweeps.
  - Spring entrances for phones, `cubic-bezier(.34,1.56,.64,1)`; ease-out `cubic-bezier(.22,1,.36,1)` for most moves; ease-in-out `cubic-bezier(.65,0,.35,1)` for the Duo unfold.
  - A slow drifting lime glow behind everything.
  - A 1–2 second end card: logo pop, one line, and a lime `no-q.ca` pill.
  - Batch 2 added a subtle snowfall for winter.
  - Keep motion clean: no glitch effects, no stock transitions.
- **Voice:** plain, warm, specific, and a little playful. For example: "Lines are so last year." "Send this to a vendor who's still counting cash at −20°." Avoid hype words and em-dash asides.
- **Base hashtags on every post:** `#NOQ #SkipTheLine #EventTech #MobileOrdering`. Add 3–4 post-specific tags, for example `#YYC #Calgary #yycevents #WinterMarket #FoodVendor #EventPlanning`.

## The fictional demo world

Everything on screen comes from this world. It's defined in `production/capture/story-data.js`.

- **Event:** **Riverbend Night Market**, run by **Riverbend Events**.
  - Address: Riverbend Commons, 1200 Riverside Dr SW, Calgary, T2P 0A1.
  - Dates: June 18–20, 2027. Event dates must be in the future, or the guest app shows "This event has ended".
  - The event URL slug is `riverbend`.
- **Second invite:** **Harvest Lights Fair**.
- **Vendors** (18 at the event; 4 are shown):

  | Vendor | Owner | Sells | Phone |
  |---|---|---|---|
  | **Island Grill** (hero vendor) | Marcus Brown | Jerk chicken, patties, sorrel | (403) 555-0142 |
  | Suya Spot | Tolu Adeyemi | Suya, kebabs, plantain | (403) 555-0177 |
  | Jollof Republic | Ama Mensah | Jollof rice, fried rice, chicken | (403) 555-0119 |
  | Sweet Bakes | Grace Okafor | Puff-puff, chin chin, cakes | (403) 555-0163 |

- **Island Grill menu:**
  - Jerk Chicken Plate CA$16.50, tracked at **4 left**, so the low-stock pill shows "Only 4 left"
  - Beef Patty CA$4.50
  - Oxtail Stew CA$19, **sold out**
  - Festival Combo
  - Drinks
- **Orders:**
  - **IG-2047**, Ama M., queue position **3**: 2× Jerk Chicken Plate and 1× Beef Patty, total CA$41.81.
  - **IG-2048**, Kwame O.: 1× Festival Combo.
- **Event insights (illustrative):**
  - Totals: 18 vendors, $13,893.75 in sales, 1,026 orders, busiest at 8 PM (3,100 items).
  - Island Grill: $4,820.50 and 312 orders.
  - Suya Spot: $3,975.00 and 268 orders.
  - Jollof Republic: $3,410.25 and 241 orders.
  - Sweet Bakes: $1,688.00 and 205 orders.
- **Checkout contact:** Ama Mensah, 4035550123, ama@example.com.

## Screens available (`production/assets/screens/`)

Captured from the real apps with the demo data. Phone screens are 402 × 820 at 3×; Duo and desktop screens are 1200 × 820 at 2×.

| File | Screen | Mockup |
|---|---|---|
| `c1-guest-event-vendors.png` | Guest: the event's vendor list | iPhone |
| `c2-guest-store-menu.png` | Guest: Island Grill menu, with low-stock and sold-out pills | iPhone |
| `c3-guest-product.png` | Guest: Jerk Chicken Plate details, "Only 4 left" | iPhone |
| `c4-guest-checkout.png` | Guest: checkout contact form (white status bar) | iPhone |
| `c5-guest-order-confirmed.png` | Guest: order IG-2047 confirmed, queue position 3 | iPhone |
| `v1-vendor-event-invites.png` | Vendor: event invites | Duo |
| `v2-vendor-storefront-qr.png` | Vendor: storefront with QR, URL and inventory card | Duo |
| `v3-vendor-menu.png` | Vendor: menu editor with stock controls | Duo |
| `v4-vendor-orders.png` | Vendor: live orders list | Duo |
| `o1-organiser-events.png` | Organizer: events list | Duo |
| `o2-organiser-event-qr.png` | Organizer: event page with QR and Calgary address | Duo |
| `o3-organiser-invite-vendors.png` | Organizer: invite link and vendor roster with 403 numbers | Duo |
| `o4-organiser-insights.png` | Organizer: event insights | Duo |

`o2`, `o3` and `c4` were captured when the demo data still said Edmonton, and were patched to Calgary afterwards (see `docs/production.md`). If you re-capture, the demo data already says Calgary.

**Allowed photos** (`production/assets/photos/`):
- `at-festivals-optimized.jpg`: a generic crowd
- `how-it-works/vip-qr-code-optimized.jpg`: a "Skip the line" table tent
- `how-it-works/no-q-rollup-banner-optimized.jpg`: a roll-up banner

**Banned:**
- `Hero-Image-1.webp` and `carifest2025logo.webp` from the frontend repo (real events)
- any photo of a real NO-Q event
