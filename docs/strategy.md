# Content strategy and batch history

## Cadence and format

- **9 posts per batch**: Monday, Wednesday and Friday for 3 weeks, at 12:00 PM Mountain Time. Adjust the time once the account's Insights show when followers are online.
- **Each post leads with a Reel.** Reels reach people who don't follow the account. The 4:5 stills, as a single image or a carousel, are the alternative. Carousels get the most saves and shares.
- **Audience arc:** guests → vendors → organizers. Batch 1 did one audience per week; batch 2 did the same, plus a year-end week.
- **Instagram schedules at most 30 days ahead.** `schedule_from` is the post date minus 29 days. Start a new batch when the previous batch's last post is about 3–4 weeks away, so Muse never has a gap.
- **Sound:**
  - Batches 1 and 2 were silent, with a suggested style; business accounts can only use Instagram's commercial sound library.
  - **From batch 3, every Reel has its own original soundtrack** (`score`, see `docs/production.md`), with sound effects on the beats, and Muse keeps that audio.
  - It's ours, so it's never muted or blocked for licensing, and it gives NO-Q one consistent sound.
- **Hero video:** one per batch, 18–22 s, following the creative rules in `docs/production.md` (from `/brag-slim`). Put it first or last in the batch.
  - Good moments for a hero: a feature launch, the season's opening, a year-end recap.
  - The first hero, "You're #23 in line. Not anymore.", is ready in `production/hero/noq-launch.js`. It's a strong opener for batch 3.
- **Captions:**
  - The first line is the hook.
  - Short paragraphs, one call to action (`no-q.ca`, "save this", "send this to…", "tag a vendor").
  - Emoji used sparingly.
  - Base tags plus 3–4 specific tags.
- **Alt text:** one line per image, saying what's on screen plus the headline.

## Trend research (every batch)

- **Search** (2–3 searches) for:
  - "Instagram Reels trends <month year>"
  - Instagram algorithm news for the current year
  - seasonal and holiday content for small businesses in that month
  - Calgary events in the window, for seasonal context only. Never feature real events.
- **Prefer** sources from the last 30 days. Record each source's name and URL in `data/batch-N.json` (`sources`).
- **Write one trend card per format you use**, with `name`, `why` and `used_in`. The site shows them under "Trends this batch rides".
- **Treat third-party trend trackers as weekly-changing data**, and say so (`sources_note`).
- **Platform facts as of late 2026** (re-check them each batch):
  - Shares and DM sends weigh heavily for reach to non-followers.
  - Instagram's April 2026 originality rule limits reach for reposted or unoriginal content, including carousels.
  - Carousels lead on saves.
  - Holiday audio dominates from November 1.

## Batch 1: "One round trip" (Nov 16 – Dec 4, 2026), scheduled

| Date | Audience | Post | Format |
|---|---|---|---|
| Mon Nov 16 | Guests | "Lines are so last year." | Reel 9s, single |
| Wed Nov 18 | Guests | How to skip the line in 4 steps | Reel 15s, carousel of 5 |
| Fri Nov 20 | Guests | "No app. Just your camera." (QR scan) | Reel 9s, single |
| Mon Nov 23 | Vendors | "Vendors, your menu on every phone." (Duo spin and unfold) | Reel 13s, carousel of 4 |
| Wed Nov 25 | Vendors | "Every order, live." | Reel 10s, single |
| Fri Nov 27 | Vendors | "Never sell the plate you don't have." (stock) | Reel 10s, carousel of 3 |
| Mon Nov 30 | Organizers | "One link, every vendor." | Reel 12s, carousel of 4 |
| Wed Dec 2 | Organizers | "Know your busiest hour." (illustrative) | Reel 10s, single |
| Fri Dec 4 | Everyone | "One event. One round trip." | Reel 15s, carousel of 6 |

Batch 1 was first published with #YEG/#Edmonton on Nov 16 and Nov 18; the user was told to change them to #YYC/#Calgary in the scheduler.

## Batch 2: "Winter markets to 2027" (Dec 7 – 30, 2026), to schedule

| Date | Audience | Post | Trend used |
|---|---|---|---|
| Mon Dec 7 | Guests | Winter market, two ways (−18° line vs fire pit) | Split-screen comparison |
| Wed Dec 9 | Guests | "pov: it's −22° in calgary…" | Tiny-text POV, share hook |
| Fri Dec 11 | Guests | Ranking winter market moves, worst to best | Ranking/listicle |
| Mon Dec 14 | Vendors | Holiday rush checklist (stock, alerts, QR, orders) | Saveable carousel |
| Wed Dec 16 | Vendors | Stock that counts itself (12 → 0, Sold out) | Satisfying countdown |
| Fri Dec 18 | Vendors | "Send this to a vendor who's still counting cash at −20°" | "Send this to…" hook |
| Mon Dec 21 | Organizers | Planning a 2027 event? Start here | New-year planning carousel |
| Mon Dec 28 | Organizers | Your event, wrapped (illustrative stats) | Year-end "Wrapped" |
| Wed Dec 30 | Everyone | 2027 resolutions, realistic edition | Resolution meme |

There's no post on Christmas week. The Dec 14 and Dec 16 posts depend on inventory being live for vendors.

## Special events (holidays), rolling

The special-events batch lives in `production/special/holidays.js`. That one file holds the content and renders the stills, the Reels and `data/special-2026-27.json`. It publishes to `site/batches/special-2026-27/` and shows as the **Special events** tab.

Muse schedules each post when its `schedule_from` date arrives, so the batch can hold a whole year. When the year runs out, copy the file to `special-2027-28`, roll the dates and refresh the copy.

| Date (post) | Occasion | Audience | Format |
|---|---|---|---|
| Fri Dec 25, 2026 | Christmas Day | Everyone | Reel + still |
| Fri Jan 1, 2027 | New Year's Day | Everyone | Reel + still |
| Fri Feb 12, 2027 | Family Day weekend (Alberta, Mon Feb 15) | Guests | Reel + still |
| Fri Mar 26, 2027 | Easter long weekend (Good Friday) | Everyone | Reel + still |
| Fri May 21, 2027 | Victoria Day weekend (Mon May 24) | Vendors | Reel + still |
| Tue Jun 15, 2027 | Canada Day lead-up | Organizers | Reel + still |
| Thu Jul 1, 2027 | Canada Day | Everyone | Reel + still |
| Fri Jul 30, 2027 | Heritage Day weekend (Alberta, Mon Aug 2) | Guests | Reel + still |
| Mon Sep 6, 2027 | Labour Day | Everyone | Reel + still |
| Thu Sep 30, 2027 | National Day for Truth and Reconciliation | Everyone | **Still only** |
| Mon Oct 11, 2027 | Thanksgiving | Everyone | Reel + still |
| Fri Oct 29, 2027 | Halloween weekend | Guests | Reel + still |
| Thu Nov 11, 2027 | Remembrance Day | Everyone | **Still only** |

**Rules for holiday posts:**
- **Canada has no "Independence Day".** The national holiday is **Canada Day, July 1**. Federal statutory holidays are New Year's Day, Good Friday, Victoria Day, Canada Day, Labour Day, the National Day for Truth and Reconciliation, Thanksgiving, Remembrance Day and Christmas (plus Boxing Day and Easter Monday for federal workers). Alberta adds Family Day (third Monday in February) and Heritage Day (first Monday in August). Check every date with a calendar.
- **Long weekends:** post on the Friday before, so the post is useful (plans, markets). Post on the day itself only for greetings (Canada Day, Christmas, New Year's).
- **Solemn days get one quiet still**: Remembrance Day and the National Day for Truth and Reconciliation.
  - No Reel, no music, no call to action, no product, no NO-Q hashtags (`no_base_tags: true`).
  - Small, muted logo only.
  - **No poppy:** the Royal Canadian Legion holds it as a trademark in Canada.
  - **No "Every Child Matters" slogan or orange-shirt imagery:** the Orange Shirt Society holds the slogan. Use plain words, and point to the National Centre for Truth and Reconciliation (nctr.ca).
- **Celebration posts** are about gratitude and the occasion first and NO-Q second. Product mentions stay light and true: "one QR code, every vendor". No discounts or offers unless the user confirms them.
- **Cultural holidays** (Halloween) are fine for playful posts. Keep religious holidays (Easter) neutral, e.g. "Easter long weekend".

## Ideas for batch 3 (from Jan 4, 2027)

Pick from these, after fresh trend research:
- **Guests:** "Chinook day plans" or warm-up season; "what's actually in a −25° festival survival kit" (rank or list, ending with NO-Q); "date night at a winter festival, two ways"; a Family Day weekend (Mon Feb 15, 2027) teaser.
- **Vendors:**
  - "Plan your 2027 market season" checklist
  - "Your storefront QR, 3 places to put it" (table, A-frame, menu board)
  - "Every order, live" in winter dress
  - a POS/kitchen display explainer (Square)
- **Organizers:**
  - a "What 2027 events will need" carousel
  - "Invite 18 vendors in one link" speed-run Reel
  - Valentine's or Galentine's pop-up market planning (Feb 13–14, 2027)
- **Formats to try:** "day in the life" of an order (POV following order IG-2047 from scan to pickup), "Sketch to reality" (event layout sketch → live map of vendors), "this or that" polls in the caption, and a carousel quiz.
- **Reuse** the iPhone Duo spin and unfold once per batch. It's the most distinctive shot.
