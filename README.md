# NO-Q Social

NO-Q's Instagram content calendar, published as a static site on Netlify. Every Reel, cover and still has a permanent public URL, so people and tools (Muse) can download them in any browser.

- **Site:** `https://noq-social.netlify.app` (set the real address in `site.config.json`)
- **Feed for tools:** `/feed.json` lists every batch and post with absolute URLs
- **Per batch:** `/batches/batch-N/plan.json` and `/batches/batch-N/captions.csv`

## How it works

1. Claude renders a batch (Reels and stills) and writes `data/batch-N.json` with captions, tags, alt text, dates and trends.
2. The media goes in `site/batches/batch-N/`:

   | Folder | Contents |
   |---|---|
   | `reels/` | `<id>.mp4` and `<id>-cover.jpg` |
   | `full/` | `<id>.png`, or `<id>-1.png` … `<id>-N.png` for a carousel |
   | `img/` | 720 × 900 JPEG previews with the same names |

3. Run `node scripts/build.mjs` (no install needed). It writes `site/feed.json`, each batch's `plan.json` and `captions.csv`, and a stills zip for each carousel. It stops if any file is missing.
4. Commit and push to `main`. Netlify publishes the `site/` folder in about a minute; there is no build step on Netlify.
5. Muse reads `feed.json` and schedules every post whose `schedule_from` date has arrived.

## Rules for each batch

- Only fictional events, vendors and people. Never real NO-Q events or clients.
- NO-Q is based in Calgary: use #YYC and #Calgary tags, 403 phone numbers and Mountain Time.
- Label figures as illustrative.
- Instagram schedules up to 30 days ahead. `schedule_from` is the post date minus 29 days.
- When a batch has been scheduled, set its `status` to `"scheduled"` in `data/batch-N.json`.

## For Muse

1. Fetch `https://<site>/feed.json`.
2. For each post with `schedule_from` on or before today that you haven't scheduled yet:
   - Create a Reel from `reel.url` with the cover from `reel.cover_url`.
   - Paste `caption` exactly as given.
   - Add `alt_text`.
   - Schedule it at `date` + `time` in `America/Edmonton` (Mountain Time).
3. If a post looks wrong (a missing file, a past date, a typo), skip it and report it. Don't change it.

## Layout

```
data/            batch source data (captions, alt text, dates, trends)
scripts/         build.mjs
site/            published by Netlify
  index.html     the calendar page (renders from feed.json)
  feed.json      generated
  batches/batch-N/{reels,full,img,zips}, plan.json, captions.csv
netlify.toml     publish = "site", noindex and CORS headers
```
