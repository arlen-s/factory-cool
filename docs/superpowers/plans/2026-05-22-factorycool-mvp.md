# FactoryCool MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable high-fidelity digital twin dashboard for FactoryCool.

**Architecture:** React renders the cockpit dashboard, Three.js renders the factory twin, ECharts renders analytics, and FastAPI streams simulated dashboard snapshots over WebSocket. Core simulation functions are covered by automated tests.

**Tech Stack:** React, Vite, Three.js, ECharts, FastAPI, WebSocket, Docker Compose.

---

### Task 1: PM and Workflow Files

**Files:**
- Create: `.chorus/roles.md`
- Create: `.chorus/workflow.md`
- Modify: `.chorus/state.json`
- Create: `docs/proposal.md`
- Create: `docs/requirements.md`
- Create: `docs/architecture.md`
- Create: `docs/deployment.md`

- [x] Define roles, phases, artifacts, and acceptance criteria.

### Task 2: Core Simulation

**Files:**
- Create: `frontend/src/test/simulation.test.js`
- Create: `frontend/src/lib/simulation.js`
- Create: `backend/tests/test_simulator.py`
- Create: `backend/app/simulator.py`

- [x] Write failing tests for zone classification, energy summary, series generation, and snapshots.
- [x] Implement frontend and backend simulator functions.
- [x] Run tests and confirm passing.

### Task 3: Frontend Dashboard

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/components/*.jsx`
- Create: `frontend/src/styles/dashboard.css`

- [ ] Implement 16:9 cockpit layout based on the reference image.
- [ ] Render Three.js factory twin and ECharts analytics.
- [ ] Add scenario controls and WebSocket fallback data.

### Task 4: Backend API

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/requirements.txt`

- [ ] Expose `/health`, `/api/snapshot`, and `/ws/dashboard`.
- [ ] Stream simulated snapshots every second.

### Task 5: DevOps

**Files:**
- Create: `docker-compose.yml`
- Create: `frontend/Dockerfile`
- Create: `backend/Dockerfile`
- Create: `.github/workflows/ci.yml`

- [ ] Add repeatable local and CI commands.
- [ ] Verify tests and builds.
