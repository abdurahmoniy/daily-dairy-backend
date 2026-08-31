const test = require('node:test');
const assert = require('node:assert/strict');

const { AUTH_TOKEN_EXPIRES_IN } = require('../utils/authToken');

test('auth token lifetime is 100 days', () => {
  assert.equal(AUTH_TOKEN_EXPIRES_IN, '100d');
});
