import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Brain,
  Cloud,
  Cpu,
  Droplets,
  Fan,
  Gauge,
  Leaf,
  RadioTower,
  Smile,
  Snowflake,
  Thermometer,
  Users,
  Zap
} from 'lucide-react';

import {
  buildDashboardViewModel,
  createFallbackDashboardPayload,
  fetchLiveDashboardPayload
} from '../lib/dashboardData.js';

const iconByName = {
  AlertTriangle,
  Cloud,
  Cpu,
  Droplets,
  Fan,
  Gauge,
  Leaf,
  RadioTower,
  Smile,
  Snowflake,
  Thermometer,
  Users,
  Zap,
  '冷水机组': Snowflake,
  '冷却塔': RadioTower,
  '空调末端': Gauge,
  '风机系统': Fan,
  '阀门调节': Droplets,
  '照明系统': Zap,
  '冷水机组出水温度': Snowflake,
  '冷却塔风机频率': RadioTower,
  '装配区末端风量': Fan,
  '高温区末端风量': Fan,
  '阀门开度': Droplets,
  '温度传感器': Thermometer,
  '湿度传感器': Droplets,
  'CO₂传感器': RadioTower,
  '人员计数器': Users,
  '设备采集器': Cpu,
  '电表水表': Zap
};

function resolveIcon(name, fallback = Gauge) {
  return iconByName[name] ?? fallback;
}

function Panel({ title, action, className = '', children }) {
  return (
    <section className={`code-panel ${className}`}>
      <span className="code-panel-corners" aria-hidden="true" />
      <div className="code-panel-title">
        <strong>{title}</strong>
        {action ? <span>{action}</span> : null}
      </div>
      {children}
    </section>
  );
}

function MiniLineChart() {
  return (
    <svg className="mini-line" viewBox="0 0 430 148" role="img" aria-label="实时能耗趋势">
      <defs>
        <linearGradient id="lineGlow" x1="0" x2="1">
          <stop offset="0" stopColor="#25dfff" />
          <stop offset="1" stopColor="#34ff91" />
        </linearGradient>
      </defs>
      <g className="chart-legend">
        <line x1="49" y1="11" x2="74" y2="11" />
        <text x="80" y="15">总能耗</text>
        <line className="sub" x1="136" y1="11" x2="161" y2="11" />
        <text x="167" y="15">冷却系统能耗</text>
      </g>
      {Array.from({ length: 6 }, (_, index) => (
        <line className="chart-grid" key={`h-${index}`} x1="38" x2="420" y1={30 + index * 18} y2={30 + index * 18} />
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <line className="chart-grid" key={`v-${index}`} x1={38 + index * 62} x2={38 + index * 62} y1="28" y2="120" />
      ))}
      {['1,500', '1,200', '900', '600', '300', '0'].map((label, index) => (
        <text className="chart-axis-label y" x="0" y={34 + index * 18} key={label}>{label}</text>
      ))}
      {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((label, index) => (
        <text className="chart-axis-label x" x={29 + index * 62} y="140" key={label}>{label}</text>
      ))}
      <path
        className="energy-path main"
        d="M38 100 C60 96 74 58 96 56 S129 90 156 82 S191 44 221 51 S258 76 286 60 S323 30 358 42 S385 92 406 80 S417 88 420 74"
      />
      <path
        className="energy-path sub"
        d="M38 118 C60 111 73 84 97 82 S128 107 156 98 S191 70 223 75 S258 97 286 83 S323 56 358 65 S385 110 408 98 S418 107 420 96"
      />
      <path
        className="forecast-ghost-line"
        d="M221 51 C250 42 278 45 306 37 S358 20 390 28 S414 42 420 38"
      />
      <g className="predictive-horizon" aria-hidden="true">
        <path d="M220 28V120" />
        <text x="230" y="37">AI FORECAST</text>
      </g>
      {[96, 156, 221, 286, 358, 406, 420].map((x, index) => (
        <circle className="chart-point" cx={x} cy={[56, 82, 51, 60, 42, 80, 74][index]} r="3.2" key={x} />
      ))}
    </svg>
  );
}

function FactoryTwin({ zones }) {
  return (
    <div className="factory-twin">
      <div className="factory-base-map">
        <img src="/assets/factory-twin-workshop.png" alt="数字孪生车间高质量底图" />
      </div>
      <span className="factory-map-glow" />
      <span className="holo-vignette" />
      <span className="twin-command-burst" />
      <span className="thermal-target-lock" aria-hidden="true" />
      <span className="cooling-command-vector" aria-hidden="true" />
      <svg className="factory-map-overlay" viewBox="0 0 820 760" role="img" aria-label="数字孪生车间运行态叠加层">
        <defs>
          <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mapDataFlow" x1="0" x2="1">
            <stop offset="0" stopColor="#18f7ff" stopOpacity="0.1" />
            <stop offset="0.52" stopColor="#68ffff" stopOpacity="1" />
            <stop offset="1" stopColor="#18f7ff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {[
          '242,165 242,320',
          '505,183 425,337',
          '425,337 146,305',
          '432,342 336,520',
          '640,372 552,518',
          '336,522 232,676',
          '552,520 710,596'
        ].map((points) => (
          <polyline className="room-divider" points={points} key={points} />
        ))}

        {zones.map((zone) => (
          <g className={`zone-status-marker ${zone.tone}`} key={zone.name} transform={`translate(${zone.marker.x} ${zone.marker.y})`}>
            <circle className="marker-pulse" r="22" />
            <circle className="marker-core" r="6" />
            <path d="M0 -34V-20M0 20V34M-34 0H-20M20 0H34" />
            <text x="14" y="-9">{zone.name}</text>
            <text className="zone-temp" x="14" y="13">{zone.temp}</text>
          </g>
        ))}

        {[
          [208, 324],
          [412, 202],
          [650, 312],
          [466, 466],
          [322, 646]
        ].map(([x, y], index) => (
          <g className="fan-node" key={index} transform={`translate(${x} ${y})`}>
            <circle r="22" />
            <path d="M0 -15 C18 -9 12 3 2 3 C-3 -4 -4 -9 0 -15Z" />
            <path d="M14 8 C4 23 -8 14 -4 5 C4 5 10 5 14 8Z" />
            <path d="M-14 8 C-20 -10 -6 -14 -2 -5 C-4 0 -9 5 -14 8Z" />
          </g>
        ))}

        {[
          [184, 260],
          [486, 180],
          [704, 332],
          [438, 504],
          [112, 596],
          [572, 648]
        ].map(([x, y], index) => (
          <g className="sensor-beacon" key={index} transform={`translate(${x} ${y})`}>
            <circle r="15" />
            <circle r="5" />
            <path d="M0 -24V-38M0 24V38M-24 0H-38M24 0H38" />
          </g>
        ))}

        <polyline className="pipe hot" points="82,404 222,348 416,374 646,290" />
        <polyline className="pipe cold" points="118,540 304,472 500,496 728,360" />
        <polyline className="pipe data" points="304,156 412,318 542,350 670,548" />
        <polyline className="pipe-flow" points="112,555 275,493 482,504 699,374" />
        <polyline className="control-wave" points="690,126 586,225 500,366 394,476 250,626" />
        <g className="cooling-pipe-network">
          <polyline points="94,310 192,294 315,330 452,292 620,330 722,302" />
          <polyline points="72,476 190,434 342,464 508,438 682,476" />
          <polyline points="170,602 292,552 418,578 576,522 714,570" />
          <polyline className="return" points="230,180 300,314 420,366 548,512 676,642" />
        </g>
      </svg>

      <div className="floor-tabs-code">
        {['3F', '2F', '1F', 'B1'].map((floor, index) => <button className={index === 1 ? 'active' : ''} key={floor}>{floor}</button>)}
      </div>

      {zones.map((zone) => (
        <div className={`zone-card-code ${zone.card} ${zone.tone}`} key={zone.name}>
          <div><strong>{zone.name}</strong><i /></div>
          <p><span>温度</span><b>{zone.temp}</b></p>
          <p><span>湿度</span><b>{zone.humidity}</b></p>
          <p><span>人员密度</span><b>{zone.density}</b></p>
          <p><span>设备负载</span><b>{zone.load}</b></p>
        </div>
      ))}

      <div className="legend-code">
        <span><Gauge size={20} /> 空调末端</span>
        <span><RadioTower size={20} /> 冷却塔</span>
        <span><Snowflake size={20} /> 冷水机组</span>
        <span><Fan size={20} /> 风机</span>
        <span><Thermometer size={20} /> 传感器</span>
        <em />
        <b>冷却水管</b>
        <b>冷却末管</b>
        <b>数据流</b>
      </div>
    </div>
  );
}

function AiCenter({ sensors, controls, fallbackControls, ai }) {
  const visibleControls = controls.length > 0 ? controls : fallbackControls;
  const forecast = ai?.recommendedActions?.[0] ?? '基于实时负荷进行滚动预测';
  const anomalyCounts = [
    ai?.riskLevel === 'critical' ? 2 : 0,
    ai?.riskLevel === 'warning' ? 2 : 1,
    ai?.riskLevel === 'normal' ? 0 : 1
  ];

  return (
    <div className="ai-code">
      <div className="ai-code-title">AI智能控制中枢</div>
      <div className="ai-command-matrix" aria-hidden="true">
        <span>MODEL SYNC</span>
        <span>CONTROL LOOP</span>
        <span>AUTONOMY 92%</span>
      </div>
      <span className="cognition-stream stream-a" aria-hidden="true" />
      <span className="cognition-stream stream-b" aria-hidden="true" />
      <div className="autonomy-gauge" aria-label="AI自主调控置信度">
        <strong>92%</strong>
        <span>自主调控置信度</span>
      </div>
      <svg className="decision-link-field" viewBox="0 0 620 535" aria-hidden="true">
        <path className="decision-link sensing upper" d="M104 108 C184 118 226 173 301 249" />
        <path className="decision-link sensing lower" d="M104 326 C178 314 222 280 300 260" />
        <path className="decision-link control upper" d="M316 248 C392 172 438 118 516 108" />
        <path className="decision-link control lower" d="M316 260 C394 282 442 314 516 326" />
        <circle className="decision-packet packet-a" r="4" />
        <circle className="decision-packet packet-b" r="4" />
        <circle className="decision-packet packet-c" r="4" />
        <circle className="decision-packet packet-d" r="4" />
      </svg>
      <span className="decision-label sensing">实时感知入模</span>
      <span className="decision-label control">控制策略下发</span>
      <div className="ai-flow-node node-a" />
      <div className="ai-flow-node node-b" />
      <div className="ai-flow-node node-c" />
      <div className="ai-flow-node node-d" />
      <Panel title="环境感知" className="sensor-code-panel">
        {sensors.map(([label, value, iconName]) => {
          const Icon = resolveIcon(iconName, RadioTower);
          return (
          <div className="sensor-code" key={label}>
            <Icon size={30} />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
          );
        })}
      </Panel>
      <div className="ai-core-code">
        <Panel title="负荷预测" className="forecast-code">
          <span>{forecast}</span>
          <svg viewBox="0 0 220 58">
            <path d="M0 42 C22 44 28 13 52 13 S81 50 106 36 S132 6 158 18 S184 52 220 24" />
          </svg>
        </Panel>
        <div className="ai-brain">
          <span className="quantum-sun" />
          <span className="core-shockwave" />
          <span className="strategy-platform" />
          <span className="strategy-beam" />
          <span className="strategy-glass-dome" />
          <span className="neural-core-layers" />
          <i className="orbit a" />
          <i className="orbit b" />
          <i className="orbit c" />
          <Brain size={118} />
          <strong>AI策略引擎</strong>
          {Array.from({ length: 8 }, (_, index) => <span className={`brain-ray r${index}`} key={index} />)}
        </div>
        <Panel title="异常检测" className="anomaly-code">
          <span>{ai?.summary ?? '实时监测与预警'}</span>
          <div>{anomalyCounts.map((value, index) => <b key={index}>{value}</b>)}</div>
        </Panel>
      </div>
      <Panel title="智能调控" className="control-code-panel">
        {visibleControls.slice(0, 6).map(([label, value, iconName]) => {
          const Icon = resolveIcon(iconName, Gauge);
          return (
          <div className="control-code" key={label}>
            <Icon size={31} />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
          );
        })}
      </Panel>
    </div>
  );
}

function Analytics({ alerts, statusRings, metrics, ai }) {
  return (
    <div className="analytics-code">
      <span className="analytics-scan-orbit" />
      <div className="intelligence-ribbon" aria-hidden="true">
        <span>AI PREDICTIVE ENGINE</span>
        <span>THERMAL LOAD SIMULATION</span>
        <span>COST IMPACT LIVE</span>
      </div>
      <Panel title="能耗与运行分析" action={`实时总能耗 ${metrics.realtime_energy ?? 0} kWh`} className="energy-code-panel">
        <h3>实时能耗趋势（kWh）</h3>
        <span className="chart-sweep" />
        <MiniLineChart />
        <div className="analytics-row">
          <div>
            <h3>冷却系统能效COP</h3>
            <div className="bar-code">
              {[3.21, 3.48, 3.67, 4.02, 4.28].map((value) => (
                <span key={value} style={{ height: `${value * 19}px` }}><i className="bar-spark" /><b>{value}</b></span>
              ))}
            </div>
          </div>
          <div>
            <h3>能耗构成占比</h3>
            <div className="donut-code"><span className="donut-radar" /></div>
            <ul className="donut-legend">
              <li><i />冷却系统 48%</li>
              <li><i />生产设备 32%</li>
              <li><i />照明温控 12%</li>
              <li><i />其他系统 8%</li>
            </ul>
          </div>
        </div>
        <div className="saving-code">
          <span className="saving-flow" />
          <article><span>传统策略</span><strong>98,756</strong><em>65,585 元</em></article>
          <b>VS</b>
          <article><span>AI优化策略</span><strong>72,341</strong><em>{Math.max(0, 65585 - (metrics.saving_cost ?? 0)).toLocaleString()} 元</em></article>
          <article className="result"><span>节能效果</span><strong>{metrics.saving_rate ?? ai?.expectedSavings?.saving_rate_percent ?? 0}%</strong><em>{(metrics.saving_cost ?? 0).toLocaleString()} 元</em></article>
        </div>
      </Panel>
      <Panel title="告警与事件" action="查看全部 >" className="alerts-code-panel">
        {alerts.slice(0, 5).map((item) => (
          <p className={item.level} key={`${item.message}-${item.time}`}><i className="alert-pulse" /><span>{item.message}</span><time>{item.time}</time></p>
        ))}
      </Panel>
      <Panel title="系统运行状态" action="更多 >" className="status-code-panel">
        {statusRings.map(([label, value, state]) => (
          <div className="status-label" key={label}>
            <span>{label}</span>
            <div className="ring-code"><strong>{value}</strong><em>{state}</em></div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function CodeDashboard() {
  const [tick, setTick] = useState(0);
  const [payload, setPayload] = useState(() => createFallbackDashboardPayload(0));
  const viewModel = useMemo(() => buildDashboardViewModel(payload), [payload]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (tick % 10 !== 0) return undefined;

    fetchLiveDashboardPayload({ tick })
      .then((nextPayload) => {
        if (!cancelled) setPayload(nextPayload);
      })
      .catch(() => {
        if (!cancelled) setPayload(createFallbackDashboardPayload(tick));
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return (
    <main className="code-shell">
      <section className="code-dashboard" aria-label="FactoryCool 代码还原大屏">
        <div className="cosmic-grid" />
        <div className="scanline-wash" />
        <div className="data-rain" />
        <div className="cinematic-beams" />
        <div className="tactical-depth-lines" />
        <aside className="command-spine left" aria-hidden="true">
          <span>CORE</span>
          <span>ENERGY</span>
          <span>THERMAL</span>
          <span>COOLING</span>
        </aside>
        <aside className="command-spine right" aria-hidden="true">
          <span>AI OPS</span>
          <span>TWIN</span>
          <span>ALERT</span>
          <span>SYNC</span>
        </aside>
        <div className="hud-frame top-left" />
        <div className="hud-frame top-right" />
        <div className="hud-frame bottom-left" />
        <div className="hud-frame bottom-right" />
        <header className="code-header">
          <div className="header-left"><Cloud size={20} /> 2025-05-20&nbsp;&nbsp;10:30:{String((45 + tick) % 60).padStart(2, '0')}&nbsp;&nbsp;星期二</div>
          <div className="header-title">
            <h1>FactoryCool：智能冷却与能耗数字孪生系统</h1>
            <p>工业车间智能冷却 · AI优化调控 · 能耗可视化</p>
          </div>
          <div className="header-right">☁ 多云&nbsp;&nbsp;26°C&nbsp;&nbsp;湿度 65%&nbsp;&nbsp;|&nbsp;&nbsp;上海　工厂A区</div>
        </header>
        <nav className="mission-strip" aria-label="运行态势">
          <span>MISSION ACTIVE</span>
          <span>THERMAL FIELD ONLINE</span>
          <span>AI CONTROL LOOP {String(tick % 100).padStart(2, '0')}</span>
          <span>ENERGY SAVING MODE</span>
        </nav>

        <Panel title="数字孪生 · 车间全景" className="twin-code-panel">
          <div className="temperature-code"><span>温度(°C)</span><i /><b>18</b><b>22</b><b>26</b><b>30</b><b>34</b><b>38</b></div>
          <FactoryTwin zones={viewModel.zones} />
        </Panel>

        <AiCenter
          ai={viewModel.ai}
          sensors={viewModel.sensors}
          controls={viewModel.controls}
          fallbackControls={viewModel.fallbackControls}
        />
        <Analytics
          ai={viewModel.ai}
          alerts={viewModel.alerts}
          statusRings={viewModel.statusRings}
          metrics={viewModel.metrics}
        />

        <section className="kpi-code-strip">
          {viewModel.kpis.map(([label, value, unit, sub, iconName, tone]) => {
            const Icon = resolveIcon(iconName, Gauge);
            return (
            <article className={`kpi-code ${tone}`} key={label}>
              <span className="kpi-energy-orbit" />
              <Icon size={60} />
              <div>
                <span>{label}</span>
                <strong>{value}<em>{unit}</em></strong>
                <small>{sub}</small>
              </div>
            </article>
            );
          })}
        </section>

        <footer className="ticker-code">
          <strong>⊕ 系统消息</strong>
          <time>{viewModel.ticker.time}</time>
          <span>{viewModel.ticker.message}</span>
          <em>数据更新频率：10秒　　AI模型：{viewModel.ai.model ?? 'fallback'}　　异常数：{viewModel.ticker.abnormalCount}</em>
        </footer>
      </section>
    </main>
  );
}
