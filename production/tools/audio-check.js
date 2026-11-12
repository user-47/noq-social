// Checks a scored video (or WAV) without listening: prints duration, streams and loudness, and writes a
// waveform + spectrogram image so you can see the structure (quiet intro, the drop, hits on the beat, the ring-out).
//   node tools/audio-check.js out/hero/hero-noq-launch.mp4   -> out/review/<name>-audio.png
const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const file = process.argv[2];
if (!file) throw new Error("usage: node tools/audio-check.js <video.mp4|audio.wav>");
const info = spawnSync(ffmpeg, ["-hide_banner", "-i", file, "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const pick = (re) => (info.match(re) || [])[1];
console.log("duration     ", pick(/Duration: ([\d:.]+)/));
for (const s of (info.split("Stream mapping")[0].match(/Stream #.*$/gm) || [])) console.log("stream       ", s.replace(/^Stream #\S+\s*/, "").slice(0, 110));
console.log("loudness     ", pick(/ I:\s+(-?[\d.]+ LUFS)/), "(target about -14 LUFS)");
console.log("true peak    ", pick(/Peak:\s+(-?[\d.]+ dBFS)/));

const out = path.join(__dirname, "..", "out", "review", `${path.basename(file, path.extname(file))}-audio.png`);
fs.mkdirSync(path.dirname(out), { recursive: true });
const r = spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-i", file, "-filter_complex", "[0:a]showwavespic=s=2000x300:colors=0xcef24e[w];[0:a]showspectrumpic=s=2000x500:legend=0:scale=log[s];[w][s]vstack", "-frames:v", "1", out]);
if (r.status !== 0) throw new Error("ffmpeg failed: " + r.stderr);
console.log("picture      ", out);
