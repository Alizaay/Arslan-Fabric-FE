/**
 * Vercel/build: set BACKEND_URL (no trailing slash) in project env, e.g.
 * https://arslan-fabric-be.onrender.com
 * Writes js/env.js + admin/js/env.js so the static site calls the live API.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const url = (process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

const content = `/* Auto-generated — do not edit. Set BACKEND_URL on Vercel. */
window.__ARSALAN_API_BASE__ = ${JSON.stringify(url)};
`;

for (const rel of ['js/env.js', 'admin/js/env.js']) {
  fs.writeFileSync(path.join(root, rel), content, 'utf8');
}

console.log(`API base for deploy: ${url || '(empty — use vercel.json /api rewrite or set BACKEND_URL)'}`);
