import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultAssumptions, estimateCleaning, estimateServing, roundMoney } from '../src/lib/roi.ts';

test('cleaning: the default example works out by hand', () => {
  // 2,000 m² twice a day at 250 m²/h = 16 person-hours a day, 416 a month.
  const est = estimateCleaning({ area: 2000, passes: 2, wage: 11000 });
  assert.equal(est.manualHours, 416);
  assert.equal(Math.round(est.currentCost), 22000);
  // The robot covers 80 %: 3,200 m² a day at 700 m²/h, about 4.6 h, one robot.
  assert.equal(est.robotHoursPerDay.toFixed(2), '4.57');
  assert.equal(est.robots, 1);
  // 80 % of 416 h, minus 30 min of supervision a day for 26 days.
  assert.equal(est.freedHours, 416 * 0.8 - 13);
  assert.equal(roundMoney(est.savings), 16900);
});

test('cleaning: large floors need more robots and more supervision', () => {
  const est = estimateCleaning({ area: 20000, passes: 3, wage: 11000 });
  assert.equal(est.robots, Math.ceil((20000 * 0.8 * 3) / 700 / 8));
  assert.ok(est.robots > 1);
  const supervision = est.robots * 0.5 * 26;
  assert.equal(est.freedHours, est.manualHours * 0.8 - supervision);
});

test('cleaning: savings never go negative when supervision outweighs the work', () => {
  const a = structuredClone(defaultAssumptions);
  a.cleaning.supervisionHoursPerRobotDay = 8;
  const est = estimateCleaning({ area: 200, passes: 1, wage: 9000 }, a);
  assert.equal(est.freedHours, 0);
  assert.equal(est.savings, 0);
});

test('serving: trips × minutes × shifts × days, with the robot taking 70 %', () => {
  const est = estimateServing({ trips: 120, shifts: 2, wage: 11000 });
  assert.equal(est.manualHours, 208);
  assert.equal(Math.round(est.currentCost), 11000);
  assert.equal(roundMoney(est.savings), 7700);
});

test('changed assumptions flow through the estimate', () => {
  const a = structuredClone(defaultAssumptions);
  a.cleaning.manualRate = 500;
  const half = estimateCleaning({ area: 2000, passes: 2, wage: 11000 }, a);
  assert.equal(half.manualHours, 208);
});

test('money rounds to the nearest hundred pesos', () => {
  assert.equal(roundMoney(16949), 16900);
  assert.equal(roundMoney(16950), 17000);
});
