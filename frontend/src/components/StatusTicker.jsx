import { PlusCircle } from 'lucide-react';

export function StatusTicker({ connected }) {
  return (
    <footer className="status-ticker">
      <div>
        <PlusCircle size={20} />
        <strong>系统消息</strong>
        <time>10:29</time>
        <span>装配区温度偏高，AI已自动调整空调末端风量和冷水机组负荷，预计15分钟内恢复正常。</span>
      </div>
      <div>
        <span>数据更新频率：10秒</span>
        <span>系统版本：v2.3.1</span>
        <span>{connected ? 'WebSocket 已连接' : '本地模拟运行'}</span>
      </div>
    </footer>
  );
}
