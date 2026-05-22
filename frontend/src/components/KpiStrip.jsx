import { AlertTriangle, Cloud, Leaf, Smile, Thermometer, Zap } from 'lucide-react';

export function KpiStrip({ metrics }) {
  const kpis = [
    { label: '实时能耗', value: metrics.realtimeEnergy, unit: 'kWh', sub: '较昨日同期 ↓ 8.7%', icon: Zap, tone: 'cyan' },
    { label: '节能率（本月）', value: metrics.savingRate, unit: '%', sub: '较上月 ↑ 4.3%', icon: Leaf, tone: 'green' },
    { label: '平均温度', value: metrics.averageTemperature, unit: '°C', sub: '较昨日 ↓ 1.2°C', icon: Thermometer, tone: 'blue' },
    { label: '舒适度（PMV）', value: metrics.comfort, unit: '', sub: '舒适', icon: Smile, tone: 'lime' },
    { label: '设备异常数', value: metrics.abnormalCount, unit: '个', sub: '较昨日 ↑ 1', icon: AlertTriangle, tone: 'red' },
    { label: '碳减排（本月）', value: metrics.carbonReduction, unit: '吨', sub: '较上月 ↓ 12.4吨', icon: Cloud, tone: 'sky' }
  ];

  return (
    <section className="kpi-strip">
      {kpis.map(({ label, value, unit, sub, icon: Icon, tone }) => (
        <article className={`kpi ${tone}`} key={label}>
          <Icon size={54} />
          <div>
            <span>{label}</span>
            <strong>{value}<em>{unit}</em></strong>
            <small>{sub}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
