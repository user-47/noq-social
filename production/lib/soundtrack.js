// Original soundtrack + sound effects for Reels and hero videos. Pure Node, no dependencies.
// Adapted from the /brag-slim workflow (github.com/latent-spaces/brag, MIT): music and SFX are written as one
// piece, in one key, on one beat grid counted from frame 0, and mixed so effects sit softly under the music.
//
//   const { writeScore } = require("../lib/soundtrack");
//   writeScore({ dur: 12, drop: 2, end: 10.5, sfx: [{ t: 2, kind: "impact" }, { t: 5, kind: "ding" }] }, "out/audio/w8-mon.wav");
//
// Score options (all times in seconds):
//   dur        total length (match the Reel's dur)
//   bpm        tempo, default 120 (beat 0.5s, bar 2s). Put every cut and SFX on this grid.
//   chords     triads per bar, MIDI numbers; repeats if shorter than the piece. Default Am F C G (A minor / C major).
//   drop       when the full groove starts (kick, clap, bass, arpeggio). Before it: filtered pad, hats, SFX only.
//   arpFrom    when the plucked arpeggio joins (default drop + 2)
//   end        final chord hit (usually the logo / end card); the groove stops and the chord rings out
//   fadeOut    seconds of fade at the very end (default 1)
//   sfx        [{ t, kind, note?, gain? }], kinds:
//                tick (tiny pluck, for counters), tap (UI tap), click (status change), chime (success, two notes),
//                ding (notification, two notes), whoosh (swell ending at t; put it on cuts), riser (from t to t+len),
//                impact (sub boom + noise burst; use on the drop), sweep (noise falling away from t)
// The mix is soft-clipped and peak-normalised to -1 dBFS; mux.js then loudness-normalises the final MP4 to -14 LUFS.
const fs = require("fs");
const path = require("path");

const SR = 44100;
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const DEFAULT_CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // Am F C G
const PENT = [69, 72, 74, 76, 79, 81, 84]; // A minor pentatonic, for ticks

function score(opts) {
    const { dur, bpm = 120, chords = DEFAULT_CHORDS, drop = 2, end = dur - 1.5, fadeOut = 1, sfx = [] } = opts;
    const arpFrom = opts.arpFrom ?? drop + 2;
    const BEAT = 60 / bpm, BAR = BEAT * 4, N = Math.round(SR * dur);
    const L = new Float32Array(N), R = new Float32Array(N);
    let seed = 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

    const kicks = [];
    for (let t = drop; t < end - 1e-6; t += BEAT) kicks.push(t);
    const duck = (t) => { let g = 1; for (const k of kicks) { const d = t - k; if (d >= 0 && d < 0.3) g = Math.min(g, 0.35 + 0.65 * (d / 0.3)); } return g; };
    const add = (t0, buf, gain = 1, pan = 0, sidechain = false) => {
        const s = Math.round(t0 * SR), gl = gain * Math.cos(((pan + 1) * Math.PI) / 4), gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
        for (let i = 0; i < buf.length; i++) { const j = s + i; if (j < 0 || j >= N) continue; const d = sidechain ? duck(j / SR) : 1; L[j] += buf[i] * gl * d; R[j] += buf[i] * gr * d; }
    };
    const lp = (buf, cutoff) => { const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR); let y = 0; for (let i = 0; i < buf.length; i++) { y += a * (buf[i] - y); buf[i] = y; } return buf; };
    const hpf = (buf, cutoff) => { const low = lp(Float32Array.from(buf), cutoff); for (let i = 0; i < buf.length; i++) buf[i] -= low[i]; return buf; };
    const saw = (f, t) => { let v = 0; for (let k = 1; k <= 8; k++) v += Math.sin(2 * Math.PI * f * k * t) / k; return v * 0.6; };

    // ---- instruments ----
    const kick = () => { const n = SR * 0.4, b = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR, f = 48 + 110 * Math.exp(-t * 28); ph += (2 * Math.PI * f) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 7) + (i < 60 ? rnd() * 0.25 * (1 - i / 60) : 0); } return b; };
    const clap = () => { const n = SR * 0.25, b = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / SR; const burst = t < 0.01 || (t > 0.012 && t < 0.02) || t > 0.024 ? 1 : 0.3; b[i] = rnd() * Math.exp(-t * 22) * burst; } return lp(hpf(b, 900), 6000); };
    const hat = (open) => { const n = Math.round(SR * (open ? 0.2 : 0.06)), b = new Float32Array(n); for (let i = 0; i < n; i++) b[i] = rnd() * Math.exp(-(i / SR) * (open ? 18 : 70)); return hpf(b, 7000); };
    const bassNote = (midi, len) => { const n = Math.round(SR * len), b = new Float32Array(n), f = hz(midi); for (let i = 0; i < n; i++) { const t = i / SR; const env = Math.min(1, t / 0.005) * Math.exp(-t * 3.2); b[i] = (Math.sin(2 * Math.PI * f * t) * 0.8 + saw(f, t) * 0.35) * env; } return lp(b, 900); };
    const padChord = (notes, len) => { const n = Math.round(SR * len), b = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / SR; const env = Math.min(1, t / 0.25) * Math.min(1, (len - t) / 0.3); let v = 0; for (const m of notes) { const f = hz(m); v += saw(f * 1.003, t) + saw(f * 0.997, t); } b[i] = (v * env) / notes.length; } return lp(b, 1800); };
    const pluck = (midi, len = 0.35, bright = 1) => { const n = Math.round(SR * len), b = new Float32Array(n), f = hz(midi); for (let i = 0; i < n; i++) { const t = i / SR; const env = Math.min(1, t / 0.002) * Math.exp(-t * 9); b[i] = (Math.sin(2 * Math.PI * f * t) + 0.35 * bright * Math.sin(4 * Math.PI * f * t) + 0.12 * bright * Math.sin(6 * Math.PI * f * t)) * env; } return b; };
    const swell = (len, f0, f1, rise) => { const n = Math.round(SR * len), b = new Float32Array(n); let y = 0; for (let i = 0; i < n; i++) { const p = i / n, f = f0 + (f1 - f0) * p, a = 1 - Math.exp((-2 * Math.PI * f) / SR); y += a * (rnd() - y); b[i] = y * (rise ? p * p : (1 - p) * (1 - p)); } return b; };
    const boom = () => { const n = SR * 1.2, b = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR, f = 38 + 60 * Math.exp(-t * 10); ph += (2 * Math.PI * f) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 3); } return b; };
    const echo = (t0, buf, gain, pan) => { add(t0, buf, gain, pan); add(t0 + BEAT * 0.75, buf, gain * 0.32, -pan * 0.8 - 0.3); add(t0 + BEAT * 1.5, buf, gain * 0.12, pan * 0.6 + 0.3); };

    // ---- arrangement ----
    const bars = Math.ceil(dur / BAR);
    for (let bar = 0; bar < bars; bar++) {
        const t0 = bar * BAR, chord = chords[bar % chords.length], root = chord[0] - 12;
        if (t0 >= end) break;
        const groove = t0 + 1e-6 >= drop && t0 < end;
        const padLen = Math.min(BAR + 0.1, end - t0 + 0.05);
        const pad = padChord(chord.map((m) => m + 12), padLen);
        if (!groove) lp(pad, 700);
        add(t0, pad, groove ? 0.13 : 0.3, 0, groove);
        for (let k = 0; k < 8; k++) { const t = t0 + (k * BEAT) / 2; if (t >= end) break; add(t, hat(groove && k % 4 === 3), groove ? 0.09 : 0.06, k % 2 ? 0.25 : -0.25); }
        if (!groove) continue;
        for (let k = 0; k < 4; k++) { const t = t0 + k * BEAT; if (t >= end) break; add(t, kick(), 0.85); if (k % 2) add(t, clap(), 0.32, 0.1); }
        for (let k = 1; k < 8; k += 2) { const t = t0 + (k * BEAT) / 2; if (t >= end) break; add(t, bassNote(root + (k === 7 ? 12 : 0), 0.24), 0.42, 0, true); }
        if (t0 + 1e-6 >= arpFrom) {
            const arp = [chord[0], chord[1], chord[2], chord[1] + 12, chord[2], chord[1], chord[0] + 12, chord[2]];
            arp.forEach((m, k) => { const t = t0 + (k * BEAT) / 2; if (t < end) echo(t, pluck(m + 12, 0.3), 0.075, k % 2 ? 0.35 : -0.35); });
        }
    }
    // Final hit on the end card: resolve to C major and let it ring.
    const ring = Math.max(0.5, dur - end);
    add(end, kick(), 0.9); add(end, boom(), 0.5);
    add(end, padChord([60, 64, 67, 72], ring), 0.16);
    [60, 64, 67, 72].forEach((m, i) => echo(end + i * 0.06, pluck(m + 12, 1.4, 0.7), 0.07, (i - 1.5) * 0.3));

    // ---- SFX ----
    let tickN = 0;
    for (const s of sfx) {
        const g = s.gain ?? 1;
        switch (s.kind) {
            case "tick": add(s.t, pluck(s.note ?? PENT[tickN++ % PENT.length] + 12, 0.08, 0.3), 0.06 * g, tickN % 2 ? 0.3 : -0.3); break;
            case "tap": echo(s.t, pluck(s.note ?? 84, 0.12, 0.2), 0.05 * g, 0.2); break;
            case "click": echo(s.t, pluck(s.note ?? 84, 0.15, 0.3), 0.05 * g, 0); break;
            case "chime": echo(s.t, pluck(84, 0.8, 0.5), 0.07 * g, -0.1); echo(s.t + 0.12, pluck(91, 0.9, 0.5), 0.06 * g, 0.1); break;
            case "ding": echo(s.t, pluck(79, 0.7, 0.4), 0.08 * g, 0.15); echo(s.t + 0.12, pluck(84, 0.9, 0.4), 0.08 * g, 0.15); break;
            case "whoosh": add(s.t - 0.35, swell(0.35, 800, 5000, true), 0.045 * g); break;
            case "riser": add(s.t, swell(s.len ?? 1, 300, 7000, true), 0.12 * g); break;
            case "impact": add(s.t, boom(), 0.55 * g); add(s.t, lp(swell(0.8, 9000, 2000, false), 5000), 0.1 * g); break;
            case "sweep": add(s.t, swell(s.len ?? 0.3, 6000, 1200, false), 0.05 * g); break;
            case "note": echo(s.t, pluck(s.note, s.len ?? 0.5, 0.6), 0.08 * g, 0); break;
            default: throw new Error(`unknown sfx kind: ${s.kind}`);
        }
    }

    // ---- master ----
    hpf(L, 25); hpf(R, 25);
    const fadeStart = dur - fadeOut;
    let peak = 0;
    for (let i = 0; i < N; i++) {
        const t = i / SR, f = t > fadeStart ? Math.max(0, 1 - (t - fadeStart) / fadeOut) : 1;
        L[i] = (Math.tanh(L[i] * 1.3) / Math.tanh(1.3)) * f; R[i] = (Math.tanh(R[i] * 1.3) / Math.tanh(1.3)) * f;
        peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
    }
    const norm = peak > 0 ? 0.89 / peak : 1;
    const out = Buffer.alloc(44 + N * 4);
    out.write("RIFF", 0); out.writeUInt32LE(36 + N * 4, 4); out.write("WAVE", 8); out.write("fmt ", 12);
    out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
    out.write("data", 36); out.writeUInt32LE(N * 4, 40);
    for (let i = 0; i < N; i++) { out.writeInt16LE(Math.round(L[i] * norm * 32767), 44 + i * 4); out.writeInt16LE(Math.round(R[i] * norm * 32767), 46 + i * 4); }
    return out;
}

function writeScore(opts, file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, score(opts));
    return file;
}

module.exports = { score, writeScore, DEFAULT_CHORDS };
