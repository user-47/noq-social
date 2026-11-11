# Delivery: data, build, Netlify and Muse

## Why this repo exists

The first two batches were delivered as a Claude **artifact**, a page hosted on claude.ai with download buttons. That broke for scheduling:
- **No public file URLs.** An artifact's files are served behind short-lived access tokens, so a tool fetching `reels/w4-mon.mp4` or `plan.json` gets "not found".
- **Downloads failed in Edge.** The artifact's save feature (`claude.use("downloads")`) wasn't available in Edge and similar views, and right-click save was blocked there too.
- **The stopgap** was a zip on Google Drive. Use Drive's direct form, `drive.usercontent.google.com/download?id=…&export=download&confirm=t`, which skips the virus-scan page Drive shows for files over about 25 MB.

So batches now live in this static site: every file has a permanent URL, and the download buttons are plain `<a href download>` links that work in every browser.

## Data file: `data/batch-N.json`

```jsonc
{
  "batch": 3,
  "title": "Batch 3 · …",
  "dates": "Jan 4 – Jan 22, 2027",
  "status": "to schedule",            // set to "scheduled" once Muse has scheduled it
  "summary": "One paragraph shown at the top of the batch.",
  "base_tags": "#NOQ #SkipTheLine #EventTech #MobileOrdering",
  "trends": [ { "name": "…", "why": "…", "used_in": "Jan 4, Jan 13" } ],
  "sources": [ { "name": "Later", "url": "https://…" } ],
  "sources_note": "Trend data comes from third-party trackers (Jan 2027) and changes weekly.",
  "notes": [ "Anything to confirm before posting." ],
  "weeks": [
    { "title": "Week 8 · Guests", "sub": "…", "posts": [
      { "id": "w8-mon", "day": "Mon", "date": "Jan 4", "iso": "2027-01-04", "time": "12:00 PM",
        "audience": "Guests", "format": "Carousel · 5", "slides": 5, "reel": 12,
        "trend": "…", "sound": "…",
        "caption": "Hook line.\n\nBody…",      // without hashtags
        "tags": "#YYC #Calgary …",              // post-specific; base_tags are added by the build
        "alt": [ "one entry per still, in order" ] }
    ]}
  ]
}
```

- **Post ids are `w<week>-<day>`.** Week numbers continue across batches: batch 1 used w1–w3, batch 2 used w4–w7, so batch 3 starts at w8. If one week has two posts on the same weekday, use the next week number, as batch 2 did with w6-mon and w7-mon.
- **`slides`** must match the number of PNGs. **`reel`** is the Reel length in seconds.

## Build: `node scripts/build.mjs`

Run it from the repo root; it needs no dependencies. It reads `site.config.json` (`base_url`, brand, timezone) and every `data/batch-*.json`, then writes:
- `site/batches/batch-N/plan.json`: the batch's posts with absolute URLs
- `site/batches/batch-N/captions.csv`: the same as a spreadsheet, UTF-8 with BOM so Excel reads it
- `site/batches/batch-N/zips/<id>-stills.zip`: one for every carousel
- `site/feed.json`: all batches, newest first

It exits with an error listing any missing `reels/`, `full/` or `img/` file.

## The site

- `site/index.html` renders entirely from `feed.json`:
  - the newest batch is open; batches marked `scheduled` are collapsed
  - each post shows its Reel player, stills strip, caption with a copy button, alt text, plain download links, and a list of all its files
- `netlify.toml` publishes `site/` with no build step. Headers:
  - `X-Robots-Tag: noindex`, plus `robots.txt` disallows all, so content isn't indexed before it's posted
  - `Access-Control-Allow-Origin: *`, so tools can fetch files
  - JSON and CSV are served with `must-revalidate`
- Netlify deploys every push to `main` in about a minute. The site is https://noq-social.netlify.app; its GitHub repo is https://github.com/user-47/noq-social.

## Verifying a deploy

After pushing:

```js
const feed = await (await fetch("https://noq-social.netlify.app/feed.json")).json();
// HEAD every reel.url, reel.cover_url, stills[].url, stills_zip_url, plan_url and captions_csv_url, and expect 200.
// Download one Reel and compare its SHA-1 with the local file.
```

Batch 2's first check: 99 URLs, all 200; w4-mon.mp4 byte-identical.

## Muse (the scheduling agent)

Muse reads `https://noq-social.netlify.app/feed.json`. For each post whose `schedule_from` is on or before today and that it hasn't scheduled yet:
1. Create a Reel from `reel.url`, with the cover from `reel.cover_url`.
2. Paste `caption` exactly as written. It already includes hashtags.
3. Add `alt_text`.
4. Add a commercial-library sound matching `sound_suggestion`.
5. Schedule it at `date` + `time` in `America/Edmonton` (Mountain Time).

Muse must not edit captions, prices or dates. It reports problems to the user instead.

**When a batch goes live, give the user a short message for Muse:**
- the batch's dates
- that the feed has been updated
- the first `schedule_from` date
- anything to confirm, for example a feature that must be live first

## Scheduling outside Muse

Instagram's own API publishes immediately. Scheduling through it needs a reviewed Meta app, public media URLs and a server job, so don't build OAuth or a login page for this. For manual scheduling, use **Meta Business Suite → Planner**, which supports Reels, carousels and covers.
