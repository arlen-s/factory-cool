# FactoryCool Proposal

FactoryCool 是一个智能冷却与能耗数字孪生系统，用于虚拟化展示工厂车间冷却运行状态、AI 控制动作和节能效果。

首版目标是实现一个可演示的大屏 MVP：通过模拟数据驱动 3D/2.5D 车间、区域热力图、AI 策略引擎、能耗图表、异常告警和交互场景切换。真实 LSTM、强化学习、Autoencoder 模型放入第二阶段。

## MVP Scope

- 高保真 16:9 科技大屏，视觉参考 `factorycool.png`。
- React + Three.js + ECharts 前端展示。
- FastAPI + WebSocket 后端模拟实时数据。
- 支持正常、高峰、低负荷、无人四种场景。
- Docker Compose 提供一键运行基础。
