const UNIT_LABELS = {
  litr: 'Litr',
  liter: 'Litr',
  litre: 'Litr',
  l: 'Litr',
  kg: 'Kg',
  kilogram: 'Kg',
  kilogramm: 'Kg',
  dona: 'Dona',
  unit: 'Dona',
  units: 'Dona',
  paket: 'Paket',
  package: 'Paket',
  shisha: 'Shisha',
  bottle: 'Shisha',
  karton: 'Karton',
  carton: 'Karton',
  gramm: 'Gramm',
  gram: 'Gramm',
  g: 'Gramm',
  tonna: 'Tonna',
  ton: 'Tonna',
  t: 'Tonna'
};

const UNIT_ORDER = ['Litr', 'Kg', 'Dona', 'Paket', 'Shisha', 'Karton', 'Gramm', 'Tonna'];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function roundCurrency(value) {
  return Math.round(toNumber(value) * 100) / 100;
}

function calculateLineTotal(quantity, price) {
  return roundCurrency(toNumber(quantity) * toNumber(price));
}

function getAverage(total, quantity) {
  const denominator = toNumber(quantity);
  if (denominator <= 0) return 0;
  return roundCurrency(toNumber(total) / denominator);
}

function normalizeUnit(unit) {
  const normalized = String(unit || '').trim().toLowerCase();
  return UNIT_LABELS[normalized] || String(unit || 'Nomaʼlum').trim() || 'Nomaʼlum';
}

function summarizeSalesByUnit(sales) {
  const grouped = new Map();

  for (const sale of sales || []) {
    const unit = normalizeUnit(sale.product?.unit);
    const current = grouped.get(unit) || { unit, quantity: 0, revenue: 0 };
    current.quantity += toNumber(sale.quantity);
    current.revenue += toNumber(sale.total);
    grouped.set(unit, current);
  }

  return Array.from(grouped.values())
    .map((item) => ({
      unit: item.unit,
      quantity: roundCurrency(item.quantity),
      revenue: roundCurrency(item.revenue)
    }))
    .sort((a, b) => {
      const orderA = UNIT_ORDER.indexOf(a.unit);
      const orderB = UNIT_ORDER.indexOf(b.unit);
      if (orderA === -1 && orderB === -1) return a.unit.localeCompare(b.unit);
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });
}

module.exports = {
  calculateLineTotal,
  getAverage,
  normalizeUnit,
  summarizeSalesByUnit
};
