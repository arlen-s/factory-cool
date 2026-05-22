# QA Report

Status: Passed for local MVP verification.

## Environment

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`
- Screenshot: `reports/factorycool-screenshot.png`

## Automated Checks

- `npm test`: passed.
- `npm --prefix frontend run build`: passed.
- Backend import check: `.venv/bin/python -B -c "import app.main; print('api import ok')"` passed.

## Functional Checks

- `/health` returns `{"status":"ok","service":"factorycool-api"}`.
- `/api/snapshot` returns FactoryCool zones, energy series, AI flow, alerts, and metrics.
- Chrome headless screenshot confirms the dashboard renders with header, digital twin area, AI control center, analytics panels, KPI strip, alert list, and system status.
- Chrome DevTools Protocol interaction check clicked `高峰作业`; the active scenario changed from `标准运行` to `高峰作业`, KPI/AI/alert text remained present, and runtime exception count was `0`.

## Notes

- The screenshot environment cannot create a WebGL context, so `TwinCanvas` uses the implemented 2.5D fallback. Real browsers with WebGL support will use the Three.js canvas path.
- Vite build reports a large JavaScript chunk warning from Three.js/ECharts; it does not block the MVP.
