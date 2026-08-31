const test = require('node:test');
const assert = require('node:assert/strict');

const { getRequestIpAddress } = require('../utils/requestMetadata');

test('getRequestIpAddress returns req.ip when Express provides it', () => {
  assert.equal(getRequestIpAddress({ ip: '127.0.0.1', headers: {} }), '127.0.0.1');
});

test('getRequestIpAddress falls back to x-forwarded-for in serverless requests', () => {
  assert.equal(
    getRequestIpAddress({
      headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' },
    }),
    '203.0.113.10',
  );
});

test('getRequestIpAddress returns a string when no IP metadata is available', () => {
  assert.equal(getRequestIpAddress({ headers: {} }), 'unknown');
});
