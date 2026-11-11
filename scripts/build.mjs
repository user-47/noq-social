// Builds the machine-readable files for the site from data/batch-*.json. No dependencies: `node scripts/build.mjs`.
// Writes, for each batch:  site/batches/batch-N/plan.json, captions.csv, zips/<id>-stills.zip (carousels)
// and for the whole site:  site/feed.json (every batch and post, newest batch first, absolute URLs).
// Fails if any referenced media file is missing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const BASE = config.base_url.replace(/\/$/, "");

// ---- minimal stored .zip writer (PNGs are already compressed) ----
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function zip(files) {
    const parts = [], central = [];
    let offset = 0;
    for (const f of files) {
        const name = Buffer.from(f.name), data = f.data, crc = crc32(data);
        const h = Buffer.alloc(30);
        h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt32LE(crc, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(name.length, 26);
        parts.push(h, name, data);
        const c = Buffer.alloc(46);
        c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(name.length, 28); c.writeUInt32LE(offset, 42);
        central.push(c, name);
        offset += 30 + name.length + data.length;
    }
    const size = central.reduce((s, b) => s + b.length, 0);
    const e = Buffer.alloc(22);
    e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(files.length, 8); e.writeUInt16LE(files.length, 10); e.writeUInt32LE(size, 12); e.writeUInt32LE(offset, 16);
    return Buffer.concat([...parts, ...central, e]);
}

const csvCell = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
const missing = [];
const need = (rel) => { if (!fs.existsSync(path.join(SITE, rel))) missing.push(rel); return rel; };
const abs = (rel) => `${BASE}/${rel.split("/").map(encodeURIComponent).join("/")}`;
// Instagram schedules up to 30 days ahead; one day of margin.
const scheduleFrom = (iso) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() - 29); return d.toISOString().slice(0, 10); };

const batches = fs.readdirSync(path.join(ROOT, "data"))
    .filter((f) => /^batch-\d+\.json$/.test(f))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, "data", f), "utf8")))
    .sort((a, b) => b.batch - a.batch);

const feed = { brand: config.brand, timezone: config.timezone, base_url: BASE, generated_at: new Date().toISOString(),
    how_to: "Each post has absolute URLs for its Reel (primary), cover frame and stills. Schedule a post on or after schedule_from (Instagram's 30-day window), at date + time in the timezone above. Post the caption exactly as given.",
    batches: [] };

for (const b of batches) {
    const dir = `batches/batch-${b.batch}`;
    fs.mkdirSync(path.join(SITE, dir, "zips"), { recursive: true });
    const posts = [];
    const rows = [["date", "time", "schedule_from", "audience", "format", "reel_url", "cover_url", "stills_urls", "stills_zip_url", "sound_suggestion", "trend", "caption", "alt_text"]];
    for (const w of b.weeks) for (const p of w.posts) {
        const stillNames = Array.from({ length: p.slides }, (_, i) => (p.slides > 1 ? `${p.id}-${i + 1}` : p.id));
        const reel = need(`${dir}/reels/${p.id}.mp4`), cover = need(`${dir}/reels/${p.id}-cover.jpg`);
        const stills = stillNames.map((n) => need(`${dir}/full/${n}.png`));
        stillNames.forEach((n) => need(`${dir}/img/${n}.jpg`));
        let stillsZip = null;
        if (p.slides > 1 && stills.every((s) => fs.existsSync(path.join(SITE, s)))) {
            stillsZip = `${dir}/zips/${p.id}-stills.zip`;
            fs.writeFileSync(path.join(SITE, stillsZip), zip(stills.map((s, i) => ({ name: `noq-${p.id}-${i + 1}.png`, data: fs.readFileSync(path.join(SITE, s)) }))));
        }
        const caption = `${p.caption}\n\n${b.base_tags} ${p.tags}`.trim();
        const post = {
            id: p.id, batch: b.batch, week: w.title, day: p.day, date: p.iso, time: p.time, schedule_from: scheduleFrom(p.iso),
            audience: p.audience, format: p.format, trend: p.trend ?? null, sound_suggestion: p.sound ?? null,
            reel: { url: abs(reel), path: reel, seconds: p.reel, cover_url: abs(cover), cover_path: cover },
            stills: stills.map((s) => ({ url: abs(s), path: s })), stills_zip_url: stillsZip ? abs(stillsZip) : null,
            caption, alt_text: p.alt,
        };
        posts.push(post);
        rows.push([post.date, post.time, post.schedule_from, post.audience, post.format, post.reel.url, post.reel.cover_url, post.stills.map((s) => s.url).join(" | "), post.stills_zip_url, post.sound_suggestion, post.trend, caption, p.alt.join(" | ")]);
    }
    const plan = { batch: b.batch, title: b.title, dates: b.dates, status: b.status, brand: config.brand, timezone: config.timezone, plan_url: abs(`${dir}/plan.json`), posts };
    fs.writeFileSync(path.join(SITE, dir, "plan.json"), JSON.stringify(plan, null, 2));
    fs.writeFileSync(path.join(SITE, dir, "captions.csv"), "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n"));
    feed.batches.push({ batch: b.batch, title: b.title, dates: b.dates, status: b.status, summary: b.summary, trends: b.trends ?? [], sources: b.sources ?? [], sources_note: b.sources_note ?? null, notes: b.notes ?? [],
        plan_url: plan.plan_url, captions_csv_url: abs(`${dir}/captions.csv`), weeks: b.weeks.map((w) => ({ title: w.title, sub: w.sub, posts: w.posts.map((p) => p.id) })), posts });
}

if (missing.length) { console.error("Missing files:\n  " + missing.join("\n  ")); process.exit(1); }
fs.writeFileSync(path.join(SITE, "feed.json"), JSON.stringify(feed, null, 2));
console.log(`feed.json: ${feed.batches.length} batches, ${feed.batches.reduce((n, b) => n + b.posts.length, 0)} posts, base ${BASE}`);
