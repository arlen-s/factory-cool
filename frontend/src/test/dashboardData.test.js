import test from 'node:test';
import assert from 'node:assert/strict';

import { buildDashboardViewModel, createFallbackDashboardPayload } from '../lib/dashboardData.js';

test('buildDashboardViewModel maps snapshot zones and ai analysis into dashboard fields', () => {
  const payload = createFallbackDashboardPayload(5);
  const viewModel = buildDashboardViewModel(payload);

  assert.equal(viewModel.zones.length, 6);
  assert.match(viewModel.zones[0].temp, /°C$/);
  assert.match(viewModel.zones[0].density, /人\/m²$/);
  assert.equal(viewModel.kpis.length, 6);
  assert.equal(viewModel.alerts.length >= 3, true);
  assert.equal(viewModel.ai.recommendedActions.length >= 3, true);
  assert.equal(viewModel.ai.knowledgePoints.includes('负荷预测'), true);
  assert.match(viewModel.ticker.message, /AI/);
});

test('buildDashboardViewModel keeps ai operator message and control setpoints visible', () => {
  const payload = createFallbackDashboardPayload(2);
  payload.ai_analysis.operator_message = 'AI已完成冷却负荷预测，建议执行安全优先策略。';
  payload.ai_analysis.control_setpoints = [
    { target: '冷水机组出水温度', value: '6.5°C', reason: '缩短恢复时间' },
  ];

  const viewModel = buildDashboardViewModel(payload);

  assert.equal(viewModel.ticker.message, 'AI已完成冷却负荷预测，建议执行安全优先策略。');
  assert.equal(viewModel.controls[0][0], '冷水机组出水温度');
  assert.equal(viewModel.controls[0][1], '6.5°C');
});
