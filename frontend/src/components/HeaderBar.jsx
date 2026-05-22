import { Cloud, CloudSun, MapPin } from 'lucide-react';

export function HeaderBar({ connected }) {
  return (
    <header className="header-bar">
      <div className="header-meta">
        <Cloud size={22} />
        <span>2025-05-20</span>
        <span>10:30:45</span>
        <span>星期二</span>
      </div>
      <div className="title-wrap">
        <h1>FactoryCool：智能冷却与能耗数字孪生系统</h1>
        <p>工业车间智能冷却 · AI优化调控 · 能耗可视化</p>
      </div>
      <div className="header-weather">
        <CloudSun size={24} />
        <span>多云</span>
        <span>26°C</span>
        <span>湿度 65%</span>
        <MapPin size={18} />
        <span>上海 工厂A区</span>
        <span className={connected ? 'link live' : 'link'}>{connected ? '实时' : '模拟'}</span>
      </div>
    </header>
  );
}
