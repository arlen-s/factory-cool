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
- Chrome headless screenshot confirms the dashboard renders at `1920 x 1080`.
- High-fidelity pass: the front-end uses the provided `factorycool.png` reference as the exact visual base and overlays restrained scanline, AI flow, pulse beacon, chart sweep, KPI glow, and alert flash animations.
- Asset integrity check: `frontend/public/assets/factorycool-reference.png` has the same SHA-256 hash as `/Users/mac/Downloads/factorycool.png`.

## Notes

- The current high-fidelity view intentionally prioritizes visual restoration of the supplied design image. The previous React/Three.js/ECharts components remain in the codebase as implementation reference for future data-driven reconstruction.
