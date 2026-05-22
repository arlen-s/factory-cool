# FactoryCool Requirements

## Functional Requirements

- 展示工厂车间数字孪生布局，包含机加工区、装配区、注塑区、仓储区、检测区、办公区。
- 展示每个区域温度、湿度、人员密度和设备负载。
- 展示 AI 控制中枢：环境感知、负荷预测、策略引擎、智能调控、异常检测。
- 展示实时总能耗、COP、能耗构成、节能对比、告警事件和系统运行状态。
- 提供场景切换，模拟高峰作业、低负荷、无人车间等状态。

## Acceptance Criteria

- 前端大屏能在 Chrome 中运行，目标画布为 16:9，主视觉接近参考图。
- WebSocket 可持续推送 dashboard snapshot。
- 场景切换后温度、负荷、告警和图表会变化。
- `npm test` 可通过前后端核心模拟逻辑测试。
- `docker compose up --build` 能启动前端和后端服务。
