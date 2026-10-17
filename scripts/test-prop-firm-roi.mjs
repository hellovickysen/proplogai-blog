import assert from 'node:assert/strict';
import { calculatePropFirmRoi } from '../src/lib/propFirmRoi.js';

const example = calculatePropFirmRoi({ fees: '500', resets: '75', other: '0', refunds: '0', payouts: '600' });
assert.equal(example.netCostsCents, 57500);
assert.equal(example.netCashCents, 2500);
assert.equal(example.roiPercent.toFixed(2), '4.35');

const refunded = calculatePropFirmRoi({ fees: '500', resets: '75', other: '0', refunds: '75', payouts: '600' });
assert.equal(refunded.netCostsCents, 50000);
assert.equal(refunded.netCashCents, 10000);
assert.equal(refunded.roiPercent, 20);

const zeroCost = calculatePropFirmRoi({ fees: '0', resets: '0', other: '0', refunds: '0', payouts: '300' });
assert.equal(zeroCost.roiPercent, null);
assert.equal(zeroCost.netCashCents, 30000);

const invalid = calculatePropFirmRoi({ fees: '5', resets: '0', other: '0', refunds: '6', payouts: '0' });
assert.match(invalid.error, /refunds cannot be more/i);
assert.match(calculatePropFirmRoi({ fees: '-1', resets: '0', other: '0', refunds: '0', payouts: '0' }).error, /non-negative/i);
assert.match(calculatePropFirmRoi({ fees: '1.999', resets: '0', other: '0', refunds: '0', payouts: '0' }).error, /two decimals/i);
console.log('K23 ROI calculation examples and edge cases passed.');
