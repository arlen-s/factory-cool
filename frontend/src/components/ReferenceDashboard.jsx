import { useEffect, useState } from 'react';

const pulses = [
  ['p1', 18.4, 43.8],
  ['p2', 28.1, 28.5],
  ['p3', 36.5, 31.2],
  ['p4', 25.6, 60.3],
  ['p5', 31.6, 47.7],
  ['p6', 20.6, 62.2]
];

const flows = [
  ['f1', 45.8, 35.1, 6, 90],
  ['f2', 60.8, 35.1, 6, -90],
  ['f3', 45.8, 48.6, 7.4, 0],
  ['f4', 61.0, 48.6, 7.4, 180],
  ['f5', 53.2, 31.7, 6, 180],
  ['f6', 53.2, 58.5, 6, 0]
];

const sweeps = [
  ['s1', 75.2, 12.2, 23.4, 15.4],
  ['s2', 73.3, 31.4, 12.7, 12.8],
  ['s3', 86.2, 31.2, 10.8, 12.8],
  ['s4', 73.2, 46.3, 25.4, 15.2]
];

export function ReferenceDashboard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="replica-shell">
      <section className="replica-stage" aria-label="FactoryCool 智能冷却与能耗数字孪生系统">
        <img
          alt="FactoryCool reference dashboard"
          className="replica-reference"
          draggable="false"
          src="/assets/factorycool-reference.png"
        />
        <div className="replica-vignette" />
        <div className="replica-scanline" />
        <div className="replica-top-glow" />

        {pulses.map(([id, x, y], index) => (
          <span
            className="replica-pulse"
            key={id}
            style={{ '--x': `${x}%`, '--y': `${y}%`, '--delay': `${index * 0.28}s` }}
          />
        ))}

        {flows.map(([id, x, y, width, rotate], index) => (
          <span
            className="replica-flow"
            key={id}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--w': `${width}%`,
              '--r': `${rotate}deg`,
              '--delay': `${index * 0.22}s`
            }}
          />
        ))}

        {sweeps.map(([id, x, y, width, height], index) => (
          <span
            className="replica-sweep"
            key={id}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--w': `${width}%`,
              '--h': `${height}%`,
              '--delay': `${index * 0.45}s`
            }}
          />
        ))}

        <div className="replica-brain">
          <span className="brain-orbit orbit-one" />
          <span className="brain-orbit orbit-two" />
          <span className="brain-core" />
        </div>

        <div className="replica-kpi-glow" />
        <div className="replica-alert-flash" />
        <div className="replica-data-rain">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} style={{ '--i': index }} />
          ))}
        </div>
      </section>
    </main>
  );
}
