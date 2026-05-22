import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildEnergySeries,
  classifyZone,
  computeDashboardMetrics,
  nextScenarioState
} from '../lib/simulation.js';

test('classifyZone marks high temperature zones as critical', () => {
  const zone = classifyZone({
    temperature: 31.2,
    humidity: 64,
    occupancy: 0.68,
    load: 83
  });

  assert.equal(zone.level, 'critical');
  assert.equal(zone.hasAlert, true);
});

test('computeDashboardMetrics calculates energy and savings values', () => {
  const metrics = computeDashboardMetrics({
    baselineEnergy: 98.756,
    optimizedEnergy: 72.341,
    carbonReduction: 18.7,
    comfort: 0.32,
    averageTemperature: 26.3,
    abnormalCount: 3
  });

  assert.equal(metrics.realtimeEnergy, 968.6);
  assert.equal(metrics.savingRate, 26.8);
  assert.equal(metrics.savingCost, 17462);
  assert.equal(metrics.comfortLabel, '舒适');
});

test('buildEnergySeries creates 24 hourly points with optimized energy below baseline', () => {
  const series = buildEnergySeries(42);

  assert.equal(series.length, 24);
  assert.equal(series[0].time, '00:00');
  assert.equal(series[23].time, '23:00');
  assert.ok(series.every((point) => point.optimized < point.baseline));
});

test('nextScenarioState raises load during peak mode', () => {
  const state = nextScenarioState('peak', 12);

  assert.equal(state.scenario, 'peak');
  assert.ok(state.occupancyMultiplier > 1);
  assert.ok(state.loadMultiplier > 1);
});
