import { BrainCircuit, Droplets, Fan, Gauge, Lightbulb, RadioTower, ShieldAlert, Snowflake, Users, Zap } from 'lucide-react';

import { Panel } from './Panel.jsx';

const sensors = [
  ['温度传感器', '128 个', Gauge],
  ['湿度传感器', '96 个', Droplets],
  ['CO₂传感器', '64 个', RadioTower],
  ['人员计数器', '48 个', Users],
  ['设备采集器', '72 个', BrainCircuit],
  ['电表水表', '32 个', Zap]
];

const controls = [
  ['冷水机组', '运行中', Snowflake],
  ['冷却塔', '运行中', RadioTower],
  ['空调末端', '运行中', Gauge],
  ['风机系统', '运行中', Fan],
  ['阀门调节', '调节中', Droplets],
  ['照明系统', '优化中', Lightbulb]
];

export function AiControlCenter({ snapshot }) {
  return (
    <section className="ai-column">
      <div className="ai-title">AI智能控制中枢</div>
      <div className="ai-layout">
        <Panel title="环境感知" className="sensing-panel">
          <div className="sensor-list">
            {sensors.map(([label, value, Icon]) => (
              <div className="sensor-item" key={label}>
                <Icon size={28} />
                <div><span>{label}</span><strong>{value}</strong></div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="strategy-core">
          <div className="forecast-card">
            <h3>负荷预测</h3>
            <span>未来2小时预测</span>
            <svg viewBox="0 0 220 52" aria-hidden="true">
              <path d="M0 35 C25 35 28 12 52 12 S78 45 106 34 S132 8 158 15 S183 45 220 22" />
            </svg>
          </div>
          <div className="brain-ring">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <BrainCircuit size={98} />
            <strong>AI策略引擎</strong>
          </div>
          <div className="anomaly-card">
            <ShieldAlert size={26} />
            <div>
              <strong>异常检测</strong>
              <span>实时监测与预警</span>
            </div>
          </div>
          <div className="mini-alerts">
            <span>高温异常 <b>{Math.max(1, snapshot.metrics.abnormalCount - 1)}</b></span>
            <span>设备异常 <b>1</b></span>
            <span>能耗异常 <b>0</b></span>
          </div>
        </div>

        <Panel title="智能调控" className="control-panel">
          <div className="control-list">
            {controls.map(([label, value, Icon]) => (
              <div className="control-item" key={label}>
                <Icon size={30} />
                <div><span>{label}</span><strong>{value}</strong></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}
