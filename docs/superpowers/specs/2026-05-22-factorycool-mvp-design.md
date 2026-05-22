# FactoryCool MVP Design

## Goal

Build a high-fidelity, demo-ready digital twin dashboard for intelligent factory cooling and energy optimization.

## Scope

The first release prioritizes visual demonstration and real-time interaction over production-grade AI training. It includes simulated sensor data, explainable AI control decisions, energy comparison charts, alerts, and scenario controls.

## Architecture

- React renders the 16:9 cockpit UI.
- Three.js renders the central factory twin canvas.
- ECharts renders analytics panels.
- FastAPI exposes REST and WebSocket endpoints.
- Python simulator produces deterministic dashboard snapshots.

## Roles

- PM owns proposal, requirements, tasks, and acceptance criteria.
- Frontend Developer owns dashboard fidelity and interactivity.
- Backend Developer owns simulator and API.
- QA owns visual/function acceptance.
- DevOps owns Docker and deployment notes.

## Acceptance

- Core simulator tests pass.
- Frontend can run locally through Vite.
- Backend can run locally through Uvicorn.
- Dashboard visually follows the provided reference image.
