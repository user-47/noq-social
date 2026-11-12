# Production pipeline (`production/`)

Everything is HTML and CSS rendered by Playwright (Chromium). Stills are screenshots. Reels are CSS animations stepped frame by frame and piped to ffmpeg. There are no design tools, no After Effects and no AI image generation.

## Setup

```
cd production
npm install                       # playwright 1.52.0, ffmpeg-static 5.2.0, qrcode 1.5.4
npx playwright install chromium   # once per machine
```

Fonts (Space Grotesk and Inter) load from Google Fonts, so rendering needs an internet connection.

## Layout

```
production/
  assets/screens/   real app screenshots with demo data (see docs/brand.md)
  assets/brand/     official logos
  assets/photos/    the only allowed photos
  assets/qr.svg     real, scannable QR pointing to https://no-q.ca
  lib/stills-kit.js 4:5 stills: brand tokens, screens (S, D, P), iphone(), duo(), frame(), h(), sub(), step(), renderStills()
  lib/reel-kit.js   Reels: iphone(), duo() with spin and unfold, words(), layer(), anim(), endCard(), render(), stills()
                    (render() also takes reel.score for a soundtrack, reel.poster for frame 0, and reel.css for extra rules)
  lib/soundtrack.js original music + SFX generator (pure Node), used through reel.score
  hero/             hero video templates (noq-launch.js: the 20s launch video with soundtrack)
  batch-1/          stills.js and reels.js for batch 1 (Nov 16 – Dec 4, 2026)
  batch-2/          stills.js and reels.js for batch 2 (Dec 7 – 30, 2026); start new batches from these
  tools/            previews.js (full PNG to 720×900 JPEG), montage.js (contact sheet for review),
                    audio-check.js (loudness, streams, waveform and spectrogram picture of a scored video)
  capture/          story.js, story-data.js and story-api.js: re-capture app screens (see below)
  out/              review frames and captures (git-ignored)
```

The batch scripts write straight into `site/batches/batch-N/`:
- stills: `full/<id>.png`, or `<id>-1.png` … `<id>-N.png` for carousels
- Reels: `reels/<id>.mp4` and `<id>-cover.jpg`

Re-running a batch script reproduces its files byte for byte.

## Stills: `lib/stills-kit.js`

A batch's `stills.js` defines `const posts = [{ id, slides: [html, …] }]` and calls `renderStills(posts, N)`. Each slide is usually built with `frame()`:

```js
frame({
  tag: "guests" | "vendors" | "organizers" | "all",  // audience tag, top right
  page: "2/5",                                        // carousel pager (omit for single images)
  bg: "lime",                                         // lime cover slide (default is dark)
  glow: "50% 80%",                                    // where the lime glow sits
  body: `${h("Headline", 84)}${sub("Supporting line")} ${iphone(S.menu, { w: 420, finish: "glacier", style: "position:absolute;…" })}`,
})
```

- **Screens:**
  - `S.event`, `S.menu`, `S.product`, `S.checkout`, `S.confirmed` are phone screens. Each is `{img, band, ink}`, the status-bar colours.
  - `D.menu`, `D.store`, `D.orders`, `D.invites`, `D.eventQr`, `D.roster`, `D.insights` are wide screens for the Duo.
  - `P.festival`, `P.tent`, `P.banner` are the photos.
- **`iphone(screen, {w, finish, style})`:** the iPhone 18 Pro mockup. Finishes: `deepBlack`, `glacier`, `silver`, `burgundy`, `starWhite`, `nightSky`.
- **`duo(img, {w, finish, style})`:** the unfolded iPhone Duo, with its centre crease.
- **`h(text, size)`, `sub(text)`, `step(n)`:** heading, sub-line, and a lime number disc.
- **Batch 2 helpers** (inside `batch-2/stills.js`; copy them if you need them):
  - `snow` (static snowfall)
  - `temp("−18°C")` (ice-blue chip)
  - `card()`, `person()`, `rank(n)`, `verdict()`
  - `stockRow(name, n, "low"|"sold")` (inventory row)
  - `wrapCard(bg, fg, kicker, big, small, page)` ("Wrapped" stat card)

## Reels: `lib/reel-kit.js`

A Reel is `{ id, dur, cover, body }`:
- `dur` is the length in seconds (8–15).
- `cover` is the time of the frame saved as `<id>-cover.jpg`. Choose a frame with the headline readable inside the 3:4 crop.
- `body` is HTML positioned absolutely in a 1080 × 1920 stage.

**How rendering works:** `render()` loads the page, waits for fonts and images, then pauses every animation (`document.getAnimations()`). For each frame at 30 fps it sets `currentTime`, screenshots a JPEG, and pipes it to ffmpeg:

```
libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -movflags +faststart
```

So motion is frame-exact and repeatable. A Reel takes about 35–45 s to render.

**Building blocks:**
- **`words("Lines / are so / *last* *year.*", t0, {stagger, dur, strike: ["Lines"]})`:** word-by-word mask reveal. `/` breaks the line, `*word*` turns a word lime, and `strike` sweeps a lime line through the listed words.
- **`layer(innerHtml, {style, exit, enter})`:** a positioned wrapper.
  - `exit` is the time the layer fades up and out.
  - `enter` is the entry animation's CSS.
  - Entry and exit sit on separate nested wrappers so their transforms don't conflict.
- **`anim(name, dur, t, ease)`:** returns `animation: name dur ease t both`.
  - Keyframes in the kit: `up`, `fadeIn`, `fadeOut`, `out`, `outLeft`, `inRight`, `riseIn`, `popIn`, `phoneUp` (uses `--r0`/`--r1` rotation vars), `sweep`, `kb` (Ken Burns), `drift`, `duoSpin`, `unfold`, `duoTilt`, `duoIn`, `ripple`, `scan`, `flash`, `pulse`, `grow`, `show`, `hide`, `spin`, `draw`, `light`.
  - Easing vars: `--out`, `--in`, `--io`, `--spring`.
- **`iphone(screen, {w, finish, overlay, layers:[{img, t}]})`:** `layers` cross-fade to other screens at time `t`; `overlay` is HTML placed over the screen (taps, rings).
- **`duo({img, w, finish:"starWhite", t, dur:1.25, layers, overlay, cover, spin, spinAt})`:** the signature move. The closed Duo shows its **back** (white glass, two-lens camera plateau, no screen). With `spin: true` it spins 180° to the **cover display** (lock screen, NO-Q order notification, hole-punch camera at top left). Then it unfolds in 3D at `t` while straightening from a tilt.
  - **The spin must finish before `t`.** Batch 1's w2-mon used `spinAt: 1.05, t: 2.15`; batch 2's w5-fri used `spinAt: 2.1, t: 3.2`.
- **`endCard(t0, line, cta = "no-q.ca")`:** logo pop, one line, and a lime pill.
- **Batch 2 helpers** (inside `batch-2/reels.js`):
  - `headline()`, `caption()`
  - `snow` (falling snow)
  - `ticker(values, t0, step, style)` (numbers or timers that swap at fixed times; give the box a `min-width`)
  - `pill()`, `person()`
  - `scene(t, end, html)` (slide in from the right, out to the left)

**Workflow for every Reel:**
1. `node batch-N/reels.js <id> --stills=1,3.5,6,9` writes frames to `out/review/`.
2. Check them with `node tools/montage.js out/sheet.png out/review/<id>@*.jpg`, then look at the sheet.
3. Fix anything you find and repeat.
4. Render with `node batch-N/reels.js <id>`, or `all`.

## Hero videos and sound (from `/brag-slim`)

On Nov 12, 2026 we tested the open-source `/brag` skill (https://github.com/latent-spaces/brag, MIT). On Opus 5.5 it runs as `/brag-slim`: the model builds a short launch video itself, including an **original soundtrack**. We adopted two parts of it:

1. **Sound for every Reel from batch 3 on.** Batches 1 and 2 are silent and stay that way, because they're already live.
2. **One hero video per batch**, built with its creative rules.

The engine is still ours. `/brag-slim` is a set of instructions, not software.

### Adding a soundtrack to any Reel

Give the Reel object a `score`, and optionally a `poster`:

```js
const reel = {
  id: "w8-mon", dur: 12, cover: 3.4,
  poster: 10.6,                 // optional: bake this settled frame in as frame 0 (the thumbnail everywhere)
  score: {                      // lib/soundtrack.js options; dur comes from the Reel
    bpm: 120,                   // beat 0.5s, bar 2s. Put every cut and animation start on this grid.
    drop: 2.0,                  // full groove starts (put it on the first big reveal)
    end: 10.5,                  // final chord hit (put it on the end card's logo pop)
    sfx: [ { t: 2.0, kind: "impact" }, { t: 5.0, kind: "tap" }, { t: 6.5, kind: "ding" }, { t: 8.0, kind: "whoosh" } ],
  },
  body: `…`,
};
```

- `render()` writes the video, then generates `out/audio/<id>.wav` and muxes it in as AAC 192k, loudness-normalised to **−14 LUFS** (true peak about −1 dBFS).
- Without `score`, the output is exactly the silent file it always was. A batch 2 re-render was byte-identical.
- **Music:** 120 BPM, with an A minor / C major progression (Am F C G by default; change it with `chords`). Before `drop`: a filtered pad and hats. After `drop`: kick on every beat, clap on 2 and 4, side-chained bass and pad, and a plucked arpeggio from `arpFrom`. At `end`: a C major hit, then a ring-out and fade.
- **SFX kinds:** `tick` (counters), `tap` (UI taps), `click` (status changes), `chime` (success), `ding` (notification), `whoosh` (ends at `t`; put it on cuts), `riser` (from `t` for `len`), `impact` (the drop), `sweep` (things clearing away), `note` (a single pitched pluck).
  - They're tuned to the key and share the music's echo, so they sit inside the track instead of on top of it.
- **You can't listen, so check the audio as a picture.** Run `node tools/audio-check.js <file.mp4>`. It prints the duration, streams, loudness and true peak, and writes a waveform and spectrogram to `out/review/`. Confirm:
  - the intro is quieter
  - the drop lands where you put it
  - kicks fall on the beats
  - the final hit and ring-out are there
  - loudness is about −14 LUFS
- **Captions and Muse:** for a Reel with a soundtrack, set the data file's `sound` to `"Original soundtrack: keep the Reel's audio"`. Muse must not add an Instagram sound on top. See `docs/delivery.md`.

### Hero video: one per batch

The template is `production/hero/noq-launch.js`, a 20 s, 9:16 launch video: "You're #23 in line. Not anymore." → logo and site headline → guests → vendors → organizers → "Enjoy the event, not the line."

```
node hero/noq-launch.js --stills=1.2,2.6,4.5,9.5,12.6,14.7,19.3
node hero/noq-launch.js
node tools/audio-check.js out/hero/hero-noq-launch.mp4
```

It writes `out/hero/hero-noq-launch.mp4` and its cover. To publish a hero in a batch, copy the file into `production/batch-N/`, make it one of the batch's 9 posts (usually the first or last of the batch), point its output at `site/batches/batch-N/reels/`, and give it 1–2 key frames as stills.

**Creative rules for heroes** (from `/brag-slim`; good for every Reel):
- **Short:** 15–25 s, ideally 18–22.
- **Shape:** hook (2–4 s) → reveal (2–3 s) → 2–3 sharp highlights → punchline and end card (2–4 s). A starting shape, not a template.
- **The hook is everything.** Plan the first 2 seconds first. Give it a number, a tension or a question ("You're #23 in line.").
- **Clear to a stranger.** After one viewing, someone should know what NO-Q is, who it's for and how to get it.
- **Show the thing.** Use the real app screens doing their job, with taps, notifications and status changes. No abstract filler.
- **Specific.** Use NO-Q's own website copy and claims. No generic SaaS lines ("streamline your workflow" is banned).
- **Readable.** Keep the pace with motion and cuts, never by pulling text away early. A line stays fully visible for about 0.3 s per word after it has finished animating in.
- **Every cut on a beat** (0.5 s at 120 BPM). Sound effects land on the same grid as the cuts.
- **Transitions:**
  - A plain crossfade between two busy layouts makes a muddy double exposure. Stagger it (old out, then new in) or dip through dark.
  - The template's Duo swap dips to dark at 14.15–14.85 s and switches screens while dark.
  - Review mid-transition frames, not just settled ones.
- **Every frame postable.** Bake the strongest settled frame in as frame 0 with `poster`.
- **Tones** to try:
  - `default` (punchy, playful)
  - `polished` (3–4 scenes, long holds)
  - `yc-parody` (deadpan startup launch, hard cuts)
  - `cinematic` (trailer-scale)
  - `app-store` (clean feature cards)
  - `deadpan`, `chaotic`
- **Formats:** vertical 1080 × 1920 is our default. The same scenes can be laid out as square 1080 × 1080 (feed) or landscape 1920 × 1080 (LinkedIn, X, YouTube). That needs a second layout, because positions are absolute.

**Licensing:** our soundtracks are synthesised from scratch in `lib/soundtrack.js`, so we own them and they need no credit. The full `/brag` (with Hyperframes) bundles tracks by Sascha Ende under CC BY 4.0. If you ever use those, every post must credit "Music: Sascha Ende, ende.app (CC BY 4.0)". We don't use them.

## Device reference

- **iPhone 18 Pro:**
  - Body 71.9 × 150.0 mm (width-to-height 0.479); 6.3″ screen at 2622 × 1206.
  - Outer corner radius about 18% of the width; a Dynamic Island pill about 31% of the screen width.
  - Action button and volume buttons on the left; power and a flush Camera Control on the right.
- **iPhone Duo** (book-style foldable, drawn from Apple reference photos):
  - Unfolded: 164.6 × 117.8 mm, with a soft centre crease and a polished silver frame.
  - Closed, it has two different outer faces:
    1. **The back:** white glass with a horizontal camera plateau holding two large lenses, a flash and a mic, toward the edge away from the hinge. **No screen, no logo.**
    2. **The cover display:** a full screen with a hole-punch camera in the top corner away from the hinge.
- **No Apple logo** anywhere.

## Re-capturing app screens (`capture/`)

Only needed if the apps change or you need a new screen. You run the three apps locally and fake every API call, so demo data never reaches a real backend.

| App | Run it | Faking the API |
|---|---|---|
| Vendor | `npm run dev -- --port 3000` in the frontend repo | It calls `https://api-services-staging.no-q.ca/api/...`. Intercept `/no-q\.c[a-z]*\//` with `page.route` and **strip the `/api` prefix** before matching (`u.pathname.replace(/^\/api(?=\/)/, "")`). Session: localStorage `noqUser` = `{id, first_name, email, token:"demo"}`. |
| Guest | `NEXT_PUBLIC_API_STAGING_URL=http://localhost:4010 npx next dev -p 3100` | Run the mock server `node capture/story-api.js` on port 4010, because the store page loads on the server. Cart: localStorage `allCarts`; order: sessionStorage `order`. Hide Next's dev overlay with `nextjs-portal{display:none!important}`. |
| Organizer | `PORT=3200 BROWSER=none REACT_APP_API_BASE_URL=http://api.noq.test REACT_APP_CLIENT_TOKEN=demo npx react-scripts start` | Intercept `http://api.noq.test/**`. Session: localStorage `noqEventUser` = `{token:"demo"}`. |

Then run `OUTDIR=social PHONE=402x820 DESK=1200x820 DESK_SCALE=2 node capture/story.js`. Output goes to `out/capture/social/`. Review it and copy the screens you need into `assets/screens/`.

- **Endpoint notes:**
  - Responses are `{success:true, data, meta:{current_page,last_page,total}}`.
  - The vendor orders status filter is comma-separated (`status=in_queue,processing`).
  - `connect_account.account_status:"verified"` hides the payout banner.
- **Paths to the product repos:** set `NOQ_FRONTEND_ASSETS` and `NOQ_CUSTOMER_PUBLIC` if they differ from the defaults in the scripts.

**Patching a screenshot:** we did this once, when Edmonton details had to become Calgary. Load the PNG in Playwright, cover the old text with a box in the sampled background colour (for example `rgb(17,19,17)`), and draw the new text in Inter at the same size and position. Then crop the before and after side by side and compare them. Re-capturing is better when the apps are available.

## Gotchas (all hit before)

- Exit or hide animations need fill-mode **`forwards`**, not `both`. With `both`, they apply before their start time and hide or stack things wrongly.
- Put entry and exit on **separate wrappers**. Otherwise a toast left a white box behind after it exited.
- A ticker or counter made of absolutely positioned spans needs a **`min-width`**, or the label next to it overlaps.
- **Cover frames** must show the headline. Batch 2's w5-mon cover was empty at 1.2 s, so it was re-taken from the finished MP4 at 8.4 s:

  ```
  ffmpeg -ss 8.4 -i reels/w5-mon.mp4 -frames:v 1 -q:v 2 reels/w5-mon-cover.jpg
  ```

  The ffmpeg binary path is `require("ffmpeg-static")`.
- **Copy must match the screens.** `c3-guest-product` shows "Only 4 left", so a post about it says 4, not 3.
- **Duo off-centre:** the tilt keyframe uses `--hw` (a quarter of the width). The sign matters.
- **Rear face never visible:** if the spin overlaps the entry animation, you never see the back. Start the spin after the device has landed.
- **Shell heredocs mangle regexes, backslashes and template literals.** Write scripts as files and edit them with a file-editing tool.
- **`fetch()` doesn't work from `file://` pages.** Test the site through a local HTTP server.
- **Business Instagram accounts can only use sounds from the commercial library.** Batches 1 and 2 were exported silent, with a suggested sound style. From batch 3, Reels carry their own original soundtrack (`score`), which avoids the library limits.
