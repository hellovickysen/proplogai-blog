// Dollar inputs are converted to cents before arithmetic so the shown totals reconcile.
const fields = ['fees', 'resets', 'other', 'refunds', 'payouts'];

export function calculatePropFirmRoi(values) {
  const cents = {};
  for (const field of fields) {
    const raw = String(values[field] ?? '').trim();
    if (!/^(?:\d+)(?:\.\d{1,2})?$/.test(raw)) {
      return { error: `Enter a non-negative dollar amount with up to two decimals for ${field}.` };
    }
    const value = Number(raw);
    if (!Number.isSafeInteger(Math.round(value * 100)) || value > 1000000000) {
      return { error: `The ${field} amount is too large to calculate safely.` };
    }
    cents[field] = Math.round(value * 100);
  }

  const paidCostsCents = cents.fees + cents.resets + cents.other;
  if (cents.refunds > paidCostsCents) {
    return { error: 'Received fee refunds cannot be more than the costs entered.' };
  }
  const netCostsCents = paidCostsCents - cents.refunds;
  const netCashCents = cents.payouts - netCostsCents;
  return {
    paidCostsCents,
    netCostsCents,
    payoutsCents: cents.payouts,
    netCashCents,
    roiPercent: netCostsCents === 0 ? null : (netCashCents / netCostsCents) * 100,
  };
}
