import { useEffect, useMemo, useState } from 'react';

import { AiControlCenter } from './components/AiControlCenter.jsx';
import { AnalyticsPanel } from './components/AnalyticsPanel.jsx';
import { DigitalTwin } from './components/DigitalTwin.jsx';
import { HeaderBar } from './components/HeaderBar.jsx';
import { KpiStrip } from './components/KpiStrip.jsx';
import { StatusTicker } from './components/StatusTicker.jsx';
import { createDashboardSnapshot } from './lib/simulation.js';

const scenarios = [
  { id: 'normal', label: '标准运行' },
  { id: 'peak', label: '高峰作业' },
  { id: 'low', label: '低负荷' },
  { id: 'empty', label: '无人车间' }
];

function normalizeSnapshot(payload) {
  if (!payload) return null;
  return {
    project: payload.project,
    scenario: payload.scenario,
    tick: payload.tick,
    zones: payload.zones,
    energySeries: payload.energySeries ?? payload.energy_series,
    metrics: {
      realtimeEnergy: payload.metrics?.realtimeEnergy ?? payload.metrics?.realtime_energy,
      savingRate: payload.metrics?.savingRate ?? payload.metrics?.saving_rate,
      savingCost: payload.metrics?.savingCost ?? payload.metrics?.saving_cost,
      carbonReduction: payload.metrics?.carbonReduction ?? payload.metrics?.carbon_reduction,
      averageTemperature: payload.metrics?.averageTemperature ?? payload.metrics?.average_temperature,
      comfort: payload.metrics?.comfort,
      abnormalCount: payload.metrics?.abnormalCount ?? payload.metrics?.abnormal_count
    },
    alerts: payload.alerts,
    aiFlow: payload.aiFlow ?? payload.ai_flow
  };
}

export default function App() {
  const [scenario, setScenario] = useState('normal');
  const [tick, setTick] = useState(0);
  const [remoteSnapshot, setRemoteSnapshot] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL ?? 'ws://127.0.0.1:8000/ws/dashboard';
    const socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => setConnected(true));
    socket.addEventListener('close', () => setConnected(false));
    socket.addEventListener('error', () => setConnected(false));
    socket.addEventListener('message', (event) => {
      try {
        setRemoteSnapshot(normalizeSnapshot(JSON.parse(event.data)));
      } catch {
        setConnected(false);
      }
    });

    return () => socket.close();
  }, []);

  const snapshot = useMemo(() => {
    const localSnapshot = createDashboardSnapshot(scenario, tick);
    if (!remoteSnapshot || scenario !== 'normal') return localSnapshot;
    return {
      ...localSnapshot,
      ...remoteSnapshot,
      energySeries: remoteSnapshot.energySeries ?? localSnapshot.energySeries
    };
  }, [remoteSnapshot, scenario, tick]);

  return (
    <main className="app-shell">
      <section className="dashboard-stage">
        <HeaderBar connected={connected} />

        <div className="scenario-switch">
          {scenarios.map((item) => (
            <button
              className={item.id === scenario ? 'scenario active' : 'scenario'}
              key={item.id}
              onClick={() => setScenario(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="dashboard-grid">
          <DigitalTwin snapshot={snapshot} />
          <AiControlCenter snapshot={snapshot} />
          <AnalyticsPanel snapshot={snapshot} />
        </div>

        <KpiStrip metrics={snapshot.metrics} />
        <StatusTicker connected={connected} />
      </section>
    </main>
  );
}
