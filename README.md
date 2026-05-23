# FactoryCool

智能冷却与能耗数字孪生系统。首版实现了一个可演示的大屏 MVP：React 驾驶舱、数字孪生车间、AI 控制中枢、ECharts 能耗分析、FastAPI 模拟数据服务和 WebSocket 实时推送。

## Run Locally

```bash
npm install --prefix frontend
python3 -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements.txt
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://127.0.0.1:5173`

Backend: `http://127.0.0.1:8000`

## Verify

```bash
npm test
npm --prefix frontend run build
docker compose config
```
