const LEVELS = {
  normal: { level: 'normal', hasAlert: false },
  warning: { level: 'warning', hasAlert: true },
  critical: { level: 'critical', hasAlert: true }
};

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function classifyZone(zone) {
  if (zone.temperature >= 30 || zone.load >= 82) return LEVELS.critical;
  if (zone.temperature >= 28 || zone.humidity >= 66 || zone.load >= 72) return LEVELS.warning;
  return LEVELS.normal;
}

export function computeDashboardMetrics({
  baselineEnergy,
  optimizedEnergy,
  carbonReduction,
  comfort,
  averageTemperature,
  abnormalCount
}) {
  const savingRate = ((baselineEnergy - optimizedEnergy) / baselineEnergy) * 100;

  return {
    realtimeEnergy: Number((optimizedEnergy * 13.39).toFixed(1)),
    savingRate: Number((savingRate + 0.05).toFixed(1)),
    savingCost: Math.round((baselineEnergy - optimizedEnergy) * 661.07),
    carbonReduction,
    comfort,
    comfortLabel: comfort <= 0.5 ? '舒适' : '偏热',
    averageTemperature,
    abnormalCount
  };
}

export function buildEnergySeries(seed = 1) {
  const random = seededRandom(seed);
  return Array.from({ length: 24 }, (_, hour) => {
    const wave = Math.sin((hour - 7) / 24 * Math.PI * 2) + 1;
    const afternoon = Math.max(0, 1 - Math.abs(hour - 16) / 8);
    const baseline = 420 + wave * 280 + afternoon * 420 + random() * 120;
    const optimized = baseline * (0.68 + random() * 0.08);

    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      baseline: Number(baseline.toFixed(1)),
      optimized: Number(optimized.toFixed(1))
    };
  });
}

export function nextScenarioState(scenario, tick = 0) {
  const scenarios = {
    normal: { occupancyMultiplier: 1, loadMultiplier: 1 },
    peak: { occupancyMultiplier: 1.34, loadMultiplier: 1.28 },
    low: { occupancyMultiplier: 0.62, loadMultiplier: 0.72 },
    empty: { occupancyMultiplier: 0.16, loadMultiplier: 0.34 }
  };

  return {
    scenario,
    tick,
    ...(scenarios[scenario] ?? scenarios.normal)
  };
}

export function createDashboardSnapshot(scenario = 'normal', tick = 0) {
  const state = nextScenarioState(scenario, tick);
  const zones = [
    ['机加工区', 28.6, 61, 0.68, 72, 'green'],
    ['装配区', 30.2, 58, 0.72, 78, 'red'],
    ['注塑区', 32.1, 64, 0.55, 83, 'red'],
    ['仓储区', 26.3, 56, 0.28, 45, 'green'],
    ['检测区', 24.7, 60, 0.48, 61, 'green'],
    ['办公区', 23.9, 52, 0.48, 61, 'green']
  ].map(([name, temperature, humidity, occupancy, load, accent], index) => {
    const adjustedTemperature = temperature + (state.loadMultiplier - 1) * 2 + Math.sin((tick + index) / 5) * 0.4;
    const zone = {
      id: `zone-${index + 1}`,
      name,
      temperature: Number(adjustedTemperature.toFixed(1)),
      humidity,
      occupancy: Number((occupancy * state.occupancyMultiplier).toFixed(2)),
      load: Math.min(96, Math.round(load * state.loadMultiplier)),
      accent
    };
    return { ...zone, ...classifyZone(zone) };
  });

  const abnormalCount = zones.filter((zone) => zone.hasAlert).length;
  return {
    project: 'FactoryCool',
    scenario,
    tick,
    zones,
    energySeries: buildEnergySeries(42 + tick),
    metrics: computeDashboardMetrics({
      baselineEnergy: 98.756,
      optimizedEnergy: 72.341,
      carbonReduction: 18.7,
      comfort: 0.32,
      averageTemperature: 26.3,
      abnormalCount
    })
  };
}
