import { Fan, Snowflake, Thermometer, Waves, Zap } from 'lucide-react';

import { Panel } from './Panel.jsx';
import { TwinCanvas } from './TwinCanvas.jsx';

const floors = ['3F', '2F', '1F', 'B1'];

function ZoneCard({ zone, index }) {
  return (
    <article className={`zone-card zone-${index + 1} ${zone.level}`}>
      <div className="zone-title">
        <strong>{zone.name}</strong>
        <span />
      </div>
      <dl>
        <div><dt>温度</dt><dd>{zone.temperature}°C</dd></div>
        <div><dt>湿度</dt><dd>{zone.humidity}%</dd></div>
        <div><dt>人员密度</dt><dd>{zone.occupancy} 人/m²</dd></div>
        <div><dt>设备负载</dt><dd>{zone.load}%</dd></div>
      </dl>
    </article>
  );
}

export function DigitalTwin({ snapshot }) {
  return (
    <Panel title="数字孪生 · 车间全景" className="twin-panel">
      <div className="heat-legend">
        <span>温度(°C)</span>
        <div className="legend-ramp" />
        <div className="legend-values"><b>18</b><b>22</b><b>26</b><b>30</b><b>34</b><b>38</b></div>
      </div>
      <div className="floor-tabs">
        {floors.map((floor, index) => (
          <button className={index === 1 ? 'active' : ''} key={floor} type="button">{floor}</button>
        ))}
      </div>
      <div className="twin-stage">
        <TwinCanvas zones={snapshot.zones} tick={snapshot.tick} />
        {snapshot.zones.map((zone, index) => <ZoneCard key={zone.id} zone={zone} index={index} />)}
      </div>
      <div className="device-legend">
        <span><Snowflake size={22} /> 空调末端</span>
        <span><Waves size={22} /> 冷却塔</span>
        <span><Zap size={22} /> 冷水机组</span>
        <span><Fan size={22} /> 风机</span>
        <span><Thermometer size={22} /> 传感器</span>
      </div>
    </Panel>
  );
}
