const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const backendRoot = path.resolve(__dirname, '..');

test('server module can be imported by Netlify functions without opening a port', () => {
  const script = `
    const assert = require('node:assert/strict');
    const http = require('node:http');
    let listened = false;
    http.Server.prototype.listen = function patchedListen() {
      listened = true;
      throw new Error('server.js should not call listen() when imported');
    };
    const mod = require('./server');
    assert.equal(typeof mod.createApp, 'function');
    assert.equal(typeof mod.app, 'function');
    assert.equal(listened, false);
    process.exit(0);
  `;

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: backendRoot,
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'test', PORT: '0' },
    timeout: 1000,
  });

  assert.equal(
    result.signal,
    null,
    `server module should exit cleanly, got signal ${result.signal}\n${result.stderr}`,
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('Netlify API function exports a request handler', () => {
  const script = `
    const assert = require('node:assert/strict');
    const mod = require('./netlify/functions/api');
    assert.equal(typeof mod.handler, 'function');
    process.exit(0);
  `;

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: backendRoot,
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'test' },
    timeout: 1000,
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
});
