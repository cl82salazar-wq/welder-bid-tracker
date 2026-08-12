import { computeQuote, formatMoney } from './quote';

export function buildInvoiceText(job) {
  const q = computeQuote({
    materialCost: job.materialCost,
    laborHours: job.laborHours,
    hourlyRate: job.hourlyRate,
    markupPercent: job.markupPercent,
  });

  const created = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : '—';

  const lines = [
    'WELDER BID TRACKER — INVOICE SUMMARY',
    '====================================',
    `Job: ${job.name}`,
    `Status: ${job.status}`,
    `Created: ${created}`,
    '',
    'LINE ITEMS',
    '----------',
    `Materials ................ ${formatMoney(q.material)}`,
    `Labor (${q.hours} hrs × ${formatMoney(q.rate)}) .. ${formatMoney(q.labor)}`,
  ];

  if (q.markup > 0) {
    lines.push(`Markup (${q.markup}%) ............. ${formatMoney(q.markupAmount)}`);
  }

  lines.push(
    '',
    `Subtotal ................. ${formatMoney(q.subtotal)}`,
    `TOTAL .................... ${formatMoney(q.total)}`,
  );

  if (job.notes && String(job.notes).trim()) {
    lines.push('', 'NOTES', '-----', String(job.notes).trim());
  }

  lines.push('', 'Thank you for your business.');
  return lines.join('\n');
}
