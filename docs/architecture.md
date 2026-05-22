# FactoryCool Architecture

## Frontend

- `React`: 组件化大屏。
- `Three.js`: 车间数字孪生画布。
- `ECharts`: 能耗折线图、COP 柱状图、构成环图。
- `CSS`: 高保真科技驾驶舱视觉系统。

## Backend

- `FastAPI`: REST 和 WebSocket 数据服务。
- `app.simulator`: 生成时间序列、区域指标、AI 决策、告警和 KPI。

## Data Flow

1. 前端打开后连接 `ws://localhost:8000/ws/dashboard`。
2. 后端每秒生成 dashboard snapshot。
3. 前端更新数字孪生、AI 中枢、图表、告警和 KPI。
4. 用户切换场景时前端发送 REST 请求或本地应用场景倍率。
