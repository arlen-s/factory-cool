import { ArrowDown, Bell, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

import { EChart } from './EChart.jsx';
import { Panel } from './Panel.jsx';

const chartText = '#bfeeff';
const gridLine = 'rgba(103, 218, 255, 0.16)';

export function AnalyticsPanel({ snapshot }) {
  const lineOption = {
    color: ['#18e9ff', '#55ff91'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: chartText, fontSize: 10 } },
    grid: { top: 34, left: 38, right: 12, bottom: 26 },
    xAxis: { type: 'category', data: snapshot.energySeries.map((item) => item.time), axisLabel: { color: chartText, interval: 3 }, axisLine: { lineStyle: { color: gridLine } } },
    yAxis: { type: 'value', axisLabel: { color: chartText }, splitLine: { lineStyle: { color: gridLine } } },
    series: [
      { name: '总能耗', type: 'line', smooth: true, data: snapshot.energySeries.map((item) => item.baseline), showSymbol: false },
      { name: '冷却系统能耗', type: 'line', smooth: true, data: snapshot.energySeries.map((item) => item.optimized), showSymbol: false }
    ]
  };

  const copOption = {
    color: ['#1d8aff', '#18e9ff'],
    grid: { top: 20, left: 38, right: 8, bottom: 24 },
    xAxis: { type: 'category', data: ['昨日', '前日', '近7日', '近30日', '本月'], axisLabel: { color: chartText }, axisLine: { lineStyle: { color: gridLine } } },
    yAxis: { type: 'value', show: false },
    series: [{ type: 'bar', data: [3.21, 3.48, 3.67, 4.02, 4.28], barWidth: 18, label: { show: true, position: 'top', color: chartText } }]
  };

  const pieOption = {
    color: ['#1aa7ff', '#28f0d5', '#dfe85a', '#4f76ff'],
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['50%', '78%'], center: ['44%', '52%'], data: [
      { name: '冷却系统', value: 48 },
      { name: '生产设备', value: 32 },
      { name: '照明温控', value: 12 },
      { name: '其他系统', value: 8 }
    ], label: { color: chartText, formatter: '{b} {d}%' } }]
  };

  const alerts = snapshot.alerts ?? [
    { level: 'critical', message: '装配区温度 30.2°C，超过阈值 30°C', time: '10:29:45' },
    { level: 'warning', message: '冷却塔 CT-02 电机电流异常', time: '10:24:18' },
    { level: 'warning', message: '能耗较昨日周期上升 15.3%', time: '10:15:32' }
  ];

  return (
    <aside className="analytics-column">
      <Panel title="能耗与运行分析" action={`实时总能耗 ${snapshot.metrics.realtimeEnergy} kWh`} className="analysis-panel">
        <h3>实时能耗趋势（kWh）</h3>
        <EChart option={lineOption} className="line-chart" />
        <div className="chart-row">
          <div>
            <h3>冷却系统能效COP</h3>
            <EChart option={copOption} className="small-chart" />
          </div>
          <div>
            <h3>能耗构成占比</h3>
            <EChart option={pieOption} className="small-chart" />
          </div>
        </div>
        <div className="saving-row">
          <div className="saving-card old"><span>传统策略</span><strong>98,756</strong><em>kWh</em><b>65,585 元</b></div>
          <div className="versus">VS</div>
          <div className="saving-card ai"><span>AI优化策略</span><strong>72,341</strong><em>kWh</em><b>48,123 元</b></div>
          <div className="saving-card result"><span>节能效果</span><strong>{snapshot.metrics.savingRate}%</strong><ArrowDown size={34} /><b>{snapshot.metrics.savingCost.toLocaleString()} 元</b></div>
        </div>
      </Panel>

      <Panel title="告警与事件" action="查看全部 >" className="alerts-panel">
        <ul className="alert-list">
          {alerts.map((alert, index) => (
            <li className={alert.level} key={`${alert.time}-${index}`}>
              {alert.level === 'critical' ? <TriangleAlert size={18} /> : <Bell size={18} />}
              <span>{alert.message}</span>
              <time>{alert.time}</time>
            </li>
          ))}
          <li className="info"><Info size={18} /><span>冷水机组 CH-01 建议维护保养</span><time>09:50:11</time></li>
          <li className="info"><Info size={18} /><span>已切换至“节能优先”策略模式</span><time>09:30:05</time></li>
        </ul>
      </Panel>

      <Panel title="系统运行状态" action="更多 >" className="status-panel">
        <div className="status-rings">
          {['3/3', '4/4', '28/30', '16/16', '42/45'].map((value, index) => (
            <div className="status-ring" key={value}>
              <CheckCircle2 size={22} />
              <strong>{value}</strong>
              <span>{['冷水机组', '冷却塔', '空调末端', '风机系统', '阀门执行器'][index]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </aside>
  );
}
