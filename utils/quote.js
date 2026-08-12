export function toNumber(value, fallback = 0) {
  const n = parseFloat(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

export function computeQuote({
  materialCost = 0,
  laborHours = 0,
  hourlyRate = 75,
  markupPercent = 0,
} = {}) {
  const material = toNumber(materialCost);
  const hours = toNumber(laborHours);
  const rate = toNumber(hourlyRate, 75);
  const markup = toNumber(markupPercent);

  const labor = hours * rate;
  const subtotal = material + labor;
  const markupAmount = subtotal * (markup / 100);
  const total = subtotal + markupAmount;

  return {
    material,
    hours,
    rate,
    labor,
    subtotal,
    markup,
    markupAmount,
    total,
  };
}

export function formatMoney(amount) {
  const n = toNumber(amount);
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
