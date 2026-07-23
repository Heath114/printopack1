// Reads db/seed.json (the canonical content) and writes db/seed.sql (INSERT statements)
// that Malek loads into D1 with:  wrangler d1 execute printopack --file=db/seed.sql --remote
// Run:  node db/build-seed-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const TS = 1753000000000; // fixed timestamp so the generated SQL is deterministic
const seed = JSON.parse(readFileSync(new URL('./seed.json', import.meta.url), 'utf8'));
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'"; // SQL-escape single quotes
const lines = ['-- Generated from db/seed.json by db/build-seed-sql.mjs. Do not edit by hand.',
  'DELETE FROM entries;', 'DELETE FROM singletons;'];

let counts = {};
for (const [collection, records] of Object.entries(seed.entries)) {
  counts[collection] = records.length;
  records.forEach((rec, i) => {
    lines.push(
      `INSERT INTO entries (collection,id,data,sort,updated_at) VALUES (` +
      `${q(collection)},${q(rec.id)},${q(JSON.stringify(rec))},${i},${TS});`
    );
  });
}
for (const [key, obj] of Object.entries(seed.singletons)) {
  lines.push(
    `INSERT INTO singletons (key,data,updated_at) VALUES (${q(key)},${q(JSON.stringify(obj))},${TS});`
  );
}

writeFileSync(new URL('./seed.sql', import.meta.url), lines.join('\n') + '\n');
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log('collections:', counts);
console.log('total entries:', total, '| singletons:', Object.keys(seed.singletons).length);
console.log('wrote db/seed.sql (' + lines.length + ' lines)');
