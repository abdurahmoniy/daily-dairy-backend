const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.resolve(__dirname, '..', 'controllers', 'purchaseController.js'),
  'utf8',
);

function getExportBody(name) {
  const start = source.indexOf(`exports.${name}`);
  const next = source.indexOf('\nexports.', start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test('milk purchase writes avoid relation reload round-trips', () => {
  for (const action of ['createPurchase', 'updatePurchase']) {
    assert.doesNotMatch(getExportBody(action), /include:\s*\{\s*supplier:\s*true\s*\}/);
  }
});
