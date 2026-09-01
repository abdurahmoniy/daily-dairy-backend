const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.resolve(__dirname, '..', 'controllers', 'userController.js'),
  'utf8',
);

function getExportBody(name) {
  const start = source.indexOf(`exports.${name}`);
  const next = source.indexOf('\nexports.', start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test('current user endpoint returns the authenticated token payload without an extra user lookup', () => {
  const body = getExportBody('getCurrentUser');

  assert.doesNotMatch(body, /prisma\.user\.findUnique/);
  assert.match(body, /req\.user/);
});
