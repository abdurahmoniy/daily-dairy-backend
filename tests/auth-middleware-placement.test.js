const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('protected routers are not wrapped with auth twice', () => {
  const serverSource = fs.readFileSync(path.resolve(__dirname, '..', 'server.js'), 'utf8');
  const duplicateMounts = [...serverSource.matchAll(/app\.use\('\/api\/([^']+)',\s*authMiddleware,/g)]
    .map((match) => `/api/${match[1]}`);

  assert.deepEqual(duplicateMounts, []);
});
