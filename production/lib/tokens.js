// NO-Q design tokens for the render scripts. Source of truth: the NO-Q Design System
// (https://claude.ai/artifact/RJDHQyRQyCH5ruC3Gfpfqr), mirrored in ../../brand/tokens.json.
// Update brand/tokens.json from the design system, never edit colours in a script.
const fs = require("fs");
const path = require("path");

const TOKENS = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "brand", "tokens.json"), "utf8"));
const byName = Object.fromEntries(TOKENS.color.tokens.map((t) => [t.name, t.value]));

// color("ink") -> Dark value; color("ink", "light") -> Light value. Aliases ("{lime}") resolve.
function color(name, theme = "dark") {
    let v = byName[name];
    if (v === undefined) throw new Error(`Unknown colour token: ${name}`);
    if (typeof v === "object") v = v[theme] ?? v[TOKENS.color.themes[0].id];
    const alias = /^\{(.+)\}$/.exec(v);
    return alias ? color(alias[1], theme) : v;
}

const length = (family, name) => {
    const t = TOKENS[family].tokens.find((x) => x.name === name);
    if (!t) throw new Error(`Unknown ${family} token: ${name}`);
    return t.value;
};

module.exports = { TOKENS, color, space: (n) => length("spacing", n), radius: (n) => length("radius", n), shadow: (n) => length("shadow", n) };
