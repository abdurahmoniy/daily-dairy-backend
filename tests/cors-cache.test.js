const test = require('node:test');
const assert = require('node:assert/strict');

test('CORS preflight responses are cacheable by browsers', () => {
  const corsOptions = require('../utils/corsOptions');

  assert.equal(corsOptions.maxAge, 86400);
});
