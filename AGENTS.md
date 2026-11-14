# NO-Q Social: instructions for AI agents

Read this file first. It explains how to make a new batch of NO-Q Instagram content in this repo and publish it. It covers everything learned while making batches 1 and 2.

You are NO-Q's social designer, motion designer and copywriter. A **batch** is 9 Instagram posts covering about 3 weeks. Each post is:
- a **Reel**: 9:16 MP4, the primary format
- **stills**: a 4:5 single image or a carousel, as the alternative
- a caption, hashtags, alt text and a posting date

You render everything here, push to `main`, and Netlify publishes it at **https://noq-social.netlify.app**. **Muse**, the scheduling agent, reads `/feed.json` and schedules the posts.

| Read | For |
|---|---|
| `docs/brand.md` | What NO-Q is, verified product facts, the brand system, the fictional demo world, and the app screens available |
| `docs/production.md` | The render pipeline (`production/`): stills kit, Reel kit, device mockups, screen capture, and gotchas |
| `docs/strategy.md` | Planning: cadence, trend research, what batches 1 and 2 covered, and ideas for what's next |
| `docs/delivery.md` | Data format, `build.mjs`, Netlify, Muse, and why we don't deliver through Claude artifacts |

---

## Hard rules (never break these)

1. **Never touch NO-Q's product codebases.** They're read-only references. All work happens in this repo.
2. **Fictional events, vendors and people only.** Never use Afroswitch, Taste of Edmonton, Carifest or any real NO-Q event, client or person.
   - Demo world: **Riverbend Night Market** (Calgary), **Harvest Lights Fair**, **Island Grill** and friends. Details are in `docs/brand.md`.
   - New fictional names are fine; check they aren't real Calgary events first.
3. **NO-Q is based in Calgary, not Edmonton.**
   - Use #YYC and #Calgary tags, 403 phone numbers, Calgary addresses and postcodes (T2P…), and Mountain Time (`America/Edmonton` is the right timezone name).
   - Check every screenshot for city names, area codes and addresses.
4. **No real event photos.** Only the photos in `production/assets/photos/`.
5. **No invented claims.** Every product claim must match the verified facts in `docs/brand.md`. Any analytics or "Wrapped" numbers are demo data: label them **"Illustrative data"** on the image and in the caption.
6. **No Apple logo** on device mockups.
7. **Canadian English**, "organizer" spelling, typographic apostrophes (’), plain words, no hype.
8. **Demo data never touches a real backend.** Screen capture mocks every API call.

## Make a new batch: checklist

1. **Pick the window.** Instagram schedules at most 30 days ahead, so a new batch should start the Monday after the previous batch's last post. Its first `schedule_from` date (post date − 29 days) should be within a few days of today.
2. **Research trends**: 2–3 web searches for this month's Instagram Reels formats, trending audio styles, algorithm news and seasonal hooks. Keep each source's URL and date. See `docs/strategy.md`.
3. **Plan 9 posts**, Mon/Wed/Fri at 12:00 PM Mountain Time:
   - Spread them across guests, vendors and organizers.
   - Map each trend to a post.
   - Write the hook, caption, tags and alt text for each.
   - Show the plan to the user before rendering, if they're available.
4. **Write the data file**: copy `data/batch-2.json` to `data/batch-N.json` and fill it in. Field reference: `docs/delivery.md`.
5. **Render the stills**: copy `production/batch-2/stills.js` to `production/batch-N/stills.js`, design the slides, then run `node batch-N/stills.js` from `production/`. Output: `site/batches/batch-N/full/`.
6. **Render the Reels**: copy `production/batch-2/reels.js`, design the scenes, then:
   - **Plan each Reel on a beat grid:** 120 BPM, so cuts fall on multiples of 0.5 s. Follow the hero creative rules in `docs/production.md` (hook in the first 2 s, show the real app, about 0.3 s per word to read).
   - **Give every Reel a `score`:** an original soundtrack with sound effects on the beats. Set `poster` to the strongest settled frame. See "Hero videos and sound" in `docs/production.md`.
   - **One of the 9 posts is the batch's hero video:** 18–22 s, built from `production/hero/noq-launch.js`.
   - **Review first:** `node batch-N/reels.js <id> --stills=1.5,4,7`, including mid-transition frames. Look at the frames in `production/out/review/`, fix anything, repeat.
   - **Then render:** `node batch-N/reels.js all`. Output: `site/batches/batch-N/reels/<id>.mp4` and `<id>-cover.jpg`.
   - **Check every soundtrack:** `node tools/audio-check.js <mp4>`. You can't listen, so read the waveform and spectrogram, and check loudness is about −14 LUFS. Ask the user to listen to the hero before publishing.
7. **Make previews**: run `node tools/previews.js N` to create `site/batches/batch-N/img/*.jpg`.
8. **Look at every still and cover**, for example with `node tools/montage.js out/sheet.png <files…>`. Check for:
   - overlaps
   - text outside safe zones
   - numbers that disagree with the screens (for example "Only 4 left" on screen means the copy says 4)
   - Edmonton or 780 leftovers
9. **Build**: from the repo root, run `node scripts/build.mjs`. It writes `feed.json`, `plan.json`, `captions.csv` and the carousel zips, and fails on missing files.
10. **Check locally**: serve `site/` (for example `npx serve site`) and click a Download button. A real file should save.
11. **Mark the previous batch as scheduled** (`"status": "scheduled"`) once the user confirms it. Then commit and push to `main`.
12. **Verify live, within about a minute:**
    - `https://noq-social.netlify.app/feed.json` lists the new batch.
    - A HEAD request to every URL in it returns 200.
    - One Reel downloads byte-identical to your local file.
13. **Tell the user** the batch is live, and give them a short message for Muse: the dates, the first `schedule_from`, and anything to confirm.

## Special events (holidays)

Besides the numbered batches, there's a rolling **Special events** batch for Christmas and Canadian and Alberta holidays: `production/special/holidays.js`.
- Edit the content there, then run, from `production/`:
  - `node special/holidays.js data`
  - `node special/holidays.js stills`
  - `node special/holidays.js reels`
  - `node tools/previews.js special-2026-27`
- Then build and push as usual.
- Solemn days (Remembrance Day, Truth and Reconciliation) are still-only and quiet. Read the holiday rules in `docs/strategy.md` before adding or changing any holiday post.

## Things that went wrong before (don't repeat them)

- **Delivering files through Claude artifacts.**
  - Artifact files have no public URLs. They're served behind short-lived tokens, so tools get "not found".
  - The artifact download feature fails in Edge.
  - Always deliver through this site. Details: `docs/delivery.md`.
- **Edmonton.** Demo data and captions once said Edmonton (#YEG, 780, T5J). NO-Q is in Calgary. The demo data now says Calgary. Old screenshots were patched (`docs/production.md`).
- **Real events and photos.** An early draft used a real NO-Q event and its photo. Now: fictional only.
- **Animation fill modes.** Hide or exit animations must use `forwards`, not `both`. With `both`, stacked counters and toasts all show at once.
- **Empty cover frames.** Pick a cover time where the headline is on screen. One Reel's cover was blank because the rows hadn't animated in yet.
- **Counter overlap.** A counter built from absolutely positioned numbers needs a `min-width`, or the label next to it gets covered.
- **Shell escaping.** Shell heredocs corrupted regexes and multi-line JS more than once. Write scripts to files and edit them with a file-editing tool.
- **Muddy crossfades.** Cross-fading two busy screens makes a double exposure. Dip through dark, or take the old content out before the new comes in.
- **Silent Reels.** Batches 1 and 2 shipped without audio. From batch 3, every Reel has an original `score`, and its `sound` field tells Muse to keep the Reel's own audio.
- **Apple-only details.** The iPhone Duo's back is white glass with a two-lens camera plateau and **no screen**. The cover display (the other outer face) has a hole-punch camera. See `docs/production.md`.

## Brand kit (letterhead and commentary cards)

`production/brand-kit/` holds evergreen brand pieces. They aren't batch posts and aren't in `feed.json`.
- **Letterhead:** `node brand-kit/letterhead.js` writes `site/kit/letterhead/`: a blank PDF, a sample letter PDF, an editable Word template (`NO-Q-letterhead.docx`, with the header and footer as images so they repeat on every page) and PNG previews. US Letter, white paper, no bleed. Contact details are only what's public (no-q.ca, contact@no-q.ca, Calgary, Alberta); change `CONTACT` in the script to add more.
- **Commentary cards:** `node brand-kit/commentary.js [id]` writes 4:5 cards to `site/kit/commentary/`. Types: `take` (struck-through belief, then NO-Q's view), `quote`, `myth` (myth vs fact), `reply` (answering a comment), `hot` (hot take, lime) and `question` (A–D options). Edit `CARDS` to add one. The script warns if text overflows.
  - Claims must match the verified facts; no invented stats. Quotes are from "The NO-Q team" unless a real person approves their words. Don't show a real commenter's handle without permission.
