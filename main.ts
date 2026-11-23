// Entry program for make.fun "The Dumbest Thing Your Agent Did Today".
// Reads the one-line entry from entry.txt next to this file and writes it
// verbatim to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Node 22, standard library only, deterministic: the same input always
// produces the same output bytes.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.txt");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate only accepts UTF-8 text of 1 to 200 characters, not only
// whitespace, so refuse to emit anything outside that range instead of
// shipping an entry the scorer would mark invalid.
const text = readFileSync(source, "utf8");
const chars = [...text.trim()].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry.txt must hold 1 to 200 characters, got ${chars}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "entry.txt"));

// Confirm the copy landed and matches the source byte for byte, so a
// silent short write can never pass as a valid entry.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== text) {
  throw new Error("entry.txt copy does not match the source");
}
console.log(`wrote ${chars}-character line to ${join(outDir, "entry.txt")}`);
