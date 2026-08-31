const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateLineTotal,
  getAverage,
  summarizeSalesByUnit,
} = require('../utils/metrics');

test('calculateLineTotal returns quantity multiplied by price rounded to two decimals', () => {
  assert.equal(calculateLineTotal(12.345, 4567.891), 56390.61);
});

test('getAverage returns zero when the denominator is empty', () => {
  assert.equal(getAverage(100000, 0), 0);
});

test('summarizeSalesByUnit groups quantities and revenue by product unit', () => {
  const sales = [
    { quantity: 100, total: 600000, product: { unit: 'Litr' } },
    { quantity: 25, total: 175000, product: { unit: 'litr' } },
    { quantity: 10, total: 300000, product: { unit: 'Kg' } },
    { quantity: 40, total: 200000, product: { unit: 'Dona' } },
  ];

  assert.deepEqual(summarizeSalesByUnit(sales), [
    { unit: 'Litr', quantity: 125, revenue: 775000 },
    { unit: 'Kg', quantity: 10, revenue: 300000 },
    { unit: 'Dona', quantity: 40, revenue: 200000 },
  ]);
});
