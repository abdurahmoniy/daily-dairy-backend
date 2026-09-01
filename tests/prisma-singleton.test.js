const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const backendRoot = path.resolve(__dirname, '..');

function collectJsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectJsFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

test('request handlers use the shared Prisma client module', () => {
  const checkedDirs = ['controllers', 'middlewares'];
  const offenders = checkedDirs
    .flatMap((dir) => collectJsFiles(path.join(backendRoot, dir)))
    .filter((file) => fs.readFileSync(file, 'utf8').includes("require('@prisma/client')"))
    .map((file) => path.relative(backendRoot, file));

  assert.deepEqual(offenders, []);
});
