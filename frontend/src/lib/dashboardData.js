import { createDashboardSnapshot } from './simulation.js';

const zoneMeta = {
  '机加工区': { marker: { x: 345, y: 156 }, card: 'machining' },
  '装配区': { marker: { x: 611, y: 205 }, card: 'assembly' },
  '注塑区': { marker: { x: 202, y: 386 }, card: 'injection' },
  '仓储区': { marker: { x: 501, y: 408 }, card: 'storage' },
  '检测区': { marker: { x: 260, y: 640 }, card: 'inspection' },
  '办公区': { marker: { x: 498, y: 618 }, card: 'office' }
};

const sensorDefaults = {
  '温度传感器': '128 ↑',
  '湿度传感器': '96 ↑',
  'CO₂传感器': '64 ↑',
  '人员计数器': '48 ↑',
  '设备采集器': '72 ↑',
  '电表水表': '32 ↑'
};

const controlDefaults = {
  '冷水机组': '运行中',
  '冷却塔': '运行中',
  '空调末端': '运行中',
  '风机系统': '运行中',
  '阀门调节': '调节中',
  '照明系统': '优化中'
};

function formatNumber(value, digits = 1) {
  return Number(value ?? 0).toFixed(digits);
}

function toneForZone(zone) {
  if (zone.level === 'critical') return 'red';
  if (zone.level === 'warning') return 'yellow';
  if (zone.accent === 'red') return 'red';
  if (zone.accent === 'blue') return 'blue';
  if (zone.accent === 'cyan') return 'cyan';
  return 'green';
}

function normalizeFallbackSnapshot(snapshot) {
  return {
    ...snapshot,
    energy_series: snapshot.energySeries,
    metrics: {
      realtime_energy: snapshot.metrics.realtimeEnergy,
      saving_rate: snapshot.metrics.savingRate,
      saving_cost: snapshot.metrics.savingCost,
      carbon_reduction: snapshot.metrics.carbonReduction,
      average_temperature: snapshot.metrics.averageTemperature,
      comfort: snapshot.metrics.comfort,
      abnormal_count: snapshot.metrics.abnormalCount
    },
    zones: snapshot.zones.map((zone) => ({
      ...zone,
      has_alert: zone.hasAlert
    })),
    alerts: [
      { level: 'critical', message: '装配区温度超过阈值，建议执行分区冷量重分配', time: '10:29:45' },
      { level: 'warning', message: '冷却塔 CT-02 电机电流异常', time: '10:24:18' },
      { level: 'warning', message: '能耗较昨日周期上升 15.3%', time: '10:15:32' }
    ],
    ai_flow: {
      sensing: Object.keys(sensorDefaults),
      controls: Object.keys(controlDefaults),
      strategy: 'AI策略引擎'
    }
  };
}

function buildFallbackAiAnalysis(snapshot) {
  const hottest = [...snapshot.zones].sort((a, b) => b.temperature - a.temperature)[0];
  return {
    source: 'frontend-fallback',
    model: 'industrial-rules-v1',
    mode: 'safety_priority',
    risk_level: hottest.level,
    summary: `当前${hottest.name}温度${hottest.temperature}°C，AI进入安全优先策略。`,
    load_forecast: [
      { horizon: '30min', load_index: 0.74, description: '负荷小幅上升' },
      { horizon: '60min', load_index: 0.78, description: '热负荷维持高位' },
      { horizon: '120min', load_index: 0.71, description: '调控后回落' }
    ],
    root_causes: [
      `${hottest.name}温度和设备负载同步抬升，疑似生产节拍上升叠加局部换热不足。`,
      '冷却系统能耗处于峰值区间，需要提前削峰控制。'
    ],
    recommended_actions: [
      '执行安全优先策略，优先压制高温区域。',
      `对${hottest.name}提高空调末端风量10%。`,
      '冷水机组出水温度下调0.5°C，冷却塔风机频率提高5%。'
    ],
    control_setpoints: [
      { target: '冷水机组出水温度', value: '6.5°C', reason: '缩短恢复时间' },
      { target: '冷却塔风机频率', value: '47Hz', reason: '提升换热能力' },
      { target: '高温区末端风量', value: '+10%', reason: '分区冷量重分配' }
    ],
    expected_savings: {
      saving_rate_percent: snapshot.metrics.saving_rate,
      cost_saving_yuan: snapshot.metrics.saving_cost,
      carbon_reduction_ton: snapshot.metrics.carbon_reduction,
      recovery_minutes: 15
    },
    operator_message: `AI已识别${hottest.name}热负荷抬升，建议执行安全优先策略并维持节能率${snapshot.metrics.saving_rate}%。`,
    agent_steps: ['感知数据归一化', '异常检测', '负荷预测', '策略优化', '执行建议生成'],
    ai_knowledge_points: ['负荷预测', '异常检测', '根因分析', '策略优化', '控制量推荐', '节能测算', '可解释AI', 'Agent工作流']
  };
}

export function createFallbackDashboardPayload(tick = 0) {
  const snapshot = normalizeFallbackSnapshot(createDashboardSnapshot('normal', tick));
  return {
    snapshot,
    ai_analysis: buildFallbackAiAnalysis(snapshot)
  };
}

export function buildDashboardViewModel(payload) {
  const snapshot = payload?.snapshot ?? createFallbackDashboardPayload(0).snapshot;
  const ai = payload?.ai_analysis ?? buildFallbackAiAnalysis(snapshot);
  const metrics = snapshot.metrics ?? {};
  const zones = (snapshot.zones ?? []).map((zone) => {
    const meta = zoneMeta[zone.name] ?? { marker: { x: 400, y: 360 }, card: 'machining' };
    return {
      name: zone.name,
      temp: `${formatNumber(zone.temperature)}°C`,
      humidity: `${Math.round(zone.humidity ?? 0)}%`,
      density: `${formatNumber(zone.occupancy, 2)} 人/m²`,
      load: `${Math.round(zone.load ?? 0)}%`,
      marker: meta.marker,
      card: meta.card,
      tone: toneForZone(zone)
    };
  });

  const alerts = [
    ...(snapshot.alerts ?? []).map((alert) => ({
      level: alert.level === 'critical' ? 'warn' : 'info',
      message: alert.message,
      time: alert.time ?? '--:--'
    })),
    ...(ai.recommended_actions ?? []).slice(0, 2).map((message, index) => ({
      level: 'info',
      message: `AI策略建议　${message}`,
      time: index === 0 ? 'AI' : 'Agent'
    }))
  ];

  return {
    zones,
    kpis: [
      ['实时能耗', formatNumber(metrics.realtime_energy), 'kWh', '接口实时计算', 'Zap', 'cyan'],
      ['节能率（本月）', formatNumber(metrics.saving_rate), '%', 'AI策略优化', 'Leaf', 'green'],
      ['平均温度', formatNumber(metrics.average_temperature), '°C', '区域加权均值', 'Thermometer', 'blue'],
      ['舒适度（PMV）', formatNumber(metrics.comfort, 2), '', '舒适', 'Smile', 'lime'],
      ['设备异常数', String(metrics.abnormal_count ?? 0), '个', `AI风险等级 ${ai.risk_level ?? 'normal'}`, 'AlertTriangle', 'red'],
      ['碳减排（本月）', formatNumber(metrics.carbon_reduction), '吨', '节能测算', 'Cloud', 'sky']
    ],
    sensors: (snapshot.ai_flow?.sensing ?? Object.keys(sensorDefaults)).map((label) => [label, sensorDefaults[label] ?? '在线', label]),
    controls: (ai.control_setpoints?.length ? ai.control_setpoints : []).map((item) => [item.target, item.value, item.target]),
    fallbackControls: (snapshot.ai_flow?.controls ?? Object.keys(controlDefaults)).map((label) => [label, controlDefaults[label] ?? '运行中', label]),
    statusRings: [
      ['冷水机组', '3/3', '运行'],
      ['冷却塔', '4/4', '运行'],
      ['空调末端', '28/30', '运行'],
      ['风机系统', '16/16', '运行'],
      ['阀门执行器', '42/45', '正常']
    ],
    alerts,
    energySeries: snapshot.energy_series ?? [],
    ai: {
      mode: ai.mode,
      riskLevel: ai.risk_level,
      summary: ai.summary,
      rootCauses: ai.root_causes ?? [],
      recommendedActions: ai.recommended_actions ?? [],
      controlSetpoints: ai.control_setpoints ?? [],
      agentSteps: ai.agent_steps ?? [],
      knowledgePoints: ai.ai_knowledge_points ?? [],
      expectedSavings: ai.expected_savings ?? {},
      source: ai.source,
      model: ai.model
    },
    ticker: {
      time: 'AI',
      message: ai.operator_message ?? 'AI Agent 正在分析实时冷却负荷。',
      abnormalCount: metrics.abnormal_count ?? 0
    },
    metrics
  };
}

export async function fetchLiveDashboardPayload({ tick = 0, scenario = 'normal', baseUrl = '' } = {}) {
  const url = `${baseUrl}/api/dashboard/live?scenario=${encodeURIComponent(scenario)}&tick=${encodeURIComponent(tick)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Dashboard API failed with ${response.status}`);
  }
  return response.json();
}
